import data from './runner-rigs.json' with { type: 'json' };
export const runnerRigs = data;
export function stridePose(ms) {
    const phase = ms / 120, s = Math.sin(phase);
    return { leftLeg: s * .65, rightLeg: -s * .65, leftArm: -s * .45, rightArm: s * .45, leftKnee: .10 + Math.max(0, s) * .75, rightKnee: .10 + Math.max(0, -s) * .75, leftElbow: s * .08, rightElbow: -s * .08, lean: .035 + Math.cos(phase * 2) * .012 };
}
function surface(w, h) {
    if (typeof OffscreenCanvas !== 'undefined')
        return new OffscreenCanvas(w, h);
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    }
    return undefined;
}
const cache = new WeakMap();
const names = ['leftLeg', 'rightLeg', 'leftArm', 'rightArm'];
function inside(x, y, poly) {
    let hit = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const a = poly[i], b = poly[j];
        if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0])
            hit = !hit;
    }
    return hit;
}
function distance(x, y, a, b, aspect) {
    const ax = a[0] * aspect, ay = a[1], dx = (b[0] - a[0]) * aspect, dy = b[1] - a[1], px = x * aspect - ax, py = y - ay;
    const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));
    return (px - dx * t) ** 2 + (py - dy * t) ** 2;
}
/** Assign each nontransparent source pixel to exactly one bone layer. This
 * avoids polygon clipping leaving strips of the original static limbs behind.
 * Masks and lighting are prepared once, never recomputed in the frame loop. */
