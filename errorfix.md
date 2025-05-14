# Developer Checklist: Addressing Potential Crashes and Issues

This checklist is prioritized, starting with critical issues that are most likely causing crashes. Each item is estimated as approximately 1 story point.

## 🚀 PRIORITY 1: Critical Client-Side Architectural Fix (Showstopper)

**This is the highest priority. The client CANNOT directly access the database.**

-   [x] **Client `authService.ts`:** Refactor `signUp` and `login` to make API calls to the backend (e.g., `POST /api/auth/signup`, `POST /api/auth/login`) instead of using `src/utils/database.ts`. Remove `executeQuery` import.
-   [x] **Client `cultureService.ts` (Cultures):** Refactor `getAllCultures` and `getCultureById` to call backend API endpoints (e.g., `GET /api/cultures`, `GET /api/cultures/:id`). Remove `executeQuery` import.
-   [x] **Client `cultureService.ts` (Norms):** Refactor `getNormsByCultureId`, `getNormsByCategory`, and `getCulturalBriefing` to call relevant backend API endpoints (e.g., `GET /api/norms?cultureId=...`, etc.). Remove `executeQuery` import.
-   [x] **Client `cultureService.ts` (Idioms):** Refactor `searchIdiomsByCulture` and `getIdiomById` to call backend API endpoints (e.g., `GET /api/idioms?cultureId=...`, `GET /api/idioms/:id`). Remove `executeQuery` import.
-   [x] **Client `analysisService.ts`:** Ensure `analyzeText` calls the *backend* API endpoint `POST /api/analysis/text` (and not the mock or any direct DB access).

## サーバー PRIORITY 2: Critical Server-Side Fixes

-   [x] **Server `openai.js`:** Implement robust `JSON.parse()` error handling within `analyzeCulturalContext`. Log the raw `analysisText` if parsing fails and return a default error structure.
-   [x] **Server `openai.js`:** Implement robust `JSON.parse()` error handling within `translateIdiom`. Log the raw `translationText` if parsing fails and return a default error structure.
-   [x] **Server Routing (`index.js` vs `routes/analysis.js`):** Remove the duplicate `POST /api/analysis/text` handler from the main `server/index.js` file. Ensure the route in `server/routes/analysis.js` is the one being used.

## ⚙️ PRIORITY 3: Configuration & Environment Verification

-   [x] **Server Env Vars:** Verify all required environment variables (`DB_SERVER`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `OPENAI_API_KEY`/`AI_SERVICE_API_KEY`, `ADMIN_TOKEN`, `PORT`) are correctly set and loaded for the server.
-   [x] **Client Env Vars/Config:** Verify `API_BASE_URL` in `src/utils/config.ts` (or `src/utils/constants.ts`) correctly points to the *running server instance* (consider local dev vs. deployed).
-   [x] **`database.env` Usage:** Confirm `database.env` is correctly loaded by `server/utils/database.js` and contains accurate credentials. Ensure this file is in `.gitignore`.

## 🛡️ PRIORITY 4: Robustness & Error Handling (Client & Server)

-   [ ] **Client Array Indexing:** Review `TextAnalysisScreen.tsx` and `IdiomSearchScreen.tsx` for `array[0]` access (e.g., `culturesData[0].id`) and add checks for `array && array.length > 0` before access.
-   [ ] **Server Array Indexing:** Review `server/routes/cultures.js`, `idioms.js`, `norms.js` for `array[0].property` access (e.g., `cultures[0].count`) and add checks for `array && array.length > 0` before access.
-   [ ] **Server `generateSelfSignedCerts`:** Ensure `openssl` is available in the dev environment if relying on cert generation, or provide clear instructions for manual certificate placement. Consider making generation more robust or optional.
-   [ ] **Client Unhandled Promises:** Review major `async` operations in client services (e.g., API calls in `authService`, `cultureService`, `analysisService`) and ensure `try...catch` blocks handle potential errors gracefully (e.g., updating UI, showing alerts).
-   [ ] **Server Unhandled Promises in Routes:** Wrap the core logic of each route handler function in `server/routes/*.js` within a `try...catch` block that passes errors to `next(error)` or sends an error response.

## 🏗️ PRIORITY 5: Code Structure & Minor Issues

-   [ ] **App Entry Point Clarification:** Determine the intended main application entry point (root `App.tsx` vs. `culturalai/index.js`). Ensure `npm start` (or the relevant Expo command) launches the correct application with the full `RootNavigator` and `AuthProvider`.
-   [ ] **Client State on Unmounted Components:** Add cleanup functions with an `isMounted` check to `useEffect` hooks performing async operations that update state in screens like `CulturalBriefingDetailScreen.tsx`, `CultureSelectionScreen.tsx`, `IdiomDetailScreen.tsx`, and `TextAnalysisScreen.tsx`.
-   [ ] **Type Safety in `renderFeedback` (`TextAnalysisScreen.tsx`):** Improve robustness of accessing `feedback.issues` (e.g., using optional chaining `feedback?.issues?.map` or more explicit checks).

## ✅ Verification & Testing

-   [ ] **Test Client-Server Communication:** After client-side DB removal, thoroughly test all features that rely on fetching data from or sending data to the server.
-   [ ] **Test OpenAI Integration:** Specifically test scenarios where OpenAI might return non-JSON or malformed responses to ensure server handles it.
-   [ ] **Test Edge Cases:** Test with empty arrays, missing data, and invalid inputs for features now guarded by array length checks.
-   [ ] **Test Authentication Flow:** Ensure login, signup, and logout work correctly after architectural changes.
-   [ ] **Review Console Logs:** Monitor client and server logs for any new warnings or errors during testing.