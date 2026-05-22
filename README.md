# 🚀 SYNCRIG: Hardware Profile Optimization Platform

![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)

**SYNCRIG**은 사용자의 PC 하드웨어 사양(CPU, GPU, RAM 등)을 분석하여, 데이터베이스에 축적된 전 세계 게이머들의 최적화 설정 프로필과 비교하고 **가장 적합한 인게임 그래픽 세팅을 추천해 주는 웹 플랫폼**입니다.

이 레포지토리는 기획부터 디자인, 알고리즘 구현, 풀스택 연동, 그리고 Vercel 상용 배포까지 이어지는 **12주간의 소프트웨어 생명주기(SDLC)** 산출물을 모두 담고 있습니다.

---

## 🌟 주요 기능 (Key Features)

- 🧮 **하드웨어 매칭 엔진 (Matching Engine v1.0)**
  - 가중치가 부여된 정규화 L1-노름(Weighted Normalized Manhattan Distance) 기반 알고리즘 탑재
  - GPU(50%), CPU(30%), RAM(10%), 해상도(10%) 가중치 기반 유사도(Similarity) 산출 및 랭킹 시스템
- 📊 **통합 대시보드 (Interactive Dashboard)**
  - Recharts를 활용한 스팀/라이엇 게임 플레이타임 및 업적 달성률 게이지 차트 시각화
  - 외부 소셜 계정(Steam) 연동 시뮬레이션 및 데이터 병합(Sync) 기능 구현
- ⚡ **풀스택 계층형 아키텍처 (Layered Architecture)**
  - React/Vite 기반의 클라이언트와 Express 기반의 API 서버 분리 (MVC 패턴)
  - 브라우저 비동기 Fetch 통신 및 JWT 기반 인증 프로세스 구현

---

## 🛠️ 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: TailwindCSS, PostCSS
- **Visualization**: Recharts, Lucide-React

### Backend & Algorithm
- **Environment**: Node.js, Express.js
- **Database**: PostgreSQL (pg), In-Memory Mock Fallback
- **Security**: JWT (JSON Web Tokens), Crypto

### DevOps & Deployment
- **Hosting / CI/CD**: Vercel (Serverless Functions)
- **Version Control**: Git / GitHub

---

## 📅 주차별 프로젝트 마일스톤 (12-Week Roadmap)

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

---

## 🚀 로컬 실행 방법 (Local Development)

본 프로젝트는 `webplatform_w10` 폴더에서 최종 풀스택 코드가 통합되어 실행됩니다.

```bash
# 1. 최종 작업 디렉토리로 이동
cd webplatform_w10

# 2. 의존성 패키지 설치
npm install
cd client && npm install && cd ..

# 3. 로컬 개발 서버 실행 (프론트엔드 + 백엔드 동시 실행)
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---
*© 2026 SYNCRIG Project. All rights reserved.*
