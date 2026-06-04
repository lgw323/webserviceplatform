# 🚀 SYNCRIG: Hardware Profile Optimization Platform

![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)

**SYNCRIG**은 사용자의 PC 하드웨어 사양(CPU, GPU, RAM 등)을 분석하여, 데이터베이스에 축적된 전 세계 게이머들의 최적화 설정 프로필과 비교하고 **가장 적합한 인게임 그래픽 세팅을 추천해 주는 웹 플랫폼**입니다.

이 레포지토리는 기획부터 디자인, 알고리즘 구현, 풀스택 연동, Vercel 상용 배포, 그리고 웹접근성(WCAG 2.1) 및 SEO 최적화까지 이어지는 **13주간의 소프트웨어 생명주기(SDLC)** 산출물을 모두 담고 있습니다.

---

## 🌟 주요 기능 (Key Features)

- 🧮 **하드웨어 매칭 엔진 (Matching Engine v1.0)**
  - 가중치가 부여된 정규화 L1-노름(Weighted Normalized Manhattan Distance) 기반 알고리즘 탑재
  - GPU(50%), CPU(30%), RAM(10%), 해상도(10%) 가중치 기반 유사도(Similarity) 산출 및 랭킹 시스템
- 📊 **통합 대시보드 (Interactive Dashboard)**
  - 스팀/라이엇 게임 플레이타임 및 업적 달성률 게이지 차트 시각화
- 🔐 **외부 소셜 계정 연동 (Passport.js OAuth 2.0 / OpenID)**
  - `passport-steam` 및 `passport-oauth2`를 활용한 실제 스팀/라이엇 인증 서버 리다이렉트 구현
  - Vercel 클라우드 배포 시 API 키 누락 방어를 위한 In-Memory Fallback(우회 로그인) 미들웨어 탑재
- ⚡ **풀스택 계층형 아키텍처 (Layered Architecture)**
  - React/Vite 기반의 클라이언트와 Express 기반의 API 서버 분리 (MVC 패턴)
  - JWT Access/Refresh Token 이중 토큰 인증 + 자동 갱신 인터셉터
- 🔒 **인프라 및 보안 강화 (DevOps & Security)**
  - JWT Secret 환경변수 기반 관리 + 프로덕션 가드
  - Vercel Postgres(Neon Cloud DB) 완벽 연동 및 In-Memory Fallback 시스템 구축
- 🎨 **UX 고도화 (UX Enhancement)**
  - CSS Custom Properties 기반 다크/라이트 이중 테마 시스템
  - 클라이언트사이드 실시간 검색 + 알림 시스템 MVP + 피드백 버튼 실동작

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS, PostCSS, CSS Custom Properties
- **State**: Zustand
- **Visualization**: Recharts, Lucide-React

### Backend & Algorithm
- **Environment**: Node.js, Express.js
- **Database**: PostgreSQL (pg), In-Memory Mock Fallback
- **Security**: JWT (Access + Refresh Token), Crypto, express-rate-limit

### DevOps & Deployment
- **Hosting / CI/CD**: Vercel (Serverless Functions)
- **Version Control**: Git / GitHub

---

## 📅 주차별 프로젝트 마일스톤 (13-Week Roadmap)

