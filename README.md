[![Playwright Smoke (CI)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-smoke.yml/badge.svg)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-smoke.yml)

[![Playwright Regression (Manual)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-regression.yml/badge.svg)](https://github.com/hoyeol99/playwright-practice/actions/workflows/playwright-regression.yml)



### Tip: Click the CI badges at the top of this README to jump to the workflow runs.



## Purpose

Minimal Playwright E2E automation practice (portfolio-ready): core flow + negative case.



## How to run

npm install
npx playwright install
npx playwright test
npx playwright show-report



## Evidence on failure
- trace: on-first-retry (retries: 1)
- screenshot: only-on-failure
- video: retain-on-failure
Artifacts are saved under /test-results and linked in the HTML report.



## Tests
- todo.spec.ts
  - [smoke] add & complete
  - [negative] empty/blank input not added
  - [regression] filters & counter / delete & clear completed



## Test Scope / Out of Scope

### In Scope (포함)
- Core E2E: 핵심 사용자 플로우(추가/완료/삭제 등)
- Negative: 빈 값/공백 입력 방어
- Regression: 필터/카운터/상태 유지 등 자주 깨지는 영역

### Out of Scope (현재 제외)
- Cross-browser (CI는 Chromium-only)
- Performance/Load testing
- Visual regression / Accessibility automation (추후 확장 가능)



## Flakiness 방지 규칙

### Locator 우선순위
1) getByRole(name 포함) 우선
2) getByLabel / getByPlaceholder
3) text 기반은 최소화(문구 변경에 취약)
4) nth() / 깊은 CSS selector 지양 (불가피하면 이유를 주석으로 남김)

### Wait 전략
- waitForTimeout() 금지 (예외가 필요하면 근거를 주석으로 명시)
- expect(...).toBeVisible(), toHaveText() 같은 "assert 기반 대기" 사용

### 테스트 독립성
- 테스트 간 상태 공유 금지 (각 테스트가 스스로 준비/정리)
- 테스트 데이터(문자열)는 상수로 분리하여 관리



### Quick commands

- npm run test:smoke
- npm run test:negative
- npm run report
- npm run test:regression



## CI (GitHub Actions)

- Smoke: runs automatically on push/PR to main.
- Regression: manual workflow (Actions tab → Run workflow).
- HTML report is uploaded as an artifact after each run.
- Smoke artifact: `playwright-report`
- Regression artifact: `playwright-report-regression`


### Reports (Artifacts)
After a workflow run finishes:
1) Go to **Actions** → select the latest run.
2) Download the artifact:
   - Smoke: `playwright-report`
   - Regression: `playwright-report-regression`
3) Unzip and open `playwright-report/index.html` in your browser.
