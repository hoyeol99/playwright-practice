[![Playwright Smoke (CI)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-smoke.yml/badge.svg)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-smoke.yml)

[![Playwright Regression (Manual)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-regression.yml/badge.svg)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-regression.yml)



###Tip: Click the CI badges at the top of this README to jump to the workflow runs.



\## Purpose

Minimal Playwright E2E automation practice (portfolio-ready): core flow + negative case.



\## How to run

npm install

npx playwright install

npx playwright test

npx playwright show-report



\## Evidence on failure

\- trace: on-first-retry (retries: 1)

\- screenshot: only-on-failure

\- video: retain-on-failure

Artifacts are saved under /test-results and linked in the HTML report.



\## Tests

\- todo.spec.ts: add \& complete (smoke), empty input not added (negative)



\### Quick commands

\- npm run test:smoke

\- npm run test:negative

\- npm run report

\- npm run test:regression



\## CI (GitHub Actions)

\- Smoke: runs automatically on push/PR to main.

\- Regression: manual workflow (Actions tab → Run workflow).

\- HTML report is uploaded as an artifact after each run.

\- Smoke artifact: `playwright-report`

\- Regression artifact: `playwright-report-regression`


### Reports (Artifacts)
After a workflow run finishes:
1) Go to **Actions** → select the latest run.
2) Download the artifact:
   - Smoke: `playwright-report`
   - Regression: `playwright-report-regression`
3) Unzip and open `playwright-report/index.html` in your browser.
