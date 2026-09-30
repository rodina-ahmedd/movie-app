# AI Development Log: Movie Search App

## Overview
A React app that searches movies via the OMDb API, displays results as
cards, and handles loading/error states. Built with AI assistance for the
initial implementation, then reviewed and improved manually.

## Prompts Used

### Prompt 1 — Initial build


This single prompt produced the full working structure: a custom
`useMovieSearch` hook handling the fetch/loading/error state, a
`MovieCard` component, and the main `App.jsx` wiring them together with a
search form.

## How AI Assisted

- **Architecture decisions:** AI split the logic into a custom hook
  (`useMovieSearch.js`) separate from the UI (`App.jsx`, `MovieCard.jsx`),
  which kept the search/fetch logic reusable and the components focused
  purely on rendering.
- **API integration:** Handled the fetch call, JSON parsing, and OMDb's
  specific response shape (`Response: "True"/"False"`, `Error` field on
  failure) correctly on the first attempt.
- **Environment variables:** Correctly used Vite's `import.meta.env`
  convention and the `VITE_` prefix requirement without needing a
  correction.
- **Edge cases handled automatically:** empty search term, no poster
  available (`Poster: "N/A"` from the API), and distinguishing "no results
  found" from "network/API error."

## Manual Improvements After Review

### 1. Added a "Clear" button to the search form
**What I noticed reviewing the AI's code:** The search form only had a
submit button — once a user typed something, there was no quick way to
reset the input without manually selecting and deleting the text.

**What I changed (by hand, not AI-generated):**
```jsx
function handleClear() {
  setTerm('');
}
```
And conditionally rendered a Clear button next to Search, only visible
when there's text to clear:
```jsx
{term && (
  <button type="button" onClick={handleClear}>
    Clear
  </button>
)}
```

**Why:** Small UX gap the AI didn't flag on its own — it built exactly
what was asked (search input + button) but didn't proactively suggest a
way to reset the search, which is a common pattern in real search UIs.

## What I'd Improve Next
- Debounce the search input to avoid hammering the API on every keystroke
  if I switch to search-as-you-type
- Add a loading skeleton instead of a plain "Loading..." text
- Cache recent searches to avoid duplicate API calls

## Repo
https://github.com/rodina-ahmedd/movie-app