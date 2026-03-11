\# Automation Ops Playbook



\## 1) How to run (운영 실행 규칙)

\- Quick confidence: `npm run test:smoke` (Chromium-only)

\- Policy/edge: `npm run test:negative` (Chromium-only)

\- Regression: `npm run test:regression` (Chromium-only)

\- 목적: CI는 빠른 신뢰 확보가 우선 → smoke 중심 운영



\## 2) Evidence Rule (실패 시 증거 확인 순서)

1\. Playwright Report (Artifacts) 확인

2\. Trace 우선 확인 (재현/원인 파악의 1순위)

3\. Screenshot/Video는 보조 증거로 활용

원칙: 재현 가능한 증거 없이는 결론을 내리지 않는다.



\## 3) Flakiness 대응 절차 (필수 템플릿)

\- 원인(현상/에러/어느 assert에서 깨짐)

\- 가설(2~3개)

\- 검증(각 가설을 깨는 최소 실험)

\- 해결(가장 작은 변경으로 fix)

\- 회고(재발 방지 규칙 1줄을 README/코드에 고정)



\## 4) CI Platform Changes (예: Node 런타임 전환)

\- 경고/공지 발생 시: 영향 범위 확인 → smoke workflow에서 선제 검증

\- 원칙: “성공 + 경고”는 즉시 장애가 아니라 ‘운영 리스크’로 기록하고 추적

\- 필요 시: 워크플로우에서 런타임 옵션/버전 업데이트로 대응

