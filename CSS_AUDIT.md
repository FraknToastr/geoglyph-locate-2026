# CSS audit: workflow controls

Completed 2026-10-20. The whole application stylesheet was audited. The initial QR/Symbol work and subsequent requested Magic Eye, Scan QR and Map Controls changes share editing, header and collapse primitives. Unrelated findings are recorded below. Bundled MapLibre CSS is vendor-owned and was not rewritten.

## Method and measurements

PostCSS parsed the complete `src/styles/app.css`. Selector groups include their enclosing at-rule context. Identical declaration groups compare property, value, order and `!important` within that context. These are review signals, not proof that a rule is redundant: responsive variants, theme overrides and dynamic visibility require separate verification.

| Metric | Before QR | After QR | After preview/export | After Controls/preview strip |
| --- | ---: | ---: | ---: | ---: |
| Stylesheet bytes | 127,597 | 128,048 | 129,765 | 133,016 |
| Rules | 1,083 | 1,073 | 1,091 | 1,111 |
| Declarations | 3,360 | 3,359 | 3,416 | 3,477 |
| `!important` declarations | 595 | 574 | 570 | 563 |
| Custom property names | 43 | 48 | 48 | 49 |
| Repeated selector/context groups | 68 | 62 | 62 | 62 |
| Identical declaration groups | 70 | 69 | 70 | 73 |

The table measures `app.css`. The scoped Map companion stylesheet adds 1,346 bytes, 10 rules and 31 declarations, with no `!important` declarations or repeated selector/declaration groups. Similar small rules across independent components remain separate where merging would obscure their scope.

The initial QR consolidation reduced rule count and specificity exceptions while adding split-layout and disabled-picker styles. The preview/export follow-up adds responsive header, swatch and compact-export rules while removing four more specificity exceptions. Zero duplicate signatures is not an appropriate target for independent components that happen to use the same values.

## Implemented consolidation

- Palette, Font Symbol and QR use the existing `.studio-module-split`, `.studio-module-controls` and `.studio-module-tools` primitives. QR/Symbol share one set of column, divider, picker and joystick styles rather than parallel workflow copies. `.font-symbol-module` supplies component styling independently of its DOM parent.
- The viewport-fitting rules remain exclusive to Symbol. QR uses three natural-height sibling sections in one scrolling controls panel, with no nested panel scrollers.
- Removed selectors that assumed Font Symbol was nested below QR. The legacy script wraps only QR fields; workflow-aware ordering keeps QR, Palette and Font Symbol as independent siblings.
- Removed five obsolete module-hiding rules that conflicted with the later sibling-section policy. Kept canonical workflow visibility and collapse rules.
- Consolidated the repeated `.colour-target-bar` base rules and duplicate gradient grid definitions. Removed superseded picker gaps, gradient preset heights, colour-switch rules and the repeated split minimum-height rule.
- QR target buttons wrap to readable widths. Narrow screens reflow QR mode, logo-source and buffer controls instead of overflowing the half-width column.
- Added component-local light-theme surface/border values for the inline picker: its RGB/HEX/HSL fields previously inherited dark input surfaces with dark text. This fixes contrast without changing global Map or other workflow colours.
- The picker plane clips its cursor overflow, preventing a cursor positioned at 100% saturation from widening the right panel.

### Shared tokens

| Token | Default | Purpose |
| --- | --- | --- |
| `--studio-column-gap` | `16px`, `10px` on narrow screens | Column separation and divider inset |
| `--studio-section-gap` | `16px` | Shared vertical section and separator spacing |
| `--studio-section-padding` | `8px 9px` | Palette/QR section padding |
| `--studio-field-gap` | `6px` | Shared control spacing |
| `--studio-picker-height` | `clamp(100px,12vh,130px)` | Compact inline colour plane |
| `--studio-joystick-size` | `clamp(140px,20dvh,210px)` | Shared joystick size |

Existing border, surface, text and accent tokens remain the source of UI colours. Artwork palettes and stored colour values remain independent of theme tokens.

## Behaviour preserved alongside the layout

- Both colour editors use `GeoGlyphColourPicker.mount`. Its source descriptor now accepts optional `disabled`; existing callers default to their bound input's availability.
- Buffer edge uses its existing bound colour inputs and stored settings. It is visible but disabled until an image logo is loaded with Crop enabled. Pointer, keyboard and channel editing respect availability, and disabling cancels pending pointer work.
- The original logo-control sync emits an internal refresh event so asynchronous loading, cropping, settings restoration and resets update the new picker. The old blanket input-enabling rule no longer overrides per-control availability.
- Buffer edge colour and thickness participate in the existing application undo history. Their saved-settings fields and format are unchanged.
- Content capacity/clear controls stay with the textarea, scan guidance stays with QR options, and Magic Eye retains its mode/blur controls through the new structure.

## Symbol preview and export follow-up

