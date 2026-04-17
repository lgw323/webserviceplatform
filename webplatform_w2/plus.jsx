import React, { useState } from 'react';

// 공통 배경 패턴 정의 (Grid)
const GRID_PATTERN = 'linear-gradient(to right, #d1d5db 1px, transparent 1px), linear-gradient(to bottom, #d1d5db 1px, transparent 1px)';

const App = () => {
    const [currentSlide, setCurrentSlide] = useState(1);

    return (
        <div className="min-h-screen bg-neutral-200 p-8 font-sans selection:bg-[#F8F32B] selection:text-black flex flex-col items-center">
            {/* 컨트롤러 (발표용 UI) */}
            <div className="mb-6 flex gap-4 w-full max-w-[1280px]">
                <button
                    onClick={() => setCurrentSlide(1)}
                    className={`px-6 py-2 border-4 border-black font-black uppercase tracking-widest ${currentSlide === 1 ? 'bg-[#F8F32B] shadow-[4px_4px_0px_#000000]' : 'bg-white hover:bg-gray-100'}`}
                >
                    [SLIDE 01] TITLE
                </button>
                <button
                    onClick={() => setCurrentSlide(2)}
                    className={`px-6 py-2 border-4 border-black font-black uppercase tracking-widest ${currentSlide === 2 ? 'bg-[#F8F32B] shadow-[4px_4px_0px_#000000]' : 'bg-white hover:bg-gray-100'}`}
                >
                    [SLIDE 02] BACKGROUND
                </button>
            </div>

            {/* 슬라이드 컨테이너 */}
            <div className="w-full max-w-[1280px] aspect-[16/9] border-[10px] border-black bg-white relative overflow-hidden"
                style={{ backgroundImage: GRID_PATTERN, backgroundSize: '40px 40px' }}>

                {currentSlide === 1 && <Slide1 />}
                {currentSlide === 2 && <Slide2 />}

            </div>
        </div>
    );
};

