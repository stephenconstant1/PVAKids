# Image-first home · 46.16

The home screen shows one original Moneybread City image, as large as the viewport
allows while retaining the complete artwork and all six characters. No header,
footer, duplicate portraits, mode cards or setup form appears outside that image.

Three real HTML buttons are positioned inside the image:

- Run the Job · Lesson 1, over the bakery area, opens the illustrated comic first.
- Career Mode, over the school area, opens setup in a keyboard-accessible dialog.
  With an existing saved hero, this becomes Continue Career and preserves the save.
- Play Arcade Mode, over the Build Stronger Futures area, opens the existing Arcade.

Controls remain at least 44px for keyboard/touch and adjust within the image on
narrow screens. Career setup keeps the existing name, character, color and badge
fields; Escape and Close return to the image. No financial rules or scores change.

Comic slides load the new individual high-resolution PNG illustrations rather
than viewport crops from the original strip. The renderer import is versioned
with the entry page. High-density displays cap the viewer at 724 CSS pixels, so
its 1448px sources remain sharp without enlarging beyond their native pixels.
