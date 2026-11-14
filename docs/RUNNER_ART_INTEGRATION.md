# Uploaded runner artwork integration · 46.31

Installed from CMI_1, CMI_2, CMI_3, CMI_4 and CMI_6: ten original PNG illustrations (six Needs/Wants, three goals, one sparkle), plus ten active flip/kick sheets for five characters. Source bytes, alpha channels and character identities are preserved. All assets use descriptive `CMI_` names and both static entry points are synchronized.

The shared renderer serves Canvas pickups/goal markers and accessible HTML vocabulary previews. Images keep their aspect ratios, decoded images are cached, and original vector art remains the fallback during loading or when a file is absent. Physics, scoring, vocabulary definitions, jump/duck/climb controls and run objectives are unchanged. The sparkle is brief and stationary with reduced motion.

The supplied action sheets are 1774 × 887 with a 4 × 2 grid: column boundaries 0/444/887/1330/1774, row boundaries 0/444/887. Frames are read directly from the source image, with measured visible bounds, shared baseline and stable scale. Flip poses supply their own rotation: no second Canvas rotation is added. Left-facing tricks mirror the same artwork. Reduced motion uses a still final pose. Sofia keeps her original jump-based flip and dedicated kick pose.

## Preserved references and remaining files

- Five climbing sheets are retained under `assets/runner/actions/`. They include a vine in every cell; do not erase or distort this artwork into a character rig. Existing character-only climbing poses remain active to avoid duplicate, moving route vines. Cleaner character-only sheets or layered sources would enable those climbing cycles.
- `assets/environments/references/CMI_level-02-downtown-business-district.png` is preserved as supplied. It has a perspective ground/platform layout that has not been substituted into the existing runner collision map.
- CMI_5.zip exceeds the 32 MiB transfer limit. The downloadable packs do not contain `CMI_sky-route-climbable-vine.png`, `CMI_sky-goal-floating-platform.png` or Sofia's action sheets. Existing route art stays active. Split CMI_5 into smaller uploads to continue.
- The platform anchor in `runner-art.js` is provisional (39% down the supplied preview). Verify the landing line, alpha padding, vine tile seams and small-size readability against original source PNGs before enabling those route images.

`career/uploaded-runner-art.json` records archive/member names and original hashes. `docs/image-audit.json` records 114 image assets / 228 root-and-mirror files, including references. No new prices, rewards, attacks or financial outcomes were introduced.
