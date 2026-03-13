\# Flakiness / CI Incident Case 001 — Missing import causes ReferenceError



\## 1) 원인(현상)

\- 언제/어디서: 로컬 실행(및 CI에서도 동일하게 재현 가능)에서 smoke 테스트가 실패

\- 증상: `ReferenceError: expectTodoLabel is not defined`

\- 영향: smoke 테스트가 모든 브라우저 프로젝트(또는 전체 프로젝트)에서 동시에 실패로 표시됨  

&#x20; - 원인은 브라우저 이슈가 아니라 “테스트 코드 실행 단계에서의 런타임 에러”였음



\## 2) 가설(가능한 원인)

1\) utils에 함수가 export되어 있지 않다.

2\) spec 파일에서 함수 import가 누락되었다.

3\) import 경로가 잘못되어 다른 파일을 참조한다(파일 위치/이름 불일치).



\## 3) 검증(최소 실험)

\- 에러가 발생한 라인 확인: `todo.spec.ts`에서 `expectTodoLabel(...)` 호출 지점에서 즉시 ReferenceError 발생

\- utils 파일 확인: `tests/utils/todo.ts`에 `export async function expectTodoLabel(...)` 존재 여부 확인

\- spec import 확인: `tests/todo.spec.ts` 상단 import 목록에 `expectTodoLabel` 포함 여부 확인  

&#x20; - 포함되어 있지 않음을 확인 → 가설 2가 유력



\## 4) 해결(가장 작은 변경)

\- 변경 내용: `tests/todo.spec.ts` 상단 import에 `expectTodoLabel` 추가

&#x20; - 예: `import { ..., expectTodoLabel, ... } from './utils/todo';`

\- 수정 파일:

&#x20; - `tests/todo.spec.ts`

\- 왜 이게 해결인가:

&#x20; - 런타임에서 함수 식별자(`expectTodoLabel`)가 정의되지 않았던 원인이 “import 누락”이었고,

&#x20; - import 추가로 해당 함수가 스코프에 정상적으로 로드되어 ReferenceError가 해소됨



\## 5) 회고(재발 방지 규칙)

\- 규칙(1줄):

&#x20; - “새 헬퍼 함수를 사용할 때는 \*\*(1) utils에 export 존재 (2) spec에 import 존재\*\*를 먼저 확인한다.”

\- 레포에 고정한 위치(택1):

&#x20; - `docs/ops-playbook.md`의 Flakiness 대응 절차에 체크 항목으로 추가

&#x20; - 또는 `tests/utils/todo.ts` 상단 주석으로 ‘export/import 정합성’ 규칙 추가

&#x20; - 또는 PR 체크리스트(README)로 고정

