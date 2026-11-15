# Uploaded runner artwork integration · 46.32

All twelve supplied illustrations/routes/effects are installed: six Needs/Wants, three goals, sparkle, vine and floating platform. All six characters now use the supplied eight-pose flip/kick sheets. Source bytes, alpha channels and character identities are preserved. Assets use descriptive `CMI_` filenames; both static entry points are synchronized.

The shared renderer serves Canvas pickups/goal markers and accessible HTML vocabulary previews. Images retain their aspect ratios; decoded images are cached. Original vector art remains a loading/failure fallback. Physics, scoring, vocabulary definitions, jump/duck/climb controls and run objectives are unchanged. The sparkle is brief and stationary with reduced motion.

## Route alignment

`career/runner-route-art.json` records the actual source dimensions and measured visual anchors. The platform is 2172 × 724. Its flat walkable span (source x=210–1970) maps to the existing 250-pixel landing surface; source y=340 aligns the front top edge with the physics landing height. Decorative planters overhang the sides rather than shrinking the safe deck.

The vine is 887 × 1774 with substantial transparent side padding. Its visible column is drawn from source rect [239,10,406,1764], keeping the source pixels unchanged. One proportional draw spans the climb height, centered on the existing grip zone. Leaves may overhang that zone; they do not enlarge the collision body. This avoids stretched artwork and repeated tile seams. Existing rung cues remain visible.

## Character action sheets

Source sheets are 1774 × 887, with a 4 × 2 grid: column boundaries 0/444/887/1330/1774 and row boundaries 0/444/887. Frames are read directly from the source, with measured visible bounds, shared baseline and stable scale. Flip poses supply their own rotation; no second Canvas rotation is added. Left-facing tricks mirror the artwork. Reduced motion uses a still final pose.

Six climbing sheets are preserved under `assets/runner/actions/`. Their vines are baked into each cell. Existing character-only climbing poses remain active to avoid duplicating/moving the route vine; character-only layers would enable these new climbing cycles. No image was erased or distorted into a character rig.

The supplied `CMI_level-02-downtown-business-district.png` remains a reference: its perspective ground/platform layout has not replaced the current collision map.

## Inventory and provenance

`career/uploaded-runner-art.json` records exact archive/member names and original hashes, including identical Sofia duplicates from CMI_5 (2) and CMI_7. The image audit now contains 126 assets / 252 root-and-mirror files, including the Level 2 forward background and six supplied rear-view sheets. No source files from the requested illustration/route pack remain missing. No new prices, rewards, attacks or financial outcomes were introduced.
