# Tell the Tree — Product Design Document

Current entry update: the 烦恼即菩提 opening screen has been removed at the user's request. The app opens directly to the tree, including with reduced motion enabled. Opening-screen specifications and decisions below are retained only as history.

Status: Product design in progress. On 2026-09-12 the founder approved replacing the v4-purple interiors with v5 Spring Light, based on the sunlit green and pink tree reference. The black-and-gold lotus opening remains unchanged. The v5 theme is implemented; see [current visual theme](design/SPRING_THEME.md). Historical v4 visual specifications below are retained as design history and superseded by v5 for interior colors and scenery. Proposed defaults and unresolved interaction decisions remain explicitly labeled.

Implementation update (2026-09-12): A working responsive browser MVP is available in `public/`. See [implementation defaults and validation](design/IMPLEMENTATION.md) and [run instructions](README.md). Defaults below that were not explicitly confirmed remain reviewable; the implementation does not imply their product approval.

## Product idea

Tell the Tree helps people express their worries, take a breathing pause, and identify what they can act on or begin to let go of. Each worry becomes a leaf on a tree; choosing a simple action turns a leaf into a flower, and harvested flowers become a diamond that preserves those actions in a treasure box.

### Philosophical foundation

The product is inspired by the Buddhist saying **烦恼即菩提**. Its design interpretation is that our troubles can become material for awareness and growth. The experience gives this idea a visible form: a worry can return to the earth, or become a flower through a chosen action.

This is the product's guiding metaphor, rather than a promise that every worry will disappear. Letting go and choosing an action should both feel like meaningful outcomes.

## Target user

People experiencing worries or anxiety who want help moving from thoughts circling in their minds toward a manageable next step.

Working hypothesis to validate: they may use the app during a difficult moment, at the end of the day, or whenever they need a quiet place to unload what is on their mind. Audience, age range, and current alternatives still need research.

## Problem

Worries can feel like an undifferentiated burden. It can be hard to pause, separate what is actionable from what is outside one's control, and choose a small action.

The product provides a sequence for doing this: express, breathe, reflect, and either release or act.

## Core promise

“Give your worries a place to rest, then find one small way forward.”

The intended outcome is that the user feels less burdened and leaves with either a simple action they chose or permission to begin releasing a worry they cannot act on. These are intended benefits to validate, not guaranteed results.

## Core user journey

1. The user arrives directly at the tree page.
2. The worry composer and collection entrance are immediately available.
3. They write down a worry. Each submitted worry becomes a leaf in the tree's collection.
4. They continue adding worries until they are ready to move on.
5. They enter a guided 4-7-8 breathing exercise and stay for as long as they choose.
6. They choose to finish the session or return to the tree.
7. On returning, they click the glowing point on the main trunk, labeled as the entrance to their leaves and flowers. The separate collection shows worry leaves and intention flowers; they select a leaf to reflect on.
8. The app asks, “Can you do anything about this worry?”
9. If they cannot, the app invites them to let it go. The leaf falls and dissolves into the ground.
10. If they can, the app asks them to write a simple action they are going to take. Saving the action turns the leaf into a flower.
11. In the intention-flower collection, the user can select any one or more flowers to harvest. No automatic invitation or five-flower threshold is shown.
12. On confirmation, only the selected flowers become one diamond, stored in the treasure box. Unselected flowers remain in the collection.
13. The user can open the treasure box to revisit the actions preserved by past harvests.

## Core objects and transformation rules

| Object | Meaning | Transformation |
| --- | --- | --- |
| Tree | A place to hold worries and visible growth | Holds unresolved leaves and unharvested flowers |
| Leaf | One submitted worry awaiting reflection | Becomes a flower, or falls and dissolves when released |
| Flower | One simple action the user has committed to take | Joins the next harvest when the user chooses |
| Diamond | One harvest containing the actions from all harvested flowers | Lives in the treasure box for later review |
| Treasure box | A collection of past harvests and their actions | Opens to the user's action history |

A flower represents an intended action and blooms immediately when that action is saved. Users do not need to mark actions complete afterward. The action workflow ends with choosing and recording a simple next step; harvesting and reviewing actions require no completion check.

