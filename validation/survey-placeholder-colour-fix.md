# Survey controls retaining the sleeping placeholder

## Confirmed cause

A read-only inspection of Response 169 during diagnosis returned `whats_on_your_mind: "😴"`, `choose_a_colour_colour: "Yellow"`, and null values for `emojis`, `geoglyph_speaks`, `special_commands`, `_2d_or_3d` and `animation`. Begin correctly retained “Where are you Josh?” in presentation state. The resolver instead treated the non-empty legacy field as new text, requesting the sleeping emoji in the last text font (Gill Sans), leading to `Selected font lacks characters: U+1F634`.

## Local correction

The shared cue resolver treats the trimmed legacy value 😴 as a placeholder only when both newer content fields are empty and a recognised control value is present. It then inherits current content, font and 3D mode, applying only the supplied controls. Control recognition uses the same option tables as normal validation, including colour, font, Random, size, Fit, representation and animation. Invalid/unknown controls alone do not trigger suppression.

Explicit emoji selections, explicit speech, other legacy messages and Begin/Reset precedence remain unchanged. A standalone legacy 😴 without a recognised control also retains its previous interpretation. Intentional sleeping-emoji submissions should use the explicit `emojis` field. No Survey123 form edits, service writes, authentication changes or rendering-policy changes were made.

## Verification

- Three new resolver regressions failed before the application patch and passed afterward. All 17 focused resolver cases passed, including response immutability, option validation, explicit emoji policy and Reset command priority.
- One short Chromium regression passed from local modular `file://` (4.8 seconds, accelerated script timing, mocked survey and tiles). It rendered all Begin steps, applied Response 169's exact content/control fields, verified the final message and actual front material were Yellow, and retained Gill Sans, Medium (3,000 m height/300 m depth), native colour off, 3D and running yaw/Turn. There was no added Fit, mesh build, GPU upload or disposal for the colour update.
- The same browser regression then sent Reset with the stale legacy field and colour supplied, verifying 😴, Segoe UI Emoji, native colour on, 2D, stopped animation and no presentation error.
- The local modular build and syntax/whitespace checks passed. No extended browser run or soak. All browser service operations were mocked; no real survey records were changed.

Only the local modular application was rebuilt. Portable copies and GitHub remain at their preceding versions; no commit or push performed. This fixes the confirmed Response 169 case. Earlier Response 145 was not independently inspected, and unrelated genuinely unsupported font/character combinations still produce their existing diagnostics.

Subsequent release rebuild/publication is documented separately. A later location-only variant (Response 184) exposed the missing point-control case and was corrected locally; see [survey-location-placeholder-fix.md](survey-location-placeholder-fix.md). The colour-only regression remains covered.
