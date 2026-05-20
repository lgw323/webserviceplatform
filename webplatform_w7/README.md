# 7주차: 프론트엔드 UI 컴포넌트 개발 보고서

## 1. 수행 목표
- 6주차 기획 및 시스템 설계 단계 완료 후, 본격적인 프론트엔드 개발 단계 진입.
- 와이어프레임 및 디자인 시스템 규격(비비드 그린 `#23ce6b` 및 다크 차콜 `#272d2d`, 부드러운 라운딩 테두리 적용)을 바탕으로 Tailwind CSS 설정 구축.
- 핵심 유저 시나리오를 구성하는 하드웨어 프로필 등록 컴포넌트 및 유사도 추천 목록 UI 구현.

## 2. 개발 내역
### 2.1. 프로젝트 환경 구성
- [package.json](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w7/package.json): React 18 및 Tailwind CSS, Icon 라이브러리(Lucide React), 그래프 컴포넌트(Recharts)가 명세된 보일러플레이트 구성.
- [tailwind.config.js](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w7/tailwind.config.js): SYNCRIG 고유 테마 컬러 토큰 지정 (`brand-green`, `brand-charcoal`) 및 부드러운 라운딩 요소(`brand-lg`, `brand-md` 등), 디자인 규격 섀도우 정의.

### 2.2. 컴포넌트 구현
- [HardwareProfileForm.jsx](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w7/src/components/HardwareProfileForm.jsx):
  - CPU 및 GPU 모델명 문자열 입력 폼.
  - RAM 용량(8/16/32/64 GB), 해상도(FHD/QHD/4K), 주사율(Hz) 등 필수 시스템 하드웨어 정량값 선택 옵션 제공.
  - 기본값 지정을 위한 체크박스 제어 및 UI 폼 유효성 검증 제공.
- [RecommendationList.jsx](file:///c:/Users/dlrjs/OneDrive/바탕 화면/대학교/webplatform/webplatform_git/webserviceplatform/webplatform_w7/src/components/RecommendationList.jsx):
  - 사용자 하드웨어 제원 기준 표시.
  - 유사도 백분율 점수 계산에 따른 시각 피드백 조건부 렌더링 (90% 이상은 비비드 그린 배지, 미만은 앰버 배지).
  - 평균 예상 프레임(FPS) 및 인게임 그래픽 설정 프리셋 렌더링.
  - 설정 적용을 위한 클립보드 복사 유도 UI 및 유용한 설정 평가를 위한 버튼 구현.

## 3. 결과 및 향후 계획
- UI 전반에 테두리를 지양하고 부드러운 드롭 섀도우를 적용하여 세련된 모던 대시보드 테마 완성.
- 8주차에는 REST API를 제공하기 위한 Express.js API 서버와 PostgreSQL ERD 스키마 쿼리 구축을 진행할 예정.