Harvest remains optional and requires at least one selected flower. The selected flowers become one diamond; unselected flowers and worry leaves remain in the collection. The tree shows one glowing entry point instead of individual leaf or flower markers.

## MVP features

- [x] Direct entry to the tree without an opening screen or delay.
- [x] Tree page with worry entry and a glowing trunk entrance to all worry leaves and intention flowers.
- [x] Explicit “Finish worrying, continue to breathing” transition from worry entry to breathing.
- [x] Guided 4-7-8 breathing page with user-controlled duration and exits.
- [x] Tree interaction that reveals selectable worry leaves.
- [x] Per-worry question with release and action paths.
- [x] Falling and dissolving leaf transition for released worries.
- [x] Simple action entry and leaf-to-flower transition.
- [x] Flower selection with no five-flower threshold or automatic invitation.
- [x] Harvest of only selected flowers into one diamond.
- [x] Treasure box with reviewable action history.
- [x] Persistence sufficient for returning users to retain their tree and past actions; browser local storage is the implemented default for review.

## Deferred features

Proposed exclusions for the first version, pending agreement:

- Social sharing or public trees.
- AI-generated advice or action suggestions.
- Streaks, leaderboards, and competitive rewards.
- Advanced task management, scheduling, and reminders.
- Multiple trees and cosmetic customization.

## Approved visual baseline

The founder selected **v4-purple** as the final visual mockups on 2026-09-11. Use these three images as the visual reference for implementation:

| Screen | Approved image |
| --- | --- |
| Opening (final approved) | [Small gold lettering and gold outline lotus](design/visual-explorations/v4-purple/01-opening-small-gold-text.png) |
| Tree | [Purple watercolor tree](design/visual-explorations/v4-purple/02-tree.png) |
| Breathing | [Purple watercolor breathing page](design/visual-explorations/v4-purple/03-breathing.png) |

The style retains v1's gentle botanical watercolor, warm ivory paper texture, delicate illustration, and generous space. Interior screens use dusty lavender, lilac, mauve, deep plum text, and restrained antique-gold details. The tree trunk and treasure box retain warm natural wood tones.

The founder confirmed 01-opening-small-gold-text.png as the final opening on 2026-09-11. It uses a black textured background, one gold outline lotus with open petals and a long curved stem, and small bilingual text beside the curve. Both text lines match the lotus's warm gold. Typography retains airy spacing, subtly mottled strokes, and Chinese character height only slightly greater than the English line “Affliction is awakening.” The purple tree and breathing screens remain approved. Earlier opening mockups are retained as history. All interface text after the opening is English, with no Chinese subtitles or repeated Chinese saying.

These approved mockups establish the visual baseline for the remaining reflection, release, harvest, and treasure-box states. Those states still need detailed screen designs. Animation timing, responsive behavior, and functional interactions are not specified by the static images. Earlier visual explorations are retained as history; v4-purple is the implementation reference.

## Screens and interactions

### Opening page: 烦恼即菩提

This page precedes the tree page and introduces the product's philosophical foundation through a simple visual moment.

Confirmed visual direction:

- Black background with one complete gold outline lotus and a long curved stem, following the latest supplied reference.
- Small “烦恼即菩提” using the earlier 东方墨兰 image as the lettering reference: sturdy upright forms, broad horizontal strokes, and slightly irregular edges. Chinese should be only slightly larger than the English serif translation, with airy spacing. Both text lines use the same warm gold as the outline lotus on black; this supersedes the white-text variation.
- Text enters with a wipe-reveal animation, remains fully visible for one second, then disappears with a wipe-erasure animation (擦除进入 → 停留 1 秒 → 擦除消失).
- Minimal content focused on the bilingual saying.

Approved copy and layout: center “烦恼即菩提” as the main line, with “Affliction is awakening.” as a smaller English line beneath it. Keep ample space around the text and the lotus pattern subordinate to its readability, matching the approved opening image.

Confirmed animation sequence: reveal the text with a wipe, hold the fully revealed text for exactly one second, then erase the text with a wipe. The one-second hold starts after the entrance animation completes. Entrance and exit durations and wipe direction remain undecided. Proposed transition: proceed automatically to the tree after the exit animation, with an accessible option to skip it. Whether the opening plays on every visit or only the first visit remains undecided.

