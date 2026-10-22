import data from './landmark-art.json' with { type: 'json' };
export const landmarkArt = data;
export const constructionStages = ['Planned site', 'Foundation', 'Structure', 'Finishing', 'Complete'];
const escape = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/** Art metadata is keyed by existing landmark ID, never inferred from a lesson.
 * The source image contains eight completed buildings. A ghosted plan, a reveal
 * from the foundation up, and temporary scaffolding show the saved 0–4 stage.
 * This is a visual presentation only; purchases still use src/city.js rules. */
export function landmarkArtwork(id, name, stage, scope = 'card') {
    const entry = landmarkArt.find(a => a.id === id);
    if (!entry)
        return `<p class="city-art-unavailable">${escape(name)} artwork unavailable.</p>`;
    const safeStage = Math.max(0, Math.min(4, Math.floor(stage))), tile = entry.tile;
    const key = `landmark-${scope}-${id}`, x = tile % 4 * 512, y = Math.floor(tile / 4) * 512;
    const image = `<svg x="40" y="0" width="240" height="240" style="overflow:hidden" viewBox="${x} ${y} 512 512" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image data-landmark-image href="assets/crew/moneybread-landmarks.png?v=45.5" width="2048" height="1024"/></svg>`;
    const height = [0, 72, 132, 190, 240][safeStage];
    const scaffold = safeStage > 0 && safeStage < 4 ? `<g class="landmark-scaffold" fill="none" stroke="#c59c5e" stroke-width="3" stroke-linecap="round"><path d="M48 220V68M272 220V68M43 112H277M43 162H277M43 210H277"/><path d="M48 112L95 162L48 210M272 112L225 162L272 210" stroke-width="2"/><path d="M58 210V170M72 210V170M58 180H72M58 193H72"/></g>` : '';
    return `<svg class="city-landmark-art" data-landmark="${id}" data-construction-stage="${safeStage}" viewBox="0 0 320 260" role="img" aria-label="${escape(name)}: ${constructionStages[safeStage]}, stage ${safeStage} of 4. ${escape(entry.architecture)}" focusable="false"><defs><clipPath id="${key}-reveal"><rect x="0" y="${240 - height}" width="320" height="${height}"/></clipPath><radialGradient id="${key}-light"><stop stop-color="#fff9dd"/><stop offset="1" stop-color="#c3e1d2"/></radialGradient></defs><rect width="320" height="260" rx="18" fill="url(#${key}-light)"/><ellipse cx="160" cy="230" rx="120" ry="16" fill="#416d5d" opacity=".15"/>${safeStage < 4 ? `<g class="landmark-blueprint" opacity="${safeStage === 0 ? '.38' : '.18'}">${image}</g>` : ''}<g class="landmark-built" clip-path="url(#${key}-reveal)">${image}</g>${safeStage < 4 ? '<path class="landmark-foundation" d="M47 222L160 204L273 222L160 245Z" fill="#c9c0a2" fill-opacity=".8" stroke="#8e9c82" stroke-width="2"/>' : ''}${scaffold}<g class="landmark-art-fallback" aria-hidden="true"><rect x="24" y="80" width="272" height="92" rx="12" fill="#e9e6c8"/><text x="160" y="116" text-anchor="middle" fill="#244e43" font-size="13">Building artwork unavailable</text><text x="160" y="140" text-anchor="middle" fill="#244e43" font-size="12">${escape(name)}</text></g></svg>`;
}
