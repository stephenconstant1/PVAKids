# Approved Everest reference

The user approved `CMI_everest-character-refinement-preview.png` in chat. It is now the exact
standing portrait used by the game at `assets/cast/CMI_everest-character-blue-yellow.png`. The internal ID
`kai` still means Everest; no characters or lesson speakers were renamed.

The directional runner retains its body pose and original canvas dimensions,
with Everest’s approved face and tapered haircut adapted to the running view.
Its reference hash in `career/runner-rigs.json` is updated.

The uploaded crew poster remains unchanged on disk. A localized head-only layer
from `assets/crew/CMI_moneybread-city-crew-approved-everest.png` updates Everest on the
homepage, Career city, and his Career portrait frames. `career/crew-art.ts` clips
that layer to the 90×90 source-pixel region around his head; the other five crew,
all clothing, city artwork, wording and labels continue to use the original
poster pixels. The full generated retouch is not displayed outside that region.

`everest-approval.json` records the approved portrait hash and hashes of the other
five crew members’ standing and running images so unintended changes fail tests.

Original pre-approval source portrait SHA-256:
`2fc9cee6a2e3985cfa4ec734de9e50cc68f0b1aabb40a67635f29e8ae8104305`.
The original is retained in Git history before version 45.6.
