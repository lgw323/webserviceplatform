# 10주차: 풀스택 연동 및 시각화 구현 보고서

## 1. 수행 목표
- 7주차에 설계 및 구현한 프론트엔드 UI 컴포넌트와 8~9주차에 개발한 백엔드 API 및 하드웨어 유사도 매칭 엔진 통합.
- Client/Server 계층형(Layered) 아키텍처를 도입하여 클라이언트 UI와 서버 비즈니스 로직을 완벽히 분리.
- 런처 통합 게임 활동 통계 대시보드를 시각적으로 구현하여 스팀/라이엇 플레이타임 트래킹 모사.

## 2. 개발 내역
### 2.1. Backend (Server) 통신 및 라우팅 계층
- **Controller & Routes 분리**: `auth`, `profiles`, `games`, `recommendations` 도메인별로 라우트와 컨트롤러를 세분화하여 MVC 구조를 확립했습니다.
- **Middleware**: 글로벌 에러 핸들러(`errorMiddleware.js`) 및 JWT 기반 인증 검증기(`authMiddleware.js`)를 미들웨어로 분리하여 서버 안정성을 증대했습니다.
- **Services**: 하드웨어 가중치 스코어링을 수행하는 핵심 매칭 엔진을 서비스 계층(`matchingEngine.js`)으로 캡슐화했습니다.

### 2.2. Frontend (Client) UI 연동 및 시각화
- [App.jsx](./client/src/App.jsx):
  - 메인 통합 레이아웃. 상단 글로벌 네비게이션을 통해 대시보드(통계), PC 관리(하드웨어 입력), 최적화 허브(유사도 정렬 목록) 탭 뷰를 라우팅.
- [apiClient.js](./client/src/api/apiClient.js):
  - 브라우저 표준 `fetch` 모듈을 이용해 백엔드 API 서비스를 비동기 호출. 
  - **오프라인 회복 탄력성(Offline Fallback)**: 로컬 실습 및 백엔드 미동작 상황에 유연하게 대처할 수 있도록 클라이언트 측에서 구동하는 간이 로컬 매칭 필터 엔진 내장.
- [DashboardCharts.jsx](./client/src/features/dashboard/DashboardCharts.jsx):
  - Recharts 시각화 라이브러리에 대응하는 커스텀 플레이 타임 게이지 차트 UI.
  - 스팀/라이엇 등 게임별 플레이 시간 비례 바 차트 및 업적 달성률/승률 등 종합 KPI 통계 카드 렌더링.

## 3. 결과 및 향후 계획
- 독립된 Client와 Server 환경에서 각각 동작하는 풀스택 API 서비스 연동 계층 구현 및 시각화 통계 처리를 완료했습니다.
- 11주차에는 연동 과정에서 발생할 수 있는 결함(Bug) 분석 및 예외처리를 강화하기 위한 QA 테스트 시나리오를 구성할 예정입니다.
