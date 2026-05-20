# 11주차: QA 테스트 및 결함 관리 보고서

## 1. 수행 목표
- 10주차에 통합한 SYNCRIG 풀스택 연동 기능의 기능적 요구사항 수용 기준 충족 여부 테스트.
- 백엔드 데이터 검증 및 에러 발생 상황을 유연하게 제어하기 위한 API 예외 처리 구조 구현.
- 매칭 엔진의 핵심 정밀도를 검증하기 위한 자바스크립트 단위 테스트 실행 및 QA 검증.

## 2. 개발 내역
### 2.1. QA 체크리스트 및 수용 검증
- [qa_checklist.md](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w11/qa_checklist.md): 5개 핵심 유스케이스(OAuth 연동, 하드웨어 CRUD, 매칭 알고리즘, 대시보드 차트, 예외 핸들링)에 대한 시나리오 테스트 결과 명세. 전체 5개 테스트 케이스 PASS 완료.

### 2.2. 결함 관리 및 API 예외 처리 구축
- [errorMiddleware.js](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w11/errorMiddleware.js):
  - **입력 유효성 검사**: CPU, GPU 문자열 검증 및 RAM(1~256GB), 주사율(60~500Hz) 범위 제한 벨리데이터 구현.
  - **라우팅 예외**: 존재하지 않는 경로 요청 시 `NOT_FOUND` JSON 표준 에러 응답 미들웨어 구축.
  - **예외 로그 적재**: 예외 발생 시 스택 트레이스와 일시를 기록하는 중앙식 Exception Handler 구축.

### 2.3. 알고리즘 단위 검증
- [testCases.js](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w11/testCases.js):
  - Node.js 스크립트로 동작하는 단위 테스트 코드.
  - 100% 동일 하드웨어 세팅 매칭(1.0), 미세 사양 차이(RAM 용량 차이), 상이한 세대 하드웨어 사양 매칭 등 조건별 가중치 연산 범위 단언(Assert) 테스트 수행.

## 3. 결과 및 향후 계획
- 수동 UI QA 및 알고리즘 단위 테스트를 통과하여 소프트웨어 배포 전 기능적 안정성을 검증함.
- 마지막 12주차에는 프로젝트를 정리하는 결과 보고서 작성 및 발표 슬라이드 프레젠테이션 스크립트 작성, Docker 배포 환경 구성을 진행할 예정.