Proposed accessibility details: keep the dark gold readable against black, treat the lotus pattern as decorative, and provide a static version with a continue control when reduced motion is enabled.

### Tree page: capture worries

The tree is the primary visual focus. A simple text field invites the user to write a worry, with a clear action to add it to the tree. Each submission creates one leaf. The user controls when they have finished adding worries.

Approved screen copy and controls:

- App name: “Tell the Tree”
- Heading: “Let your worries rest.”
- Subtitle: “A little space for what is on your mind.”
- Input placeholder: “What is on your mind?”
- Submit: the plus control beside the input; proposed accessible label “Add to the tree”.
- Continue to breathing: “Finish worrying, continue to breathing”

Proposed defaults: prevent empty submissions, clear the input only after a worry is saved, and preserve existing leaves and flowers when a returning user adds more worries. No minimum worry count has been decided.

### Breathing page

Guide the requested 4-7-8 sequence: inhale for four seconds, hold for seven seconds, and exhale for eight seconds. Show the current phase and its progress clearly. The exercise repeats until the user chooses to leave; there is no required session length.

Approved screen copy: heading “A moment to breathe.”, subtitle “Gently return to the present.”, inhale label “Breathe in”, and sequence “Inhale 4 · Hold 7 · Exhale 8”. A translucent lavender watercolor circle with a faint lotus holds the current phase and count. Include the pause control shown in the approved image.

Two explicit exit choices are always available:

- “Finish for now” — end this session.
- “Return to the tree” — continue into worry reflection.

Proposed interaction details: provide start/pause controls, make instructions understandable without sound, and allow the user to stop at any point. The destination and presentation after “Finish for now” are still open.

### Tree page: reflect on a worry

Clicking the glowing point on the trunk opens the separate leaf/flower collection. Selecting a worry leaf shows its text and asks, “Can you do anything about this worry?”

The two core answers are “Yes” and “No.” Proposed default: users may close the prompt without answering, leaving the leaf available for later.

**Release path:** If the user answers no, show a gentle invitation such as “You can let this rest for now.” An explicit “Let it go” action triggers the leaf falling and dissolving into the ground. Whether released worry text is deleted or retained is unresolved.

**Action path:** If the user answers yes, ask, “What's one simple action you can take?” The user writes their own action. Saving it transforms that leaf into a flower. Proposed default: require nonempty action text and let users cancel without changing the leaf.

The design should make both choices feel valid. Flowers should not make users who release worries feel that they chose a lesser outcome.

### Flower collection: harvest

The user selects one or more intention flowers in the collection. Provide select-all and clear-selection controls; disable the harvest button when nothing is selected. No harvest prompt is shown on the tree page.

Before harvesting, show the selected intentions for confirmation. Accepting turns only those flowers into one diamond and places it in the treasure box. The associated actions and dates remain readable through that diamond; unselected flowers stay available.

Canceling preserves the selection and all flowers. A failed save preserves both selection and saved records for retry. Previously stored diamonds remain readable alongside diamonds made from one or more selected flowers.

### Treasure box: action history

Clicking the treasure box opens the collection of diamonds. The user can inspect a diamond to see every action it contains.

Proposed presentation: show harvest date and action count for each diamond, then show the action text in its detail view. No action completion controls are needed. Whether to include original worry text remains open.

### Supporting states and accessibility

Proposed defaults:

- Empty tree: show the tree and an inviting worry-entry prompt.
- No unresolved worries: keep existing flowers and the treasure box visible; allow another worry to be added or the session to end.
- Empty treasure box: explain that harvested flowers will preserve actions here.
- Returning user: restore saved leaves, flowers, and diamonds.
- Save failure: retain entered text and explain that the change has not been saved; allow retry.
- Interrupted transition: preserve one clear outcome, without losing an action or duplicating a diamond.
- Reduced motion: offer a static opening with a continue control and quiet alternatives to leaf, flower, and harvest animations.
- Accessible selection: provide readable labels and keyboard-accessible controls so interaction does not depend on selecting tiny leaves or distinguishing colors.

