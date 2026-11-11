# CMI image filename audit

All 88 image assets (176 files including the `/money-ops/` mirror) use descriptive `CMI_` filenames. The inventory includes active images, original motion-reference sheets, review artwork, illustrated SVG maps, and the favicon. The original filename audit preserved artwork pixels, dimensions, transparency, and character identities. Internal character IDs are preserved.

`image-audit.json` records every old path, new path, description, byte count, dimensions where available, and SHA-256. Canonical names are Kanyon, Maya, Everest, Sofia, Zion, and Ruby. Animation source sheets and generated atlases have distinct names; numbered comic panels also describe their story beat.

Descriptive filenames support image context; they do not guarantee search rankings. Existing accessible alt text remains in place. Avoid renaming internal game IDs or approved curriculum as part of asset maintenance.

The two site entry points must stay synchronized through the build. Image URL changes require refreshing pages that were open before deployment.

Netlify `_redirects` preserves the 152 old image URLs with permanent redirects to their renamed equivalents. It also covers the `/money-ops/` mirror; no duplicate old image files are retained.

## Integrated home title

The home background is now `CMI_money-ops-project-home-background.png`. Its CMI Money Ops Project℠ headline is embedded in the illustrated artwork; the separate HTML title badge was removed. The active inventory records the new file’s dimensions, bytes and checksum and preserves the previous image record under `previousVersions`. The original home reference remains preserved in repository history. Existing home-image URLs redirect to the new filename on Netlify. Character artwork, original nameplates, in-image action buttons and the accessible project heading remain part of the current home experience.

## Character action poses

Six dedicated climbing and six non-contact kick poses were added from the canonical character references. They use descriptive `CMI_` filenames, transparent PNGs, reviewed source bounds, and recorded checksums in the active image audit. Original run/jump/duck sheets and character portraits remain unchanged. These are single action poses, not complete skeletal conversions or multi-frame action cycles.