| 주차 | 단계 | 주요 내용 및 산출물 |
|:---:|:---|:---|
| **2주차** | **Ideation** | 웹 서비스 플랫폼 기획 및 핵심 아이디어 정의 |
| **3주차** | **Milestone** | 서비스 개념 설계 및 세부 기획 마일스톤 수립 |
| **4주차** | **PRD** | 제품 요구사항 정의서(PRD) 및 상세 기능 명세서 작성 |
| **5주차** | **UI/UX** | UI/UX 프로토타입 구현 및 사용자 화면 흐름(Flow) 정의 |
| **6주차** | **Architecture** | 전체 시스템 디자인 및 데이터베이스/서버 아키텍처 명세 |
| **7주차** | **Frontend** | React 기반 클라이언트 UI 컴포넌트 마크업 및 퍼블리싱 |
| **8주차** | **Backend** | Node.js Express 백엔드 라우팅 및 PostgreSQL DB 스키마 구축 |
| **9주차** | **Algorithm** | 성능 계수 기반 하드웨어 매칭 엔진(유사도 알고리즘) 모델링 |
| **10주차** | **Integration** | 클라이언트-서버 간 비동기 API 통신 연동 및 대시보드 시각화(`localhost` 환경) |
| **11주차** | **QA & Fixes** | Steam 계정 연동 세션 충돌 오류 픽스 및 예외 처리 고도화 |
| **12주차** | **Deployment** | 모노레포 환경 Vercel 상용 자동화 배포 및 크로스플랫폼(glibc/musl) 버그 트러블슈팅 성공 |
| **13주차** | **A11y & SEO** | WCAG 2.1 웹접근성(시맨틱 HTML, ARIA, 포커스 트랩, 키보드 내비) 및 SEO(OG/Twitter, JSON-LD, 동적 메타) 전면 적용 |
| **14주차** | **OAuth & UI** | Passport.js 소셜 로그인(Steam/Riot) 연동 및 B2B/B2C 비즈니스 모델을 반영한 2-Column 대시보드 위젯 UI 개편 |

---

## 🌿 버전 관리 및 커밋 컨벤션 (Version Control)

이 프로젝트는 안정적인 서비스 운영과 명확한 히스토리 추적을 위해 **기능별 브랜치 전략**과 **엄격한 커밋 컨벤션**을 따릅니다.

### 1. 브랜치(Branch) 관리 전략
- **`main`**: 항상 배포 가능한 상태를 유지하는 프로덕션(상용) 브랜치입니다. Vercel과 직접 연결되어 있어, 이 브랜치에 코드가 병합(Merge)되면 자동으로 상용 서버에 재배포됩니다.
- **기능 브랜치 (`feat/*`, `fix/*`, `docs/*`)**: 새로운 기능을 개발하거나 버그를 수정할 때 `main`에서 파생되어 작업하는 격리된 공간입니다.
  - 예시: `feat/외부계정연동`, `fix/로그인-버그-수정`
  - 작업이 완벽하게 완료되고 검증(테스트)이 끝나면 `main`으로 병합(Pull Request)합니다.

### 2. 커밋(Commit) 메시지 포맷
모든 커밋 메시지는 어떤 변화가 있었는지 직관적으로 알 수 있도록 아래의 포맷을 강제합니다.
- **`타입: 한글 설명`** 형식 준수
  - `feat`: 새로운 기능 추가 (예: `feat: 스팀 및 라이엇 외부 계정 연동 구현`)
  - `fix`: 버그 수정 (예: `fix: JWT Secret 키 불일치로 인한 인증 오류 해결`)
  - `docs`: 문서 수정 (예: `docs: README.md 커밋 컨벤션 규칙 추가`)
  - `style`: 코드 포맷팅, 세미콜론 누락 등 코드 변경이 없는 경우
  - `refactor`: 코드 리팩토링 (기능 변화 없음)
  - `test`: 테스트 코드 추가 및 수정

### 3. 작업 단위 커밋 (Atomic Commits)
- 여러 개의 다른 목적을 가진 수정 사항을 하나의 커밋으로 뭉뚱그려 올리지 않습니다.
- **"하나의 커밋 = 하나의 논리적 작업(또는 하나의 기능)"** 원칙을 고수하여, 각 파일의 역할이나 수정 사항이 커밋 하나에 명확히 담기도록 분할하여 커밋합니다.

---

## 🚀 로컬 실행 방법 (Local Development)

본 프로젝트는 `webplatform_w10` 폴더에서 최종 풀스택 코드가 통합되어 실행됩니다.

```bash
# 1. 최종 작업 디렉토리로 이동
cd webplatform_w10

# 2. 환경변수 설정 (선택 — 없으면 개발용 fallback으로 동작)
cp .env.example .env
# .env 파일을 열어 JWT_SECRET 등 실제 값을 입력하세요

# 3. 의존성 패키지 설치
npm install
cd client && npm install && cd ..

# 4. 로컬 개발 서버 실행 (프론트엔드 + 백엔드 동시 실행)
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---
*© 2026 SYNCRIG Project. All rights reserved.*
