\# Flakiness / CI Incident Case 002 — Node20 deprecation warning \& workflow env placement error



\## 1) 원인(현상)

\- 언제/어디서: GitHub Actions (Smoke/Regression workflow 실행 중)

\- 증상 1: Actions에서 경고 표시  

&#x20; - “Node.js 20 actions are deprecated… will be forced to run with Node.js 24 starting June 2, 2026”

&#x20; - checkout/setup-node/upload-artifact 등 주요 action이 Node20 기반으로 표시됨

\- 증상 2: 경고 대응을 위해 env를 추가하는 과정에서 workflow 파싱 에러 발생  

&#x20; - 에러: `Invalid workflow file ... Unexpected value 'FORCE\_JAVASCRIPT\_ACTIONS\_TO\_NODE24'`

\- 영향: workflow가 “실행 자체가 안 되는 상태”가 되어 CI가 막힘



\## 2) 가설(가능한 원인)

1\) env 변수를 잘못된 위치(`jobs:` 바로 아래 등)에 작성했다.

2\) YAML 문법(들여쓰기/레벨)이 깨졌다.

3\) 배지/상태가 즉시 반영되지 않아 “실패처럼 보이는” 캐시 문제가 있다.



\## 3) 검증(최소 실험)

\- GitHub Actions 에러 메시지에서 “허용되는 job 속성 목록”을 확인 → env가 job 레벨/워크플로우 레벨에만 허용됨을 추정

\- workflow 파일 구조 확인 → `jobs:` 아래에 `env:`를 두는 형태(잘못된 레벨)였음을 확인

\- 수정 후 재실행 → workflow 파싱 에러가 사라지고 정상 실행됨

\- 이후 배지 상태가 즉시 바뀌지 않아 지연/캐시 가능성을 확인(시간 경과 후 passing으로 갱신)



\## 4) 해결(가장 작은 변경)

\- 변경 내용: `FORCE\_JAVASCRIPT\_ACTIONS\_TO\_NODE24=true`를 “허용되는 위치”로 이동

&#x20; - 워크플로우 레벨: `jobs:` 위에 `env:` 추가  

&#x20; - 또는 job 레벨: `jobs.<job\_id>.env:`에 추가

\- 결과:

&#x20; - workflow 파싱 오류 해결 → CI 정상 실행

&#x20; - Node20 deprecation 경고는 ‘플랫폼 전환 예고’ 성격이므로 즉시 사라지지 않을 수 있으나, 운영 리스크로 기록하고 추적



\## 5) 회고(재발 방지 규칙)

\- 규칙(1줄):

&#x20; - “GitHub Actions env는 \*\*워크플로우 레벨(env) / job 레벨(jobs.<id>.env) / step 레벨\*\*에만 둔다( `jobs:` 바로 아래는 금지).”

\- 운영 팁:

&#x20; - 배지 상태는 캐시로 지연될 수 있으니, 최신 run 결과는 Actions 페이지에서 먼저 확인한다.

