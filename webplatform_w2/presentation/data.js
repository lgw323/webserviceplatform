const presentationData = [
    {
        type: 'title',
        title: '통합 게임 데이터 및<br/>하드웨어 최적화 플랫폼',
        subtitle: '분산된 게이밍 경험의 일원화 및 하드웨어 매칭 시스템',
        desc: '',
        author: '웹 서비스 플랫폼 프레젠테이션',
        date: '2026. 03'
    },
    {
        type: 'content_slide',
        title: 'BACKGROUND 파편화된 게이밍 환경과 최적화의 한계',
        topic: '문제점 정의 및 현황 분석',
        icon: 'alert-circle',
        cards: [
            {
                title: '다중 플랫폼 분산 구조',
                icon: 'pie-chart',
                content: `Steam, Epic, Riot 등 다중 런처 사용으로 인한 데이터 통합 관리 불가`
            },
            {
                title: '하드웨어 최적화 한계',
                icon: 'cpu',
                content: `AAA 게임 요구 사양 급증. 일반 유저의 최적화 설정값 탐색 비용 증가`
            }
        ]
    },
    {
        type: 'content_slide',
        title: 'OBJECTIVES 솔루션: 다면 웹 서비스 플랫폼 구축',
        topic: '프로젝트 목표 및 서비스 정의',
        icon: 'target',
        cards: [
            {
                title: '데이터 중개 (Data Hub)',
                icon: 'layers',
                content: `분산된 API 기반 게임 데이터를 단일 대시보드로 통합 관리.`
            },
            {
                title: '다면 플랫폼 (Multi-Sided)',
                icon: 'users',
                content: `사용자 하드웨어 제원 기반 검증된 최적화 설정값 매칭.`
            }
        ]
    },
    {
        type: 'content_slide',
        title: 'POSITIONING 차별화 전략 및 포지셔닝',
        topic: '기존 서비스의 한계점 극복',
        icon: 'map-pin',
        cards: [
            {
                title: '기능의 단일 아키텍처 결합',
                icon: 'boxes',
                content: `전적 검색 및 하드웨어 커뮤니티의 분리된 기능을 단일 아키텍처 내 수용.`
            },
            {
                title: '개인화 벤치마크',
                icon: 'candlestick-chart',
                content: `정량적 수치 기반의 유사도 매칭을 통한 맞춤형 벤치마크 결과 도출.`
            }
        ]
    },
    {
        type: 'content_slide',
        title: 'ARCHITECTURE 시스템 아키텍처 설계',
        topic: '3-Tier 설계 및 외부 API 연동',
        icon: 'server',
        cards: [
            {
                title: 'Frontend & Backend',
                icon: 'layout-template',
                content: `React.js 기반 SPA 및 Node.js 기반 RESTful API.`
            },
            {
                title: 'Database & Algorithm',
                icon: 'database',
                content: `RDBMS 활용 및 고성능 매칭 알고리즘 최적화.`
            }
        ]
    },
    {
        type: 'mockup_slide',
        title: 'CORE 01 통합 대시보드',
        topic: '라이브러리 및 도전과제 시각화',
        icon: 'layout-dashboard',
        mockupType: 'dashboard',
        description: '누적 플레이 타임 및 도전과제 달성률 트래킹'
    },
    {
        type: 'mockup_slide',
        title: 'CORE 02 프로파일 매칭',
        topic: '하드웨어 환경 기반 최적화',
        icon: 'settings',
        mockupType: 'optimizer',
        description: '제원 일치 커뮤니티 설정값 도출 및 콘솔 명령어 복사'
    },
    {
        type: 'content_slide',
        title: 'REFERENCE 사용자 제원 등록 로직',
        topic: '데이터 베이스 참조 ERD',
        icon: 'table-properties',
        cards: [
            {
                title: '부품 구조 정규화',
                icon: 'cpu',
                content: `하드웨어 부품 메타데이터 테이블 분리 및 외래키 맵핑.`
            },
            {
                title: '유저 프로필 매핑',
                icon: 'user-check',
                content: `유저-하드웨어-로컬 데이터 간의 N:M 관계의 정밀한 중개.`
            }
        ]
    },
    {
        type: 'content_slide',
        title: 'BM 수익 창출 모델',
        topic: '플랫폼 생태계 다면 전략',
        icon: 'coins',
        cards: [
            {
                title: '광고 및 판매',
                icon: 'bar-chart',
                content: `타겟팅 광고 배너 노출 및 통계 데이터 판매.`
            },
            {
                title: '프리미엄 구독',
                icon: 'crown',
                content: `파워유저용 클라우드 백업 및 동기화 월구독 제공.`
            }
        ]
    },
    {
        type: 'timeline_slide',
        title: 'WBS 추진 일정계획',
        events: [
            { week: '1~4주차', title: '설계 및 환경 구축', desc: 'UI/UX 기획, ERD 설계, 프론트/백엔드 보일러플레이트 세팅.' },
            { week: '5~8주차', title: '알파 마일스톤', desc: '대시보드 화면 및 DB CRUD 연동.' },
            { week: '9~11주차', title: '베타 마일스톤', desc: '알고리즘 튜닝 및 유저간 커뮤니티 개발.' },
            { week: '12~14주차', title: '테스트 및 배포', desc: 'QA 및 인프라 통합 배포.' }
        ]
    },
    {
        type: 'content_slide',
        title: 'VISION 기대 효과 및 향후 계획',
        topic: '서비스 밸류와 확장성',
        icon: 'rocket',
        cards: [
            {
                title: '탐색 비용 단축',
                icon: 'clock',
                content: `선택 잉여 시간을 획기적으로 줄여 본질에 집중.`
            },
            {
                title: '플랫폼 확장',
                icon: 'globe',
                content: `콘솔 플랫폼 연동 및 모바일 앱 수평 확장성.`
            }
        ]
    },
    {
        type: 'title',
        title: 'Q & A<br/>질의응답',
        subtitle: '경청해 주셔서 감사합니다.',
        desc: 'contact: dlrjsdn0518@gmail.com',
        author: '이건우',
        date: ''
    }
];