## Data and privacy

Worry text can be personal and sensitive. Storage and retention are product decisions that must be settled before implementation.

The experience needs to retain unresolved worries, actions attached to unharvested flowers, and actions grouped into past harvests. Proposed supporting metadata includes creation and harvest dates.

Open decisions:

- Local-only storage or an account with remote storage.
- Whether data syncs between devices.
- Whether releasing a worry deletes its text permanently or only removes it from the tree.
- Whether the original worry remains attached to a flower or harvested action.
- How users edit, delete, or export their saved content.

Proposed principle: any measurement of product use should avoid collecting the actual text of worries and actions.

## Success criteria

The first version should let a user complete the full experience without explanation from its creator.

- A user can submit several worries and understand that each leaf represents one worry.
- A user can read both lines on the opening page before they are erased and proceed easily to the tree.
- A user can control how long they spend breathing and easily find both exits.
- A user can release a worry or turn it into a concrete, simple action.
- A user understands that a flower records an intended action, rather than proof of completion.
- A user can choose when to harvest and later retrieve every harvested action.
- A returning user can continue with their saved tree and treasure box.

In early user testing, assess whether people feel less burdened, can identify a manageable next step, and experience the release path as valuable. Optional research conversations can explore whether people take their chosen actions, without requiring completion reporting in the app. Flower count measures recorded intentions, not completed actions.

## Open questions

1. **Ending after breathing:** What should “Finish for now” show, and how should unfinished worry leaves be presented on the next visit?
2. **Persistence and privacy:** Where is content stored, and what happens to the text of a released worry?
3. **Revisiting content:** Can users edit or remove worries and actions, undo a release, or inspect unharvested flowers?
4. **Breathing flexibility:** Can users skip breathing or choose another pace?
5. **Uncertainty:** Should reflection offer “I'm not sure” explicitly, beyond leaving a leaf for later?
6. **Platform and audience:** Is the first version a mobile app or website, and who is the initial audience?
7. **Sound:** Should sound accompany the tree, breathing guidance, or transformations?
8. **Opening page details:** The wipe-in → one-second hold → wipe-out sequence is confirmed. Finalize entrance/exit durations, wipe direction, transition to the tree, and whether the opening plays on every visit or only the first.

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-09-12 | Reveal opening text with a wipe, hold it fully visible for one second, then erase it with a wipe. | The founder specified the opening animation sequence and hold duration. |
| 2026-09-11 | Use 烦恼即菩提 as the guiding philosophical inspiration. | Connect worry with the possibility of awareness and growth. |
| 2026-09-11 | Represent each worry as one leaf on a tree. | Give individual worries a visible place outside the user's thoughts. |
| 2026-09-11 | Follow worry entry with user-paced 4-7-8 guided breathing. | Place a deliberate pause before reflection. |
| 2026-09-11 | Allow users to finish after breathing or return to the tree. | Let users choose how far to continue in a session. |
| 2026-09-11 | Ask whether the user can do anything about each worry. | Lead into either release or a simple chosen action. |
| 2026-09-11 | Release leaves into the ground; turn action intentions into flowers. | Make both reflection outcomes visible. |
| 2026-09-11 | Offer optional harvesting at five flowers; harvest all current flowers into one diamond. | Create a milestone that preserves a group of actions. |
| 2026-09-11 | Keep harvested actions accessible through a treasure box beneath the tree. | Let the user revisit past action intentions. |
| 2026-09-11 | Do not require users to mark actions complete afterward. | The flower celebrates choosing a simple action; no later completion check is needed. |
| 2026-09-11 | Add an opening page before the tree with 烦恼即菩提 in Chinese and English, dark-gold text, a black background, a subtle lotus pattern, and a text erasure animation. | Introduce the philosophical foundation and establish a quiet visual tone. |
| 2026-09-11 | Approve v4-purple as the final visual mockups: v1's soft watercolor and paper texture in lavender, lilac, mauve, and warm ivory. | The founder selected this version as the final visual direction. |
| 2026-09-11 | Keep the opening black and gold, use Kai script for 烦恼即菩提, and use English exclusively after the opening. | Confirm the typography and language requirements embodied in the approved mockups. |
