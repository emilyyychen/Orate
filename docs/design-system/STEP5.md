# Step 5 — Components in code

Reference: https://www.figma.com/design/xDjHmwB6Pr6fsVZvHgSaTH?node-id=9130-1703

## Run

Use Node 22.13+ (the existing Expo 58 / React Native 0.88 dependencies require it).

```sh
npm ci --legacy-peer-deps
npm run dev:components
```

Open `/dev`. The file is `app/dev.tsx`; Expo Router does not include `/app` in the URL. Production builds redirect this route to `/`. The gallery is required only inside the development branch.

## Delivered

19 components, one per file in `/components`, with all 61 Figma variants labeled in the gallery. Variant properties use Figma's exact names and values, including `Style`, `State`, `Selected`, `Type`, `Frame`, `Share`, `Back`, and `Title`. Figma's internal property-ID suffix is not part of its public display name.

`Selection row` becomes `SelectionRow`, and `Bottom sheet` becomes `BottomSheet` in valid TypeScript identifiers. This is the only name normalization.

`tokens.ts` exposes the shared foundation tokens and exact per-layer component layout tokens. NativeWind compiles those tokens into the `ds-*` utilities. Product components have no raw colors or inline style objects. The internal renderer creates native text, views, press targets, and text inputs. Only the original icons, character artwork, and decorative shapes are SVG assets exported from Figma; no entire screen or text-containing component is flattened into an image.

The geometry snapshot is intentionally the fixed reference size from Figma. These are reference-size core components, not a responsive screen implementation. A gallery specimen can scroll horizontally on a narrow phone. Long content and larger accessibility text require layout adaptation before using these fixed reference layouts as production screens.

## Corrections applied to Figma first

- Buttons: 342 × 52, pill radius 26, Roboto Bold 16/22, centered. All 12 existing button variants retain their names.
- H1: Outfit Bold 28/34. H2: Outfit Bold 22/28. Body: Roboto Regular 16/22; supporting copy 15/21.
- Score card: yellow surface, original stair/character artwork; score 75/90. Metric card: white with original soft waves. Feedback card: peach with original speech shapes.
- Header: 390 × 48, white, 1 px warm divider, shadow x0/y2/blur6/brown7%. Centered Outfit Bold 17/22 title, sentence case. Back target 44 × 44 at x8/y2, original 24 px arrow. Optional Share target 56 × 44 at x326/y2.
- The Header component was applied to 68 approved detail-page headers in Figma. It does not include the separate 54 px system status area.

## Validation

```sh
npm run typecheck:components
```

Browser checks verify 19 families and 61 states, exact 342 × 52 button geometry, button action, disabled state, switch changes, typed input across focus changes, tab changes, and absence of nested interactive targets. See `validation.json` and the comparison screenshots in this directory.

The repository's full-project TypeScript check already reports errors in `app/auth/verify.tsx` and `components/ui/IconSymbol.tsx` against its installed React Native / Expo types. Those existing screens were left unchanged; the scoped Step 5 check passes. iOS and Android device rendering has not been verified in this environment.

The original `CLAUDE.md` describes an older SDK and older typography. For this scoped implementation the user's latest approved Figma and the corrected component page take precedence. Existing `Spark` tokens and product pages were not renamed or migrated.

## Examples

```tsx
<Button Style="Primary" State="Default" Label="Continue" onPress={continueFlow} />
<Header Title="Your material" Share="false" Back onBack={goBack} />
<SelectionRow State="Selected" onPress={selectPacing} />
<CharacterLoader Frame="1" autoPlay />
<Card Type="Feedback" />
```

This delivery implements the Step 5 component inventory and gallery. It adds no auth, database, or new product flow. The GitHub repository was read as an archive; changes have not been pushed to GitHub.
