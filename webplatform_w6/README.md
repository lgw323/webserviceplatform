# 6주차: 시스템 디자인 및 아키텍처 명세

## 1. 수행 목표
- 3-Tier 아키텍처 기반의 프론트엔드, 백엔드, 데이터베이스(PostgreSQL)의 세부 모듈 및 연동 관계 명세.
- 관계형 데이터베이스 정규화(3NF)를 준수하는 ERD 설계.
- API 규격 정의서 및 에러 코드 스키마 정의.

## 2. 산출물 내역
- [2021663046_이건우.md](./2021663046_이건우.md): API 규격서, 데이터 스키마 명세, 보안 규칙 등을 정의한 상세 소프트웨어 설계 사양서(Software Design Specification).
- [architecture.png](./architecture.png): 클라이언트 브라우저-Node/Express 백엔드 서버-PostgreSQL/Redis DB 간의 아키텍처 구조도.
- [erd.png](./erd.png): `users`, `hardware_profiles`, `games`, `optimization_profiles` 테이블의 3등분 정규화 스키마 ERD 이미지.
- [2021663046_이건우.pptx](./2021663046_이건우.pptx), [2021663046_이건우.pdf](./2021663046_이건우.pdf): 6주차 아키텍처 설계 발표 자료.
- [3. 기능명세서_2026-04-10.md](./3.%20기능명세서_2026-04-10.md): 기능 정의 최종 확인 및 추가 보안 요구사항 가이드.
