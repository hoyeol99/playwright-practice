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

