# Tell the Tree

A working, responsive web app for setting down worries, taking a breathing pause, and finding a small way forward. The approved v5 Spring Light visual theme combines sunlit green foliage, pale pink blossoms, cream panels and olive controls. The app opens directly to the tree. See [PRODUCT_DESIGN.md](PRODUCT_DESIGN.md) and [spring theme assets and validation](design/SPRING_THEME.md).

## Run locally

Requires Node.js 20 or later. No dependency installation or build is needed.

```sh
npm run dev
# Or: node server.mjs
```

Open http://localhost:4173. Set `PORT=4183` if that port is occupied. Open the server URL, not `public/index.html` directly: the app uses JavaScript modules.

In this workspace the bundled Node runtime is available at:

```sh
PORT=4183 /Users/luwang/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.mjs
```

## Implemented experience

- Direct entry to the tree, including for reduced-motion users. The previous 烦恼即菩提 opening screen has been removed; old opening links fall back to the tree.
- Add worries to a sunlit spring tree. An animated pointing-hand cue on the main trunk opens the leaves-and-flowers collection at `#garden`. The photographic foliage and blossoms are decorative; saved worries and intentions appear on a separate illustrated Bodhi tree in the collection. The treasure chest shows only the diamond count, with golden light spilling from its lid. Motion becomes static when reduced motion is enabled.
- Repeating 4-7-8 guided breathing, pause/resume, return to tree, and review your worries. Moving the tab into the background pauses breathing automatically; resume manually.
- Choose a small action to turn a worry into a flower, or explicitly release it. No completion checklists.
- The collection is a storybook Bodhi tree. Glowing worry leaves open the existing clarity dialog; saving a small step blooms that leaf in place. Flowers show their paired worry and intention. Large collections use additional branch views with eight items each.
- One click harvests all current flowers into one diamond, including flowers on other branch views. There is no selection or five-flower threshold. Treasure history retains each worry, action and date, including previously saved diamonds. Each diamond can be permanently deleted after confirmation.
- Local persistence, private JSON export, and an explicitly confirmed reset. Save failures keep the input intact; invalid saved data is never silently overwritten.

## Data

Everything is stored in the current browser's `localStorage` under `tell-the-tree.v1`. No account, backend, tracking, remote fonts, or network API is used. Different browser profiles and origins have separate gardens; clearing browser data deletes the garden. Data is not encrypted. A released worry is removed. Converting a worry into a flower now preserves its original text alongside the action, as requested; both remain paired through harvesting and appear in diamond cards and details. Older intentions without saved worry text remain readable and display an unavailable-text note.

## Tests

```sh
npm test
```

The browser test uses Playwright and Chrome in an isolated temporary profile. Start the server first, then run:

```sh
APP_URL=http://localhost:4183 PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser.mjs
```

The test covers the complete user journey, persistence, mobile layout, reduced motion, pause/resume, escaped user input, storage failure, and corrupt saved data. Screenshots go in ignored `test-results/`.

## Files

- `public/`: deployable static app, source styles, modules, and local art assets.
- `public/model.js`: immutable garden transitions and breathing phase calculation.
- `server.mjs`: loopback-only development server serving only `public/`.
- `design/visual-explorations/v4-purple/`: approved visual references and earlier opening revisions.
- `design/IMPLEMENTATION.md`: defaults, limitations, and art-generation prompts.

The app is published with Sites and also runs locally; it has not been packaged as a native mobile app. All visual-design history is preserved.
