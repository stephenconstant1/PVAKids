# Draft — clearer runner artwork

Use the lively illustrated Moneybread City style: warm light, clean navy outlines, rounded forms, gentle shading and strong silhouettes. These are object illustrations, not new characters. They should blend with the waterfront and stay recognizable at 32–64 screen pixels. Keep the six character designs unchanged. No Mario artwork, logos or audio.

## Priority 1: needs and wants

| Category | Generic image needed | Proposed filename | Visual direction |
| --- | --- | --- | --- |
| Need / obligation | Housing | `CMI_need-housing-home.png` | A friendly house with a visible roof and front door. |
| Need / obligation | Groceries | `CMI_need-groceries-basket.png` | A shopping basket with bread, vegetables and fruit; no brands. |
| Need / obligation | Water bill | `CMI_need-water-bill.png` | A water droplet beside a plain bill/envelope; no price or invented amount. |
| Want | Toy | `CMI_want-toy-teddy-bear.png` | A clearly recognizable teddy bear, rather than a wrapped gift box. |
| Want | Game | `CMI_want-game-controller.png` | A generic controller with a strong silhouette; no console branding. |
| Want | Treat | `CMI_want-ice-cream-treat.png` | A bright ice-cream cone with two scoops; keep it readable when small. |

Needs are responsibilities to plan for, not enemies or bad purchases. Wants are enjoyable extras. The labels and definitions continue to come from the project’s existing vocabulary.

## Priority 2: climbing and sky goals

| Image needed | Proposed filename | Visual direction |
| --- | --- | --- |
| Financial goal | `CMI_goal-financial-target-flag.png` | A flag beside a clear target marker. |
| Short-term goal | `CMI_goal-short-term-calendar.png` | A calendar with one circled day, paired with a small flag. |
| Long-term goal | `CMI_goal-long-term-path.png` | A short stair/path rising toward a distant flag. |
| Climbable vine | `CMI_sky-route-climbable-vine.png` | Original leafy vine with readable grips, with a tileable middle segment. |
| Sky platform | `CMI_sky-goal-floating-platform.png` | A floating city garden terrace with a flat, clear top and an open landing area. |
| Goal feedback | `CMI_goal-reached-sparkle.png` | A small, restrained celebratory sparkle; optional under reduced motion. |

## Delivery requirements

- Transparent PNG object art, preferably 1024 × 1024 for pickups and goals, with consistent lighting and approximately 12% clear padding. Larger source artwork is welcome; avoid enlarging small source images.
- Platform: preferably 2048 × 512, with the top landing line clearly identified. Vine: preferably 512 × 2048, with top/middle/bottom sections identified. Keep collision areas separate from decorative foliage.
- Use the exact descriptive `CMI_` filename convention above. Keep source/layered files if available for future animation.
- No embedded prices, definitions, action arrows or interface text. Those remain crisp, accessible live labels in the game. No invented costs, rewards or financial outcomes.
- Provide a contact sheet on the waterfront background and at actual 32/48/64-pixel display sizes before replacing the current placeholders.
- On integration, update `docs/image-audit.json`, alt/accessible descriptions, both site entry points, and any old-URL redirects. The filenames above are proposed assets, not files that already exist.

This is a draft asset request. The generic object replacements above remain a draft; no replacement needs/wants object images have been installed.

## Character action-sheet prompts

The project now has dedicated single climbing and kick poses, based on the six canonical character references. The following full animation sheets are still requested. Do not use running poses as climbing frames.

For each character, use their exact supplied reference: Kanyon green; Maya purple/yellow headband; Everest blue/yellow; Sofia pink; Zion red/glasses; Ruby purple/long auburn hair. Preserve faces, visible noses, proportions, sneakers and backpacks. Hands must be free of books/tablets while climbing or performing a flourish.

**Climb sheet prompt:** “Create a clearly ordered 8- or 16-pose 2D climbing cycle for [character]. Show alternating hand grips on ladder rungs, bent-knee passing/recovery, alternating foot contacts, a secure resting grip, top-platform step-off, and descent. Upright climbing posture, never a running cycle shifted upward. Transparent background, consistent cell size, baseline and character scale, labeled cell order in a separate metadata file. Original Moneybread City illustration style; do not merge identities.”

**Flip sheet prompt:** “Create an 8-pose running forward somersault flourish for [character], with a crouch/takeoff, visibly tucked knees, controlled rotation, opening and landing/recovery. Keep the face and clothing identity consistent. Transparent equal-sized cells, no motion blur, no enemies or contact.”

**Kick sheet prompt:** “Create an 8-pose non-contact running air-kick flourish for [character]: knee lift, extension, recoil and smooth return to running. Arms balance naturally. This is a playful movement trick, with no target, weapon or combat. Transparent equal-sized cells and consistent scale; no running/duck pose substituted for the kick.”

Proposed names: `CMI_[character]-climb-cycle.png`, `CMI_[character]-flip-cycle.png`, `CMI_[character]-kick-cycle.png`. Check cell boundaries and pose order before slicing or registering the atlas. Existing flip/kick reference sheets were not found in the current repository or attached library folder; the current flip uses the approved jump art, and dedicated single kick poses are provided until full action cycles are supplied.