// ==========================================
// [Slide 1] 타이틀 화면 (System Boot)
// ==========================================
const Slide1 = () => {
    return (
        <div className="w-full h-full flex flex-col relative animate-in fade-in duration-300">
            {/* 중앙 메인 타이틀 블록 (불필요한 메타 정보 제거 및 선택과 집중 적용) */}
            <div className="flex-1 flex items-center justify-center relative z-10">
                <div className="bg-white border-8 border-black shadow-[20px_20px_0px_#000000] p-16 max-w-5xl flex flex-col items-center text-center">
                    <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-8 text-black break-keep">
                        통합 게임 데이터 및<br />하드웨어 최적화 플랫폼
                    </h1>
                    <div className="w-32 h-4 bg-[#F8F32B] mb-8 border-2 border-black"></div>
                    <p className="text-2xl font-bold text-gray-600 tracking-tight">
                        분산된 게이밍 경험의 일원화 및 하드웨어 매칭 시스템
                    </p>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// [Slide 2] 추진 배경 (Error Report)
// ==========================================
const Slide2 = () => {
    return (
        <div className="w-full h-full flex relative animate-in fade-in duration-300">
            {/* 좌측 영역 (Context) - 불필요한 로그 텍스트 제거 및 핵심 문구 배치 */}
            <div className="w-[30%] bg-black h-full border-r-[12px] border-[#F8F32B] flex flex-col z-10 shadow-[8px_0px_0px_rgba(0,0,0,0.5)]">
                <div className="h-8 w-full bg-[#F8F32B]"></div>
                <div className="p-8 flex-1 flex flex-col justify-center">
                    <h2 className="text-white text-6xl font-black uppercase tracking-tighter break-all leading-none italic mb-6">
                        BACKGROUND
                    </h2>
                    <div className="border-l-4 border-[#F8F32B] pl-4">
                        <p className="text-[#F8F32B] text-2xl font-bold leading-tight mb-4">
                            파편화된 게이밍 환경과<br />최적화의 한계
                        </p>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                            문제점 정의 및 현황 분석
                        </p>
                    </div>
                </div>
            </div>

            {/* 우측 영역 (데이터 시각화) */}
            <div className="w-[70%] h-full p-10 flex flex-col gap-10 overflow-hidden">

                {/* ERR_01: 플랫폼 파편화 */}
                <div className="flex-1 bg-white border-4 border-black shadow-[12px_12px_0px_#000000] relative flex flex-col p-8">
                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-mono font-black text-sm">ERR_01</div>
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tight mb-2">다중 플랫폼 분산 구조</h3>
                            <p className="text-lg font-bold text-gray-600">Steam, Epic, Riot 등 다중 런처 사용으로 인한 데이터 통합 관리 불가</p>
                        </div>
                    </div>

                    {/* 네트워크 파편화 그래픽 (CSS Flex 기반 정렬로 수정) */}
                    <div className="flex-1 mt-6 relative border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-between px-16">
                        {/* 유저 노드 */}
                        <div className="bg-black text-[#F8F32B] border-4 border-black p-4 font-black uppercase text-xl shadow-[6px_6px_0px_rgba(0,0,0,0.3)] z-10">
                            USER_DATA
                        </div>

                        {/* 단절 연결선 그래픽 */}
                        <div className="flex-1 h-full flex items-center justify-center relative mx-4">
                            <div className="w-full h-1 border-t-4 border-dashed border-red-500 absolute top-1/2 -translate-y-1/2"></div>
                            <div className="bg-white border-4 border-red-500 px-4 py-2 z-10 rotate-[-5deg] shadow-[4px_4px_0px_#ef4444]">
                                <span className="text-red-500 font-black tracking-widest uppercase">Disconnected</span>
                            </div>
                        </div>

                        {/* 플랫폼 노드들 */}
                        <div className="flex flex-col gap-4 z-10">
                            <div className="bg-white border-4 border-black py-2 px-6 font-black uppercase shadow-[4px_4px_0px_#000000] w-36 text-center">STEAM.db</div>
                            <div className="bg-white border-4 border-black py-2 px-6 font-black uppercase shadow-[4px_4px_0px_#000000] w-36 text-center">EPIC_API</div>
                            <div className="bg-white border-4 border-black py-2 px-6 font-black uppercase shadow-[4px_4px_0px_#000000] w-36 text-center">RIOT_SVC</div>
                        </div>
                    </div>
                </div>

                {/* ERR_02: 하드웨어 병목 현상 */}
                <div className="flex-1 bg-white border-4 border-black shadow-[12px_12px_0px_#000000] relative flex flex-col p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-mono font-black text-sm z-20">ERR_02</div>

                    <div className="flex justify-between items-start z-10 relative bg-white p-2">
                        <div>
                            <h3 className="text-3xl font-black text-black tracking-tight mb-2">하드웨어 최적화 한계</h3>
                            <p className="text-lg font-bold text-gray-600">AAA 게임 요구 사양 급증. 일반 유저의 최적화 설정값 탐색 비용 증가</p>
                        </div>
                    </div>

                    {/* 병목 현상 차트 그래픽 (정렬 및 화살표 CSS 렌더링으로 수정) */}
                    <div className="flex-1 mt-4 relative flex items-end justify-center gap-12 px-12 z-10">

                        {/* Target FPS 바 */}
                        <div className="flex flex-col items-center w-32">
                            <span className="font-mono font-black text-sm mb-2">TARGET_144Hz</span>
                            <div className="w-full h-40 bg-black border-4 border-black relative">
                                <div className="absolute top-0 w-full h-4 bg-white/20"></div>
                            </div>
                        </div>

                        {/* Gap 화살표 (CSS 도형) */}
                        <div className="h-40 flex items-center justify-center relative w-16">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-red-500 text-red-500 font-black px-2 py-1 z-10 shadow-[4px_4px_0px_#ef4444] text-xs">
                                BOTTLENECK
                            </div>
                            {/* 수직 선 */}
                            <div className="w-2 h-32 bg-red-500 relative">
                                {/* 상단 화살촉 */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-red-500"></div>
                                {/* 하단 화살촉 */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-red-500"></div>
                            </div>
                        </div>

                        {/* Current FPS 바 */}
                        <div className="flex flex-col items-center w-32">
                            <span className="font-mono font-black text-sm mb-2 text-gray-500">CURRENT_FPS</span>
                            <div className="w-full h-16 bg-[#F8F32B] border-4 border-black relative">
                                <div className="absolute top-0 w-full h-4 bg-black/10"></div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default App;