function prepare(source, id) {
    const prior = cache.get(source)?.get(id);
    if (prior)
        return prior;
    const rig = runnerRigs[id];
    if (!rig)
        return;
    const ratio = Math.min(1, 560 / Math.max(source.naturalWidth, source.naturalHeight)), w = Math.round(source.naturalWidth * ratio), h = Math.round(source.naturalHeight * ratio);
    const canvas = surface(w, h);
    if (!canvas)
        return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx)
        return;
    ctx.drawImage(source, 0, 0, w, h);
    const pixels = ctx.getImageData(0, 0, w, h), labels = new Uint8Array(w * h);
    const bounds = Array.from({ length: 10 }, () => ({ x: w, y: h, right: 0, bottom: 0 }));
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const i = y * w + x, offset = i * 4;
            if (!pixels.data[offset + 3])
                continue;
            const nx = x / w, ny = y / h, r = pixels.data[offset], g = pixels.data[offset + 1], b = pixels.data[offset + 2];
            // Hair behind the shoulders is retained independently of moving clothing.
            const warmHair = r > g * 1.08 && r > b * 1.08;
            const head = inside(nx, ny, rig.head) && (ny < .27 || nx > .55 || warmHair);
            let label = head ? 1 : inside(nx, ny, rig.torso) ? 2 : 0;
            if (!label) {
                let best = Infinity;
                names.forEach((name, index) => { const [a, joint, end] = rig.bones[name]; const upper = distance(nx, ny, a, joint, w / h), lower = distance(nx, ny, joint, end, w / h); if (upper < best) {
                    best = upper;
                    label = 3 + index * 2;
                } if (lower < best) {
                    best = lower;
                    label = 4 + index * 2;
                } });
            }
            labels[i] = label;
            const box = bounds[label - 1];
            box.x = Math.min(box.x, x);
            box.y = Math.min(box.y, y);
            box.right = Math.max(box.right, x + 1);
            box.bottom = Math.max(box.bottom, y + 1);
        }
    // A source texture can have detached antialiased scraps near an occluding
    // limb. Keep each garment/bone's connected silhouette, avoiding floating scraps.
    const visited = new Uint8Array(w * h);
    for (let label = 2; label <= 10; label++) {
        const groups = [];
        for (let seed = 0; seed < labels.length; seed++)
            if (labels[seed] === label && !visited[seed]) {
                const group = [seed];
                visited[seed] = 1;
                for (let q = 0; q < group.length; q++) {
                    const v = group[q], x = v % w;
                    for (const n of [x ? v - 1 : -1, x < w - 1 ? v + 1 : -1, v - w, v + w])
                        if (n >= 0 && n < labels.length && !visited[n] && labels[n] === label) {
                            visited[n] = 1;
                            group.push(n);
                        }
                }
                groups.push(group);
            }
        const largest = Math.max(0, ...groups.map(g => g.length));
        for (const group of groups)
            if (group.length < largest * .025)
                for (const i of group)
                    labels[i] = 0;
    }
    const images = bounds.map(box => box.right > box.x ? ctx.createImageData(box.right - box.x, box.bottom - box.y) : null);
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const label = labels[y * w + x];
            if (!label)
                continue;
            const box = bounds[label - 1], image = images[label - 1], offset = (y * w + x) * 4, target = ((y - box.y) * image.width + x - box.x) * 4;
            // Source faces and all warm skin/hair tones are not recolored. Gentle neutral
            // garment lighting only reinforces the reference art's existing folds.
            const r = pixels.data[offset], g = pixels.data[offset + 1], b = pixels.data[offset + 2], warm = r > g * 1.12 && r > b * 1.15;
            const light = label === 1 || warm ? 1 : 1.035 - (x / w) * .075;
            image.data[target] = Math.min(255, r * light);
            image.data[target + 1] = Math.min(255, g * light);
            image.data[target + 2] = Math.min(255, b * light);
            image.data[target + 3] = pixels.data[offset + 3];
        }
    const layers = [];
    images.forEach((image, index) => { if (!image)
        return; const box = bounds[index], part = surface(image.width, image.height); part.getContext('2d').putImageData(image, 0, 0); layers.push({ image: part, x: box.x / w, y: box.y / h, w: image.width / w, h: image.height / h, label: index + 1 }); });
    const result = { layers, w, h };
    let entries = cache.get(source);
    if (!entries) {
        entries = new Map();
        cache.set(source, entries);
    }
    entries.set(id, result);
    return result;
}
function drawLayer(ctx, layer, w, h) { ctx.drawImage(layer.image, (layer.x - .5) * w, (layer.y - .5) * h, layer.w * w, layer.h * h); }
function move(ctx, p, w, h, angle) { const x = (p[0] - .5) * w, y = (p[1] - .5) * h; ctx.translate(x, y); ctx.rotate(angle); ctx.translate(-x, -y); }
function angle(a, b, w, h) { return Math.atan2((b[1] - a[1]) * h, (b[0] - a[0]) * w); }
function length(a, b, w, h) { return Math.hypot((b[0] - a[0]) * w, (b[1] - a[1]) * h); }
function cap(ctx, image, p, sample, w, h, rx, ry = rx) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse((p[0] - .5) * w, (p[1] - .5) * h, w * rx, h * ry, 0, 0, Math.PI * 2);
    ctx.clip();
    const sw = image.naturalWidth * .045, sh = image.naturalHeight * .045;
    ctx.drawImage(image, sample[0] * image.naturalWidth - sw / 2, sample[1] * image.naturalHeight - sh / 2, sw, sh, (p[0] - .5 - rx) * w, (p[1] - .5 - ry) * h, rx * w * 2, ry * h * 2);
    ctx.restore();
}
export function strideJoints(id, w, h, ms) {
    const rig = runnerRigs[id];
    if (!rig)
        return undefined;
    const pose = stridePose(ms);
    return Object.fromEntries(names.map(name => {
        const [root, joint, end] = rig.bones[name], upper = Math.PI / 2 + pose[name];
        const lower = name.endsWith('Leg') ? upper + (name === 'leftLeg' ? pose.leftKnee : pose.rightKnee) : upper - 1.8 + (name === 'leftArm' ? pose.leftElbow : pose.rightElbow);
        const r = [(root[0] - .5) * w, (root[1] - .5) * h], a = length(root, joint, w, h), b = length(joint, end, w, h);
        const j = [r[0] + a * Math.cos(upper), r[1] + a * Math.sin(upper)];
        const e = [j[0] + b * Math.cos(lower), j[1] + b * Math.sin(lower)];
        return [name, { root: r, joint: j, end: e, upper, lower }];
    }));
}
export function drawStride(ctx, image, id, width, height, ms) {
    const prepared = prepare(image, id), rig = runnerRigs[id];
    if (!prepared || !rig) {
        ctx.drawImage(image, -width / 2, -height / 2, width, height);
        return;
    }
    const pose = stridePose(ms);
    // Fit the articulated standing reach uniformly, retaining source aspect ratio.
    const reach = Math.max(...['leftLeg', 'rightLeg'].map(name => { const [a, b, c] = rig.bones[name]; return a[1] + (length(a, b, width, height) + length(b, c, width, height)) / height + .10; }));
    const fit = 1 / Math.max(1, reach), w = width * fit, h = height * fit;
    const joints = strideJoints(id, w, h, ms);
    const feet = ['leftLeg', 'rightLeg'].map(name => joints[name].end[1] + h * .055);
    ctx.save();
    ctx.translate(0, height / 2 - Math.max(...feet));
    const draw = (label) => { const layer = prepared.layers.find(l => l.label === label); if (layer)
        drawLayer(ctx, layer, w, h); };
    const limb = (name, index) => {
        const [root, joint, end] = rig.bones[name], a = joints[name], upperRotation = a.upper - angle(root, joint, w, h);
        ctx.save();
        move(ctx, root, w, h, upperRotation);
        cap(ctx, image, joint, name.endsWith('Leg') ? rig.pantsSample : rig.clothSample, w, h, name.endsWith('Leg') ? .045 : .03);
        draw(3 + index * 2);
        ctx.save();
        move(ctx, joint, w, h, a.lower - angle(joint, end, w, h) - upperRotation);
        draw(4 + index * 2);
        ctx.restore();
        ctx.restore();
    };
    limb('leftArm', 2);
    limb('leftLeg', 0);
    limb('rightLeg', 1);
    const left = rig.bones.leftLeg[0], right = rig.bones.rightLeg[0];
    cap(ctx, image, [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2], rig.pantsSample, w, h, .09, .06);
    cap(ctx, image, rig.bones.leftArm[0], rig.clothSample, w, h, .045, .035);
    cap(ctx, image, rig.bones.rightArm[0], rig.clothSample, w, h, .04, .035);
    draw(2);
    limb('rightArm', 3);
    // Face and hair use the unchanged source-colored head layer, not a new drawing.
    draw(1);
    ctx.restore();
}
