# CMI image filename audit

All 76 image assets (152 files including the `/money-ops/` mirror) use descriptive `CMI_` filenames. The inventory includes active images, original motion-reference sheets, review artwork, illustrated SVG maps, and the favicon. Artwork pixels, dimensions, transparency, and character identities are unchanged. Internal character IDs are preserved.

`image-audit.json` records every old path, new path, description, byte count, dimensions where available, and SHA-256. Canonical names are Kanyon, Maya, Everest, Sofia, Zion, and Ruby. Animation source sheets and generated atlases have distinct names; numbered comic panels also describe their story beat.

Descriptive filenames support image context; they do not guarantee search rankings. Existing accessible alt text remains in place. Avoid renaming internal game IDs or approved curriculum as part of asset maintenance.

The two site entry points must stay synchronized through the build. Image URL changes require refreshing pages that were open before deployment.

Netlify `_redirects` preserves the 152 old image URLs with permanent redirects to their renamed equivalents. It also covers the `/money-ops/` mirror; no duplicate old image files are retained.
