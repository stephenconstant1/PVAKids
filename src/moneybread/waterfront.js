/** Level 1's supplied panorama. Ground is at image y=584 of 720, matching
 * runner y=292 after uniform .5 scaling. Prepare a blended repeat once. */
export class WaterfrontScene {
    image;
    ready = false;
    failed = false;
    tile;
    offset = 0;
    nearImage;
    nearReady = false;
    nearGlow;
    layerOffsets = { far: 0, near: 0, trees: 0, water: 0, railing: 0, path: 0 };
    constructor() {
        this.image = new Image();
        this.image.onload = () => { this.ready = true; };
        this.image.onerror = () => { this.failed = true; };
        this.image.src = new URL('../../assets/environments/city-waterfront.png?v=45.8', import.meta.url).href;
        this.nearImage = new Image();
        this.nearImage.onload = () => { this.nearReady = true; };
        this.nearImage.src = new URL('../../assets/environments/waterfront-near.png?v=45.9', import.meta.url).href;
    }
    prepare(height) {
        if (!this.ready || !this.image.naturalWidth)
            return;
        const scale = height / this.image.naturalHeight, w = Math.round(this.image.naturalWidth * scale), blend = 48;
        if (this.tile?.height === height)
            return this.tile;
        const tile = document.createElement('canvas');
        tile.width = w - blend;
        tile.height = height;
        const ctx = tile.getContext('2d');
        if (!ctx)
            return;
        ctx.drawImage(this.image, -blend, 0, w, height);
        const edge = document.createElement('canvas');
        edge.width = blend;
        edge.height = height;
        const e = edge.getContext('2d');
        if (!e)
            return;
        e.drawImage(this.image, 0, 0, w, height);
        e.globalCompositeOperation = 'destination-in';
        const fade = e.createLinearGradient(0, 0, blend, 0);
        fade.addColorStop(0, 'transparent');
        fade.addColorStop(1, 'black');
        e.fillStyle = fade;
        e.fillRect(0, 0, blend, height);
        ctx.drawImage(edge, tile.width - blend, 0);
        this.tile = tile;
        return tile;
    }
    draw(ctx, width, height, distance, time, reduced) {
        const tile = this.prepare(height);
        if (!tile)
            return false;
        const rates = { far: .7, near: 3.5, trees: 5, water: 1.6, railing: 9, path: 18 };
        for (const key of Object.keys(rates))
            this.layerOffsets[key] = reduced ? 0 : distance * rates[key];
        this.offset = this.layerOffsets.far % tile.width;
        for (let x = -this.offset; x < width; x += tile.width)
            ctx.drawImage(tile, x, 0);
        if (this.nearReady) {
            const scale = height * .56 / this.nearImage.naturalHeight, w = this.nearImage.naturalWidth * scale, h = this.nearImage.naturalHeight * scale;
            const y = height * .551 - 722 * scale, offset = this.layerOffsets.near % w;
            if (!this.nearGlow) {
                const glow = document.createElement('canvas');
                glow.width = this.nearImage.naturalWidth;
                glow.height = this.nearImage.naturalHeight;
                const g = glow.getContext('2d');
                if (g) {
                    g.strokeStyle = '#fff0c0';
                    g.lineWidth = 3;
                    g.fillStyle = '#ffe9a9';
                    for (let i = 0; i < 6; i++) {
                        const x = i * glow.width / 6 + glow.width / 12;
                        g.strokeRect(x - 45, 310, 90, 330);
                        for (let yy = 340; yy < 620; yy += 28)
                            for (let xx = x - 35; xx < x + 36; xx += 22)
                                g.fillRect(xx, yy, 5, 8);
                    }
                    g.globalCompositeOperation = 'destination-in';
                    g.drawImage(this.nearImage, 0, 0);
                    this.nearGlow = glow;
                }
            }
            for (let x = -offset - w; x < width; x += w) {
                ctx.drawImage(this.nearImage, x, y, w, h);
                if (!reduced && this.nearGlow)
                    for (let i = 0; i < 6; i++) {
                        const center = x + (i + .5) * w / 6, proximity = Math.max(0, 1 - Math.abs(center - width * .25) / 180);
                        if (proximity > 0) {
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(x + i * w / 6, y, w / 6, h);
                            ctx.clip();
                            ctx.globalAlpha = .10 * Math.sin(proximity * Math.PI / 2) ** 2;
                            ctx.drawImage(this.nearGlow, x, y, w, h);
                            ctx.restore();
                        }
                    }
            }
        }
        // Horizontal waterfront bands have level edges. Keep the promenade's ground
        // line fixed while each depth moves independently; nothing enters the lane.
        const band = (top, bottom, travel) => {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, height * top, width, height * (bottom - top));
            ctx.clip();
            for (let x = -(travel % tile.width); x < width; x += tile.width)
                ctx.drawImage(tile, x, 0);
            ctx.restore();
        };
        band(.52, .551, this.layerOffsets.trees);
        band(.551, .62, this.layerOffsets.water);
        band(.62, 292 / 360, this.layerOffsets.railing);
        band(292 / 360, 1, this.layerOffsets.path);
        // Calm wind above the runner lane only; gameplay never depends on it.
        if (!reduced) {
            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff38';
            for (let i = 0; i < 5; i++) {
                const x = ((time * (17 + i * 2) + i * 211) % (width + 80)) - 80, y = 55 + i * 29 + Math.sin(time * .8 + i) * 4;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(x + 20, y - 3, x + 58, y);
                ctx.stroke();
                if (i % 2 === 0) {
                    ctx.fillStyle = '#77a73f99';
                    ctx.beginPath();
                    ctx.ellipse(x + 34, y + 5, 4, 1.5, -.35, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        }
        return true;
    }
}
