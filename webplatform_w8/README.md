# 8주차: 백엔드 서버 및 DB 스키마 구축 보고서

## 1. 수행 목표
- 6주차에 설계된 3-Tier 아키텍처 및 ERD 명세서를 토대로 백엔드 개발 시작.
- Node.js + Express 기반의 Stateless API 서버 기본 환경을 설정하고 라우트 보일러플레이트 구성.
- PostgreSQL 데이터베이스 연동 환경을 구축하고 테이블 및 관계 스키마 SQL 명세서 정의.

## 2. 개발 내역
### 2.1. 개발 환경 세팅
- [package.json](./package.json): Express.js 서버 구성에 필요한 모듈 정의 (cors, dotenv, pg). nodemon 개발 의존성을 추가해 개발 생산성 향상.
- [server.js](./server.js):
  - Express 인스턴스 초기화 및 JSON/CORS 파싱 미들웨어 장착.
  - 서버 및 DB 상태 진단을 위한 `/api/health` 헬스체크 API 구현.
  - 하드웨어 프로필 저장을 모사하는 REST API (`/api/v1/users/hardware-profiles`) 구현.
  - 글로벌 에러 핸들러 미들웨어를 구축하여 500 에러 시 표준 JSON 에러 형식 출력.

### 2.2. 데이터베이스 구성
- [schema.sql](./schema.sql): 6주차 ERD 명세를 반영한 DDL 스크립트 작성.
  - UUID Extension을 이용한 유니크 PK 매핑 (`users`, `hardware_profiles`, `games`, `optimization_profiles`).
  - 관계형 제약 조건(`REFERENCES` 및 `ON DELETE CASCADE`) 부여.
  - GPU 모델명 및 게임 매칭 조회 속도 향상을 위한 DB 인덱스 생성 (`idx_hardware_gpu`, `idx_optimization_game`).
- [db.js](./db.js):
  - `pg` 라이브러리의 `Pool` 인스턴스를 활용하여 커넥션 풀링 구현.
  - 환경변수(`DATABASE_URL`)를 로드하여 보안성과 확장성을 유지하도록 데이터베이스 어댑터 모듈 개발.

## 3. 결과 및 향후 계획
- Express 기반 백엔드 API 서비스와 PostgreSQL 인프라 연동 레이어가 원활하게 분리 정의됨.
- 9주차에는 핵심 로직인 하드웨어 사양 기반 유사도 점수 매칭 엔진을 Javascript로 구현하여 추천 API로 노출할 예정.