- Moved Buffer edge thickness into the same right-hand group as its colour picker. Existing IDs, crop availability, history and settings remain intact.
- Reused `.studio-swatch` and its selection/focus treatment for five preview-only crosshair colours. Selection is stored in session storage independently of artwork settings and colour history.
- Replaced absolute, centred preview metadata and its narrow-screen hiding rule with a wrapping title/metadata group. The preview grid now accommodates the header's natural height.
- Consolidated export positioning into one rule, removing the later repeated positioning override. Export button bars use content widths; File name and Logo source share a responsive details row. Shared borders, surfaces and colour tokens remain in use.
- Browser checks cover desktop/mobile layouts in both themes, long font metadata, session/workflow selection, keyboard closing/focus containment and byte-identical PNG/SVG exports across crosshair changes in development and portable builds.

## Shared Controls and workflow layout follow-up

- Symbol, QR and Magic Eye reuse the same inline colour, field and preset rules. Magic Eye places its complete colour module in the right column and QR Pixel Mode/blur in the left. Nested editor grids have explicit shrinking tracks rather than overflowing narrow columns.
- Added shared `.controls-head`, `.controls-bulk`, `.control-section` and `.studio-divider` primitives. A single delegated controller owns individual and bulk collapsing, accessible indicators and workflow-local UI preferences. Removed the old core click binding and competing palette-only collapse controller.
- Removed redundant per-module collapse hiding and the obsolete fixed four-column blur override. The studio's base column rule no longer requires `!important`; workflow-specific layout can supply two equal columns normally.
- QR places Correction above Content on the right, followed by the count/divider/Buffer edge group, and uses QR → Palette → Font Symbol order. Initial markup and live updates use the same used/limit wording; the correction explanation appears once.
- Scan reliability guidance is a full-width, single-line preview footer in QR and Magic Eye. The preview grid allocates a natural-height footer row; hidden guidance consumes no height in Symbol, Scan QR or Map. Full guidance uses the existing accessible hover-tip system when the visible line needs truncation. Removed the obsolete controls-panel warning selectors and Magic Eye label override.
- Scan QR retains its existing table, action and detail structures under a shared Controls header. Map adds section headers to existing engine containers, preserving IDs and handlers; its companion stylesheet is scoped to those additions. Vendor styles and Font Explorer are untouched.
- Reset actions use existing Scan QR state and rendering. Import, scan and export busy states guard both buttons and their handlers, including asynchronous CSV imports. These lifecycle changes do not alter the saved artwork format.

## Wider findings retained for separate work

| Area | Finding | Reason not to refactor here |
| --- | --- | --- |
| Workspace/header/preview | Repeated `.app-header`, `.workspace`, `.middle-column`, `.preview-tabs` and preview-stage rules | These layer historical layout changes across all workflows; consolidation needs a separate cross-workflow layout comparison. |
| Font Explorer | Repeated font-panel/list, drawer-scrim and Explorer-control rules, including viewport-specific overrides | They govern the virtual grid, overlay sizing and drawer transitions; they are outside QR/Symbol controls. |
| QReverse | Repeated toolbar/control layouts and row/card/theme overrides | These support import, scan and result states with separate responsive requirements. |
| Map | Repeated action, focus and panel rules; shared colour literals | Preserve the established compact panel dimensions, model palette, camera controls and status announcements. Do not merge artwork colours with UI colours. |
| Global themes | Some components use local light-theme overrides instead of complete surface-token substitution | A global token change could alter other workflows. Only the confirmed picker contrast issue was corrected locally. |
| Visibility and specificity | Many remaining `!important` declarations and repeated declaration signatures | Some deliberately override renderer-managed hidden flags or implement responsive/theme states. Do not remove them based on static occurrence counts alone. |

CSS matching was checked against runtime-created controls as well as the template. Absence from static markup alone was not treated as evidence that a selector was unused. No additional packages were required.

## Verification

- Before/after Symbol measurements matched in dark/light themes at 1440×820, 1440×1000, 390×1100 and 1920×1080. Existing Symbol tests cover equal section heights and fit at additional desktop sizes.
- New QR tests cover equal columns, readable narrow-screen layout without horizontal panel overflow, natural vertical scrolling, independent collapse, textarea expansion, both editors, crop availability, undo/redo, settings restoration, joystick controls and Magic Eye transitions.
- Portable PNG/SVG/vector-SVG exports are exercised. PNG colour pixels are checked at export resolution; QR content is decoded using a consistent 512px scanner probe.
- The complete unit suite and all **82 Chromium browser tests** passed after the shared Controls follow-up. Both portable HTML copies were rebuilt and verified identical.
- New workflow checks cover QR labels/count/divider/correction placement, Magic Eye equal columns and inline editing, fullscreen/export, workflow-local individual/bulk collapse and preference restoration, Scan QR input-preserving Clear Results and full Reset Module, and reset guards during live imports/scans/exports. Map checks cover active-pane scoping, section preferences, both themes, narrow headers, stable anchors and the unchanged 138px mini-panel.
- The preview-strip follow-up passed 31 focused browser checks across QR, Magic Eye, Symbol, Map controls and established workflows. Coverage includes Correction above Content, the shared QR Pixel Mode label, full-width single-line guidance, keyboard access to its full text, hidden guidance in unrelated previews and portable-build script/export checks.

Reproduction commands:

```sh
rtk npm run build
rtk node --test tests/unit/*.test.cjs
rtk node node_modules/@playwright/test/cli.js test --workers=3
```
