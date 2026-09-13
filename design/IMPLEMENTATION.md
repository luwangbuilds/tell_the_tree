# First working implementation

Entry update: the opening page is removed. Root URLs and unrecognized hashes display the tree immediately; reduced-motion users also enter directly. Historical opening behavior below no longer applies.

Current interaction update: the tree now has one glowing entrance to the `#garden` leaf/flower collection, rather than individual markers. Leaf reflection, release, and action entry are unchanged. Users can select one or more flowers to harvest into a diamond; only selected flowers are removed. The five-flower invitation is retired. Version 1 storage accepts both new single-intention diamonds and older multi-intention diamonds. The original notes below are historical where they differ from this update.

Visual update (2026-09-12): v5 Spring Light now replaces the purple interior theme. The original implementation notes below are historical; see [current theme and assets](SPRING_THEME.md). Product behavior, opening animation and storage schema are unchanged.

Implemented 2026-09-12 in `public/`, with no third-party client dependencies. Approved art direction: purple watercolor interiors and gold outline lotus opening. The tree and background illustrations are derived from approved mockups; typography, controls, selectable leaves, flowers and breathing guidance are live UI rather than screenshots.

## Confirmed behavior

Opening text wipes into view, holds fully visible for one second, then wipes away. Worries become leaves. Users choose whether to release a worry or write an action. Writing an action blooms immediately; no completion tracking. At five flowers, optional harvest gathers all current flowers into one diamond and retains every action in the treasure box.

## Implementation defaults for review

- Responsive website, initially local; no accounts or synchronization.
- Wipe-in is 1.4 seconds and wipe-out 1.2 seconds, both left to right. Root URL shows the opening; internal page refreshes preserve the current route. Skip is available. Reduced motion keeps text static until the user enters.
- Content stays in browser local storage. Releasing a worry deletes it. Choosing an action removes the original worry text and stores the action. JSON export and a confirmed clear-garden action are available under privacy.
- Breathing starts on entry and repeats until the user leaves. It pauses when the tab is hidden and resumes only on request. The user may pause, return to the tree, or finish at any time.
- Finishing shows a quiet closing page; untouched leaves remain saved.
- Reflection dialogs can be dismissed without changing the leaf. Existing flower actions can be reviewed before harvest.
- Each harvested diamond can be deleted from its detail view after a confirmation step; deleting it also removes its saved intentions.
- No sound. No tracking. No remote services.

## Practical limits

This is the first browser implementation, not a published service or native application. Lettering approximates the reference through locally available Kai-style fonts. Watercolor images are static; live worry leaves and flowers animate above the decorative foliage. Up to 16 worry markers and 8 flower markers are shown simultaneously to avoid crowding; the complete lists remain accessible. Static image design was adapted for desktop and small screens. Export is a downloadable record; importing a garden is not implemented.

## Validation

Domain tests cover release, action conversion, harvesting all flowers, input validation, saved-data validation, and exact 4-7-8 phase boundaries. Browser tests cover a full six-worry journey (one release, five actions, one harvest), treasure persistence on reload, pause/resume, finish, mobile layout, reduced motion, escaping, failure to save, and corrupt data recovery behavior.

## Production art

The built-in image generation tool created text-free derivatives of the approved mockups. They were converted to WebP without cropping or visual modification using `scripts/prepare-assets.mjs`. All production assets are local in `public/assets/`.
