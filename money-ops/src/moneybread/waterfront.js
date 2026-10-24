/** Level 1's supplied panorama. Ground is at image y=584 of 720, matching
 * runner y=292 after uniform .5 scaling. Prepare a blended repeat once. */
export class WaterfrontScene {
    image;
    ready = false;
    failed = false;
    tile;
    offset = 0;
    constructor() {
        this.image = new Image();
        this.image.onload = () => { this.ready = true; };
        this.image.onerror = () => { this.failed = true; };
        this.image.src = new URL('../../assets/environments/city-waterfront.png?v=45.8', import.meta.url).href;
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
        this.offset = reduced ? 0 : (distance * 1.6) % tile.width;
        for (let x = -this.offset; x < width; x += tile.width)
            ctx.drawImage(tile, x, 0);
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
