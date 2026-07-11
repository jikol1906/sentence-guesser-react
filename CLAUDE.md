# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Sentence Guesser is a language-learning web app. Users maintain a "word bank" of
target-language words/phrases with an optional context sentence. The app calls a
Netlify serverless function backed by Google Gemini to generate either:

- **cloze** mode: a new example sentence with the target word(s) blanked out, which the
  user must guess letter-by-letter, or
- **pair** mode: a new example sentence plus its translation.

State (word bank, generated sentences, challenge order) is persisted entirely in
`localStorage` — there is no backend database.

## Commands

```bash
npm run dev        # start Vite dev server (also: npm start)
npm run build       # production build via Vite (outputs to dist/)
npm run preview     # preview the production build locally
npm run start:dev   # run via `netlify dev`, which proxies the Netlify function
                     # locally in addition to the Vite app — use this when working
                     # on anything that calls /.netlify/functions/generate-sentence-pair
```

There is no configured lint or test script (`eslintConfig` in package.json is CRA
leftover and unused; there is no test runner wired up despite `setupTests.ts`
existing). Type-check manually with `npx tsc --noEmit` since `tsconfig.json` has
`noEmit: true` and nothing else currently invokes the compiler.

The Netlify function requires a `GEMINI_API_KEY` environment variable
(`netlify/functions/generate-sentence-pair.mjs`). When using `npm run start:dev`,
Netlify CLI reads this from a linked Netlify site or a local `.env` file.

## Architecture

### Build tooling
- Vite + `@vitejs/plugin-react` (`vite.config.js`). The project was originally
  bootstrapped with Create React App (see stale `README.md`, `react-app-env.d.ts`,
  `reportWebVitals.ts`) but has since migrated to Vite — `index.html` at the repo
  root is the real entry point, loading `/src/index.tsx` as an ES module.
- Tailwind CSS v4 via the `@tailwindcss/postcss` plugin (`postcss.config.js`).
  Theme tokens (colors, fonts, keyframes) are defined with `@theme` in
  `src/index.css`, not a `tailwind.config.js` file. Custom animations
  (`animate-fade-in-top`, `animate-typewriter-reveal`) and colors
  (`color-wrong-letter`, `color-correct-letter`) are defined there.
- `package.json` name (`typescript-redux`) and the `@reduxjs/toolkit`/`react-redux`
  dependencies are unused leftovers from the original template — there is no Redux
  store in the codebase. State is local component state, `useImmer`, and
  `localStorage`, not Redux.

### Client (`src/`)
- `Components/App.tsx` is the top-level component and owns most orchestration:
  the word bank, the challenge queue (`wordBankOrder`, a shuffled index array
  consumed from the end so each word is used once per shuffle), fetching new
  sentences from the Netlify function, and rendering the list of past challenges.
- `Components/ClozeSentence/useClozeSentence.ts` manages the array of generated
  sentences (`WordType[][]`) using `use-immer`, and exposes `revealLetter` /
  `updateRevealedLetters` to mutate which letters of a cloze word are shown.
- `Components/ClozeSentence/ClozeSentenceGroup.tsx` provides a React Context
  (`ClozeSentenceContext`) carrying `onLetterEntered` / `onCorrectLetterEntered`
  callbacks plus the current `sentenceIndex`/`wordIndex`, consumed by
  `ClozeSentence.tsx` and, transitively, `Word.tsx`/`LetterInput.tsx` so deeply
  nested letter inputs can report guesses back up to `App.tsx` without prop
  drilling.
- `hooks/useLocalStorageState.ts` is a drop-in `useState` replacement that
  persists to `localStorage`; it's used for `wordBank`, `wordBankOrder`, and
  `challengeMode`. `App.tsx` also reads/writes the `clozeSentences` key directly
  (via `useClozeSentence`'s callback) rather than through this hook.
- `hooks/useModal.ts` + `Components/ModalProvider.tsx` implement a simple modal
  context (`ModalCtx`) for showing arbitrary `ReactElement` content
  (`HelperDialog`, etc.).
- `Utils.ts` holds the cloze/word-shape conversion logic:
  `convertClozeApiResponseToWords` turns the `_word_`-delimited string array
  returned by the API into `WordType[]` (either a plain string or a `ClozeWord`
  with `letters`/`shownIndexes`), using per-language character regexes
  (`languageRegexes`/`isCharacter`) to auto-reveal punctuation/non-letter
  characters within a hidden word.
- `types.ts` defines the core shared shape: `ClozeWord = { letters, shownIndexes }`
  and `WordType = ClozeWord | string` (a rendered sentence is a mix of hidden
  cloze words and plain visible words/punctuation).

### Server (`netlify/functions/generate-sentence-pair.mjs`)
- A single Netlify Function (POST only) that builds a few-shot chat prompt for
  Gemini (`gemini-2.5-flash` via `@google/genai`) and returns its raw JSON text.
- Mode-specific prompt builders (`generateChatSentencePair` /
  `generateChatClozeExercise`) are selected via the `mode` field in the request
  body (`"pair" | "cloze"`); adding a new mode means adding a case to both
  `getSystemMessage` and `getChatContents`.
- The cloze prompt instructs the model to wrap each hidden word in underscores
  (`_word_`) — this convention is the contract consumed by
  `convertClozeApiResponseToWords` on the client, so changes to the prompt format
  must stay in sync with that function.
- `previousSentencesIncludingWord` (tracked per word bank entry in `App.tsx`) is
  sent as `PREVIOUS_SENTENCES` so the model avoids regenerating a sentence the
  user has already seen for that word.
