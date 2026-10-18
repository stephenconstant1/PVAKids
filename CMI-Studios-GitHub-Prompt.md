# CMI Studios — GitHub Copilot / Codex Build Prompt

You are working in my existing repository. Help me build CMI Studios, a modular audio analysis, restoration, and production application.

Start by inspecting the repository: identify its framework, current features, audio-processing dependencies, project conventions, and test setup. Preserve working functionality and follow the existing architecture. Before making broad changes, summarize the current structure and propose a small, practical first implementation. Then proceed with the first useful slice of work. Do not replace working functionality with a mockup or claim that unavailable features work.

## Product vision

CMI Studios comes from a preservation-first idea: like restoring a damaged piece of wood, keep what is healthy, repair only what needs help, and build carefully one layer at a time. The goal is to improve a mix where the source allows while preserving its character and the creator’s control. “Better than the original” is an aspiration to verify through listening and measurements, never a guaranteed result.

## Core workflow

1. Import an audio file without altering or overwriting the source.
2. Analyze the actual file and display real measurements.
3. Explain potential issues and recommend suitable tools, with reasons and confidence.
4. Let the user select, preview, and approve changes.
5. Reanalyze after each applied step.
6. Export new files separately and report the settings used.

Do not show fabricated graphs, measurements, artist recording details, or processing results. Clearly label estimates and unavailable capabilities.

## Audio analysis and tools

Where supported by the repository and available libraries, report file metadata such as sample rate, bit depth or encoding, duration, and channel count, plus clipping. Analyze actual audio for frequency balance over time, loudness, dynamics, stereo width, phase, likely noise, reverb, and gaps. Label each visualization and explain what it measures.

Build processing tools as separate, controllable modules. Potential modules include noise reduction, de-reverb, EQ, compression, stereo width, loudness and peak management, gap repair, and sample-rate conversion. Each implemented tool should provide appropriate intensity or parameter controls, preview, bypass, undo, and level-matched A/B comparison. Do not expose controls that do not affect real processing.

## Wood Glue restoration

Wood Glue is the signature, preservation-first restoration workflow:

- Preserve healthy source audio and identify the smallest damaged region that can be addressed.
- Use the immediately surrounding audio as context. Widen the analysis area gradually—from the local boundary to a phrase, section, or arrangement—only when needed.
- Let the user select repair regions using an editable, paint-by-numbers-style mask linked to actual audio time ranges and analysis. Painting selects where a repair may be applied; it must not change the audio by itself.
- Apply one repair layer at a time. After each layer, analyze the result and let the user preview, accept, adjust, undo, or stop before another layer is added.
- Match the repair to surrounding tone, level, timing, texture, and phase where the signal and method support it. Show confidence and identify areas that may produce artifacts.
- Offer a separate Refinement and Blend pass to smooth mismatches while preserving transients and useful detail.
- Display what changed, what improved or worsened, and any detected new artifacts. Every pass must be previewable, reversible, and clearly labeled.
- Aim for a natural blend. Never promise perfect or invisible recovery.

The Wood Glue visual should be CMI-branded. Keep the visual synchronized with selected audio regions and show the related waveform, spectrogram, or measurements. The illustration is a control and explanation, not a measurement or guarantee.

## Optional stem separation

Provide Stem Separation as an explicitly selected module, never an automatic action. Where a real separation model is available, allow preview and export of vocals, drums, bass, and other stems. Explain model requirements, limitations, and likely artifacts. Preserve the original audio and do not claim that separated stems are clean or complete.

## CMI Studio Room and spatial audio

Create a virtual listening workspace called CMI Studio Room, with a selectable CMI 12.1 speaker layout and clearly labeled channels. Treat this as a CMI design informed by publicly documented channel layouts, not an official IMAX room, format, or certified product.

Allow users to adjust virtual speaker placement, channel level, and delay where supported, and to smooth perceived image transitions while preserving intended movement and separation. Distinguish virtual image adjustment from physical room calibration. Claim physical calibration only when based on measurements from the actual speakers and room, and show the measurements and corrections used.

Treat published format-specific LFE details as specific to that delivery format. Do not apply an LFE filter as a global bass cut. Show channel routing and filtering. Describe 3D processing as a spatial interpretation of the source unless genuine multichannel source information is available; do not imply it recovers missing stems.

## Wood Glue mix-to-room alignment

Where measurements support it, compare the analyzed mix with the selected CMI Studio Room profile. Show evidence for differences such as channel balance, level, timing, phase, frequency balance, or spatial placement. Do not treat a channel layout as an acoustic target curve. Offer small, reversible corrections one layer at a time; explain whether a value is measured, estimated, or user-defined.

## Stereo downmix and export

Provide an optional conventional two-channel stereo downmix from supported multichannel mixes. Use documented routing rules for the selected layout, show the channels and settings used, and let the user preview and check the result for clipping, level changes, tonal imbalance, phase problems, and important elements becoming too quiet or disappearing. Export multichannel and stereo versions as separate files when requested.

Default CMI bounce: stereo WAV, 32-bit floating-point PCM, 88.2 kHz. Confirm the selected format before export. Use high-quality sample-rate conversion when needed and report that conversion. Do not imply that a higher sample rate restores missing detail or guarantees better sound. Never overwrite the original file or silently replace an existing export.

## Interface

Use a cohesive, accessible, responsive studio workspace. Prefer one large central studio area with smaller movable or dockable panels for analysis, references, meters, restoration, Wood Glue, stem separation, spatial audio, and export. Provide a way to restore the default layout. Support keyboard and touch interaction as well as mouse input.

Hover or tap may reveal technical values, targets, and evidence sources; it must never change audio. Red, amber, and green may indicate measured movement toward user-approved targets, but must not imply certification or guaranteed quality. Keep technical detail available without overwhelming the normal workflow.

## References and branding

Keep the Sir Dilla 100 song chart, songs, engineers, lessons, and categories intact as a curated listening and learning library, not an objective ranking. If playlist XML import is supported, treat it as playlist metadata. Use only local audio or authorized audio snippets; do not scrape services or bypass streaming protections.

Use CMI-branded virtual equipment and meters. Do not copy protected manufacturer artwork or imply endorsement. Any sound modeled after real equipment must be based on documented specifications or reliable measurements; describe approximations honestly.

For artist vocal-chain research, show only details supported by reliable sources, cite those sources in the interface or documentation, and label unknown details as “not documented.” Do not invent equipment, settings, or workflows.

## Implementation and delivery

- Work in small, reviewable steps and keep the app runnable.
- Use real audio processing where feasible; clearly mark integrations that require a model, hardware, license, service, or user-provided measurement.
- Add meaningful tests for implemented behavior and update documentation.
- Do not silently add dependencies with restrictive licenses or require paid services without identifying them.
- After each implementation stage, report files changed, features that work, tests run and results, limitations, and the next concrete step.

Begin with repository inspection. Then implement the smallest complete, usable audio import-and-analysis workflow that fits the existing project. Do not attempt every advanced module in one pass.
