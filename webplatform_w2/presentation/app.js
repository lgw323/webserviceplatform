const container = document.getElementById('presentation-container');
let currentSlide = 0;
let currentFontSize = 16;
const DEFAULT_FONT_SIZE = 16;

function renderSlides() {
    container.innerHTML = '';
    let globalSlideIndex = 0;

    presentationData.forEach((data) => {
        if (data.type === 'title') {
            createSlide(globalSlideIndex++, `
                <div class="w-full h-full flex flex-col relative animate-in fade-in duration-300 bg-white">
                    <div class="flex-1 flex items-center justify-center relative z-10">
                        <div class="bg-white border-[8px] border-black shadow-[20px_20px_0px_#000000] p-16 max-w-5xl flex flex-col items-center text-center">
                            <h1 class="text-6xl lg:text-7xl font-heavy-title tracking-tighter leading-tight mb-8 text-black break-keep uppercase">
                                ${data.title}
                            </h1>
                            <div class="w-32 h-4 bg-[#F8F32B] mb-8 border-[3px] border-black"></div>
                            <p class="text-2xl font-bold tracking-tight text-gray-700">
                                ${data.subtitle}
                            </p>
                            ${data.desc ? `<p class="mt-4 font-bold">${data.desc}</p>` : ''}
                        </div>
                    </div>
                </div>
            `);
        }
        else if (data.type === 'toc') {
            createSlide(globalSlideIndex++, `
                <div class="slide-content-wrapper justify-center items-center bg-white">
                    <h2 class="font-heavy-title mb-16 text-black text-center border-b-[4px] border-black pb-6 mx-auto w-1/2 flex items-center justify-center gap-6 uppercase" style="font-size: 72px;">
                        <i data-lucide="layers" class="w-20 h-20 text-black drop-shadow-none" style="stroke-width: 3px;"></i> ${data.title}
                    </h2>
                    <ul class="flex flex-col gap-8 w-full max-w-[56rem] mx-auto text-3xl font-bold">
                        ${data.items ? data.items.map((item, i) => `
                            <li class="toc-item flex items-center bg-white border-[3px] border-black p-5 shadow-[6px_6px_0px_0px_#000000] hover:bg-[#F8F32B]" onclick="goToSlide(${i + 2})">
                                <span class="bg-black text-white font-mono-data mr-6 px-6 py-2 border-[3px] border-black text-3xl">${i + 1}</span>
                                <span class="truncate font-heavy-title text-black uppercase pt-2">${item.split('. ')[1] || item}</span>
                            </li>`).join('') : ''}
                    </ul>
                </div>
            `);
        }
        else if (data.type === 'content_slide') {
            // [Data Parsing] Remove English uppercase prefixes from the title string via Regex.
            const parsedTitle = data.title.replace(/^[A-Z0-9]+\s+/, '');

            createSlide(globalSlideIndex++, `
                <div class="w-full h-full flex relative animate-in fade-in duration-300 bg-white">
                    <!-- Left Context Panel -->
                    <div class="w-[30%] bg-black h-full border-r-[12px] border-[#F8F32B] flex flex-col z-10 shadow-[8px_0px_0px_rgba(0,0,0,0.5)]">
                        <div class="p-8 flex-1 flex flex-col justify-center">
                            
                            <!-- Main Title (Promoted from topic) -->
                            <h2 class="text-[#F8F32B] text-4xl sm:text-5xl lg:text-6xl font-heavy-title tracking-tighter break-keep leading-tight mb-8">
                                ${data.topic}
                            </h2>
                            
                            <!-- Subtitle (Filtered Title) -->
                            <div class="border-l-[6px] border-white pl-6 font-bold">
                                <p class="text-white text-2xl leading-snug break-keep">
                                    ${parsedTitle}
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    <!-- Right Graphic/Data Panel -->
                    <div class="w-[70%] h-full p-10 flex flex-col justify-center overflow-hidden bg-white ${data.title.includes('POSITIONING') ? 'bg-grid' : ''}">
                        ${(() => {
                    // Slide: Objectives
                    if (data.title.includes('OBJECTIVES')) {
                        return `
                                    <div class="flex items-center justify-between h-64 relative px-8">
                                        <!-- Left Node -->
                                        <div class="w-48 bg-white border-[4px] border-black h-full flex flex-col p-4 shadow-[8px_8px_0_0_#000] z-20">
                                            <p class="font-heavy-title text-center mb-4">DATA PROVIDERS</p>
                                            <div class="flex-1 border-[3px] border-black mb-2 flex items-center justify-center font-heavy-title text-sm"><i data-lucide="gamepad-2" class="mr-2"></i> STEAM</div>
                                            <div class="flex-1 border-[3px] border-black mb-2 flex items-center justify-center font-heavy-title text-sm"><i data-lucide="triangle" class="mr-2"></i> EPIC</div>
                                            <div class="flex-1 border-[3px] border-black flex items-center justify-center font-heavy-title text-sm"><i data-lucide="hexagon" class="mr-2"></i> RIOT</div>
                                        </div>
                                        
                                        <!-- Lines -->
                                        <div class="absolute left-48 right-48 top-1/2 h-[4px] bg-black -translate-y-1/2 z-10"></div>
                                        
                                        <!-- Center Hub Node -->
                                        <div class="w-72 h-48 bg-[#F8F32B] border-[4px] border-black shadow-[12px_12px_0_0_#000] z-30 flex flex-col items-center justify-center p-6 text-center transform scale-110 relative">
                                            <div class="absolute -top-[10px] -left-[10px] w-4 h-4 bg-black"></div>
                                            <h3 class="font-heavy-title text-black text-xl mb-2">통합 데이터 &<br/>최적화 플랫폼</h3>
                                            <i data-lucide="layers" class="w-12 h-12 stroke-[3px]"></i>
                                        </div>

                                        <!-- Right Node -->
                                        <div class="w-40 bg-black text-[#F8F32B] border-[4px] border-black h-32 flex flex-col items-center justify-center shadow-[8px_8px_0_0_#F8F32B] z-20">
                                            <i data-lucide="user" class="w-12 h-12 mb-2 stroke-[3px]"></i>
                                            <p class="font-heavy-title tracking-widest text-lg">USER</p>
                                        </div>
                                    </div>
                                `;
                    }
                    // Slide: Positioning
                    else if (data.title.includes('POSITIONING')) {
                        return `
                                    <div class="w-full h-full relative border-[4px] border-black bg-white/50">
                                        <!-- Axes -->
                                        <div class="absolute top-1/2 left-0 w-full h-[8px] bg-black -translate-y-1/2"></div>
                                        <div class="absolute left-1/2 top-0 w-[8px] h-full bg-black -translate-x-1/2"></div>
                                        
                                        <!-- Axis Labels -->
                                        <span class="absolute top-1/2 left-4 -translate-y-full font-heavy-title text-sm bg-white border-[2px] border-black px-2 mt-2">하드웨어 특화</span>
                                        <span class="absolute top-1/2 right-4 -translate-y-full font-heavy-title text-sm bg-white border-[2px] border-black px-2 mt-2">게임 특화</span>
                                        <span class="absolute bottom-4 left-1/2 translate-x-4 font-heavy-title text-sm bg-white border-[2px] border-black px-2">정보 파편화</span>
                                        <span class="absolute top-4 left-1/2 translate-x-4 font-heavy-title text-sm bg-black text-[#F8F32B] border-[2px] border-black px-2">통합화</span>

                                        <!-- Competitors (Gray, bottom left/right) -->
                                        <div class="absolute bottom-[20%] right-[60%] w-32 h-16 bg-gray-200 border-[3px] border-black flex items-center justify-center text-sm font-bold">일반 전적 검색</div>
                                        <div class="absolute bottom-[25%] left-[20%] w-32 h-16 bg-gray-200 border-[3px] border-black flex items-center justify-center text-sm font-bold">로컬 벤치 커뮤</div>

                                        <!-- Us (Top Right, Giant Yellow) -->
                                        <div class="absolute top-[15%] right-[10%] w-64 h-32 bg-[#F8F32B] border-[4px] border-black shadow-[12px_12px_0_0_#000] flex flex-col items-center justify-center p-4 text-center z-20 hover:scale-105 transition-transform cursor-default">
                                            <h3 class="font-heavy-title text-xl mb-2">플랫폼</h3>
                                            <p class="text-xs font-bold font-mono-data border-t-[3px] border-black pt-2">고도화된 매칭 알고리즘 기반 단일 아키텍처</p>
                                        </div>
                                    </div>
                                `;
                    }
                    // Slide: Architecture
                    else if (data.title.includes('ARCHITECTURE')) {
                        return `
                                    <div class="h-full flex flex-col justify-center gap-12 px-16 relative py-8">
                                        <!-- Vertical connection line -->
                                        <div class="absolute left-1/2 top-[10%] bottom-[10%] w-[8px] bg-black -translate-x-1/2 z-0"></div>
                                        
                                        <!-- Frontend -->
                                        <div class="h-32 bg-white border-[4px] border-black shadow-[12px_12px_0_0_#000] z-10 flex relative">
                                            <div class="w-48 bg-black text-white p-4 flex flex-col justify-center border-r-[4px] border-black">
                                                <span class="font-mono-data text-xl">CLIENT_SIDE</span>
                                                <span class="font-heavy-title text-sm text-[#F8F32B]">React.js SPA</span>
                                            </div>
                                            <div class="flex-1 flex items-center gap-4 px-6 bg-white">
                                                <div class="border-[3px] border-black px-4 py-2 font-bold text-sm">대시보드 렌더링</div>
                                                <div class="border-[3px] border-black px-4 py-2 font-bold text-sm">동적 차트 구현</div>
                                            </div>
                                        </div>

                                        <!-- Backend -->
                                        <div class="h-32 bg-black border-[4px] border-black shadow-[12px_12px_0_0_#F8F32B] z-10 flex relative transform translate-x-8">
                                            <div class="w-48 bg-[#F8F32B] text-black p-4 flex flex-col justify-center border-r-[4px] border-black">
                                                <span class="font-mono-data text-xl font-bold">SERVER_SIDE</span>
                                                <span class="font-heavy-title text-sm">Node.js API</span>
                                            </div>
                                            <div class="flex-1 flex items-center justify-between px-6 text-white relative">
                                                <div class="border-[3px] border-white px-4 py-2 font-bold text-sm">비동기 브릿지</div>
                                                <div class="flex items-center">
                                                    <div class="w-16 h-[4px] bg-white"></div>
                                                    <div class="border-[3px] border-white bg-white text-black px-4 py-2 font-bold text-xs uppercase flex flex-col"><i data-lucide="cloud" class="h-4"></i>EXT API</div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Database -->
                                        <div class="h-32 bg-[#F8F32B] border-[4px] border-black shadow-[12px_12px_0_0_#000] z-10 flex relative">
                                            <div class="w-48 bg-white text-black p-4 flex flex-col justify-center border-r-[4px] border-black">
                                                <span class="font-mono-data text-xl font-bold">DATA_TIER</span>
                                                <span class="font-heavy-title text-sm">RDBMS</span>
                                            </div>
                                            <div class="flex-1 flex items-center justify-center px-6">
                                                <div class="w-full h-16 border-[4px] border-black flex items-center justify-center font-heavy-title text-xl tracking-[0.3em] bg-white">
                                                    DATA BANK
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                    }
                    // Slide: ERD Reference
                    else if (data.title.includes('REFERENCE')) {
                        return `
                                    <div class="w-full h-full bg-black border-[10px] border-[#F8F32B] p-8 flex flex-col relative text-white font-mono-data">
                                        <div class="absolute top-2 left-2 flex gap-2">
                                            <div class="w-3 h-3 bg-white"></div><div class="w-3 h-3 bg-white"></div><div class="w-3 h-3 bg-white"></div>
                                        </div>
                                        <p class="mt-4 mb-4">> LOAD ER_DIAGRAM.config --strict</p>
                                        
                                        <div class="flex-1 flex flex-col items-center justify-center relative w-full">
                                            <!-- USER Node -->
                                            <div class="w-48 bg-[#F8F32B] p-4 text-black border-[4px] border-white z-20 relative">
                                                <h4 class="font-heavy-title text-xl border-b-[3px] border-black pb-1 mb-2">USER_TBL</h4>
                                                <p class="text-xs font-bold">+ ID (PK)<br/>+ UUID<br/>+ SETTINGS</p>
                                                <!-- Vertical line down from USER_TBL -->
                                                <div class="absolute top-full left-1/2 -translate-x-1/2 w-[4px] h-[50px] bg-white z-10"></div>
                                            </div>

                                            <!-- Relation Label -->
                                            <div class="bg-black border-[3px] border-white px-4 py-1 z-30 font-bold text-sm uppercase mt-[30px] relative">
                                                NORMALIZED RELATION (1:N)
                                            </div>

                                            <!-- Horizontal Bus Line -->
                                            <div class="w-[80%] h-[4px] bg-white z-10 mt-[20px] relative">
                                                <!-- Vertical lines to child nodes -->
                                                <div class="absolute top-0 left-[12%] w-[4px] h-[30px] bg-white"></div>
                                                <div class="absolute top-0 left-[38%] w-[4px] h-[30px] bg-white"></div>
                                                <div class="absolute top-0 left-[62%] w-[4px] h-[30px] bg-white"></div>
                                                <div class="absolute top-0 left-[88%] w-[4px] h-[30px] bg-white"></div>
                                            </div>

                                            <!-- Hardware Nodes -->
                                            <div class="flex w-[85%] justify-between z-20 mt-[30px]">
                                                <div class="w-32 bg-gray-200 text-black p-2 border-[4px] border-white text-center"><h4 class="font-heavy-title border-b-[2px] border-black">CPU_MD</h4><p class="text-[10px] mt-1 font-bold">Vendor<br/>Model</p></div>
                                                <div class="w-32 bg-gray-200 text-black p-2 border-[4px] border-white text-center"><h4 class="font-heavy-title border-b-[2px] border-black">GPU_MD</h4><p class="text-[10px] mt-1 font-bold">VRAM<br/>Clock</p></div>
                                                <div class="w-32 bg-gray-200 text-black p-2 border-[4px] border-white text-center"><h4 class="font-heavy-title border-b-[2px] border-black">RAM_MD</h4><p class="text-[10px] mt-1 font-bold">Cap<br/>Freq</p></div>
                                                <div class="w-32 bg-gray-200 text-black p-2 border-[4px] border-white text-center"><h4 class="font-heavy-title border-b-[2px] border-black">DISP_MD</h4><p class="text-[10px] mt-1 font-bold">Hz<br/>Res</p></div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                    }
                    // Slide: Business Model
                    else if (data.title.includes('BM')) {
                        return `
                                    <div class="w-full h-full flex items-center pr-12 relative">
                                        <!-- Left Pipelines -->
                                        <div class="flex-1 flex flex-col justify-center gap-12 h-full py-8 pr-12">
                                            
                                            <!-- Top Row: B2B Ads -->
                                            <div class="flex h-24 items-center group relative">
                                                <div class="w-72 bg-white border-[4px] border-black h-full flex items-center p-4 shadow-[6px_6px_0_0_#000] z-20">
                                                    <div class="w-12 h-12 bg-black text-white flex items-center justify-center mr-4"><i data-lucide="target" class="w-6"></i></div>
                                                    <div><h4 class="font-heavy-title text-lg uppercase">Targeted Ads</h4><p class="text-xs font-mono-data font-bold">B2B Hardware Banner</p></div>
                                                </div>
                                                <div class="flex-1 h-[6px] bg-black relative">
                                                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-black"></div>
                                                </div>
                                            </div>

                                            <!-- Mid Row: Premium Sub -->
                                            <div class="flex h-24 items-center group relative">
                                                <div class="w-72 bg-[#F8F32B] border-[4px] border-black h-full flex items-center p-4 shadow-[8px_8px_0_0_#000] z-20 transform scale-105">
                                                    <div class="w-12 h-12 bg-white border-[3px] border-black text-black flex items-center justify-center mr-4"><i data-lucide="crown" class="w-6"></i></div>
                                                    <div><h4 class="font-heavy-title text-lg uppercase">Premium Sub</h4><p class="text-xs font-mono-data font-bold">Cloud Sync & Priority</p></div>
                                                </div>
                                                <div class="flex-1 h-[6px] bg-black relative">
                                                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-black"></div>
                                                </div>
                                            </div>

                                            <!-- Bottom Row: Data Sell -->
                                            <div class="flex h-24 items-center group relative">
                                                <div class="w-72 bg-white border-[4px] border-black h-full flex items-center p-4 shadow-[6px_6px_0_0_#000] z-20">
                                                    <div class="w-12 h-12 bg-black text-white flex items-center justify-center mr-4"><i data-lucide="bar-chart-3" class="w-6"></i></div>
                                                    <div><h4 class="font-heavy-title text-lg uppercase">Data Monroe</h4><p class="text-xs font-mono-data font-bold">Global FPS Reports</p></div>
                                                </div>
                                                <div class="flex-1 h-[6px] bg-black relative">
                                                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-black"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Right Vault -->
                                        <div class="w-40 h-[80%] bg-black border-[4px] border-white outline outline-[6px] outline-black shadow-[16px_16px_0_0_#F8F32B] flex flex-col items-center justify-center p-4 z-10">
                                            <div class="w-16 h-16 rounded-full border-[8px] border-white mb-8 relative">
                                                <div class="absolute top-1/2 left-1/2 w-4 h-[30px] bg-white -translate-x-1/2 -translate-y-1/2 transition-transform hover:rotate-90 origin-bottom"></div>
                                            </div>
                                            <h3 class="text-white font-heavy-title text-3xl rotate-90 tracking-widest uppercase mt-16">REVENUE</h3>
                                        </div>
                                    </div>
                                `;
                    }
                    // Slide: Vision
                    else if (data.title.includes('VISION')) {
                        return `
                                    <div class="w-full h-full flex border-[4px] border-black">
                                        <!-- Left (ROI Stair Graph) -->
                                        <div class="w-1/2 bg-white h-full p-8 relative flex flex-col justify-end">
                                            <h3 class="font-heavy-title border-b-[4px] border-black pb-2 mb-auto text-2xl uppercase">Return on Investment</h3>
                                            
                                            <!-- Blocky CSS Staircase -->
                                            <div class="w-full h-64 flex items-end">
                                                <div class="w-1/3 h-1/3 bg-gray-200 border-t-[4px] border-r-[4px] border-black relative">
                                                    <span class="absolute -top-6 left-1 text-xs font-bold font-mono-data">Setup</span>
                                                </div>
                                                <div class="w-1/3 h-2/3 bg-gray-300 border-t-[4px] border-r-[4px] border-l-[4px] border-black relative">
                                                    <span class="absolute -top-6 left-1 text-xs font-bold font-mono-data">Optimization</span>
                                                </div>
                                                <div class="w-1/3 h-full bg-[#F8F32B] border-t-[4px] border-l-[4px] border-black relative shadow-[-8px_0_0_0_#000] z-10">
                                                    <span class="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-heavy-title bg-black text-white px-2 py-1">FOCUS ON PLAY</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Right (Scalability Consoles) -->
                                        <div class="w-1/2 bg-black h-full p-8 text-white flex flex-col justify-center items-center gap-8 border-l-[4px] border-black overflow-hidden relative">
                                            <h3 class="font-heavy-title text-[#F8F32B] text-2xl uppercase absolute top-8 left-8">Scalability</h3>
                                            
                                            <!-- Blocky Console Metaphor -->
                                            <div class="w-48 h-16 bg-white border-[4px] border-[#F8F32B] flex justify-between px-4 items-center mt-12">
                                                <div class="w-6 h-6 bg-black flex flex-wrap gap-0.5 p-0.5"><div class="w-2 h-2 bg-white"></div><div class="w-2 h-2 bg-white"></div><div class="w-2 h-2 bg-white"></div><div class="w-2 h-2 bg-white"></div></div>
                                                <span class="text-black font-heavy-title">CONSOLE</span>
                                                <div class="w-6 h-6 rounded-none bg-black"></div>
                                            </div>

                                            <div class="w-8 h-[4px] bg-dashed border-l-[4px] border-white"></div>

                                            <!-- Blocky Mobile Metaphor -->
                                            <div class="w-24 h-40 bg-white border-[4px] border-[#F8F32B] flex flex-col p-2 shadow-[8px_8px_0_0_#F8F32B]">
                                                <div class="flex-1 bg-black w-full mb-2"></div>
                                                <div class="w-4 h-4 bg-black rounded-none mx-auto"></div>
                                            </div>
                                            <p class="font-mono-data text-xs mt-2 text-center text-gray-400">Cross-Platform Sync &<br/>Mobile Companion App</p>
                                        </div>
                                    </div>
                                `;
                    }

                    // [Fallback Architecture] Array iteration rendering for non-specialized slides (e.g., BACKGROUND).
                    return `
                                <div class="w-full h-full flex flex-col justify-center p-12">
                                    <div class="grid grid-cols-${data.cards?.length || 1} gap-10 w-full">
                                        ${data.cards ? data.cards.map(card => `
                                            <div class="flex-1 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_#000] flex flex-col transition-transform hover:-translate-y-1">
                                                <h3 class="font-heavy-title text-2xl border-b-[4px] border-black pb-4 mb-6 flex items-center gap-4 uppercase break-keep">
                                                    <i data-lucide="${card.icon || 'check-circle'}" class="w-8 h-8 text-black" style="stroke-width: 3px;"></i>
                                                    ${card.title}
                                                </h3>
                                                <p class="font-mono-data font-bold text-lg leading-relaxed text-gray-800 break-keep">
                                                    ${card.content}
                                                </p>
                                            </div>
                                        `).join('') : `
                                            <div class="flex-1 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_0_#000]">
                                                <h3 class="font-heavy-title text-2xl border-b-[4px] border-black pb-2 mb-4">CONTENT STRUCTURE</h3>
                                                <p class="font-mono-data text-lg">No card data found.</p>
                                            </div>
                                        `}
                                    </div>
                                </div>
                            `;
                })()}
                    </div>
                </div>
            `);
        }
        else if (data.type === 'mockup_slide') {
            let featuresHtml = '';
            let mockupInnerHtml = '';

            // [UI Architecture] Ditch browser wrapper, implement React JSX Layout (Sidebar + Main)
            if (data.mockupType === 'dashboard') {
                featuresHtml = `
                    <div class="mt-auto mb-8 flex flex-col gap-4">
                        <div class="bg-black text-white border-[3px] border-white p-3 font-mono-data text-sm font-bold shadow-[4px_4px_0_0_#F8F32B]">Data Aggregation</div>
                        <div class="bg-black text-white border-[3px] border-white p-3 font-mono-data text-sm font-bold shadow-[4px_4px_0_0_#F8F32B]">Achievement Tracking</div>
                    </div>
                `;
                mockupInnerHtml = `
                    <div class="w-full h-full flex bg-white text-black font-sans selection:bg-[#F8F32B]">
                        <!-- Sidebar Navigation -->
                        <aside class="w-48 border-r-4 border-black flex flex-col bg-white shrink-0">
                            <div class="p-4 flex items-center gap-2 border-b-4 border-black">
                                <div class="bg-black p-1"><i data-lucide="zap" class="text-[#F8F32B] w-5 h-5"></i></div>
                                <span class="font-black text-lg tracking-tighter uppercase italic">NEXUSPLAY</span>
                            </div>
                            <nav class="flex-1 p-2 space-y-2 mt-4">
                                <div class="flex items-center gap-3 p-3 opacity-40"><i data-lucide="home" class="w-5 h-5"></i><span class="text-[10px] font-black uppercase tracking-widest">Overview</span></div>
                                <div class="flex items-center gap-3 p-3 bg-[#F8F32B] border-2 border-black shadow-[2px_2px_0_0_#000]"><i data-lucide="layout-dashboard" class="w-5 h-5"></i><span class="text-[10px] font-black uppercase tracking-widest">Library</span></div>
                                <div class="flex items-center gap-3 p-3 opacity-40"><i data-lucide="settings" class="w-5 h-5"></i><span class="text-[10px] font-black uppercase tracking-widest">Optimize</span></div>
                            </nav>
                            <div class="p-4 mt-auto">
                                <div class="flex items-center gap-3 p-2 border-2 border-black">
                                    <div class="w-8 h-8 bg-black text-[#F8F32B] flex items-center justify-center font-black"><i data-lucide="user" class="w-4 h-4"></i></div>
                                    <div class="overflow-hidden">
                                        <p class="text-[10px] font-black truncate uppercase">PRO_GAMER_KR</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <!-- Main Content: Dashboard -->
                        <main class="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                            <header class="h-14 border-b-4 border-black bg-white flex items-center justify-between px-6 shrink-0">
                                <h2 class="text-sm font-black tracking-tighter uppercase italic">Analytics Dashboard</h2>
                                <div class="flex items-center gap-2 text-[10px] font-black"><div class="w-2 h-2 bg-black animate-pulse"></div>API SYNC: ONLINE</div>
                            </header>
                            
                            <div class="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
                                <div class="grid grid-cols-3 gap-4 shrink-0">
                                    <div class="border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                                        <p class="text-[8px] font-black opacity-50 uppercase tracking-widest">TOTAL PLAYTIME</p>
                                        <h3 class="text-xl font-black italic mt-1">2,482H</h3>
                                    </div>
                                    <div class="border-4 border-black bg-[#F8F32B] p-4 shadow-[4px_4px_0_0_#000]">
                                        <p class="text-[8px] font-black opacity-50 uppercase tracking-widest">AVG. COMPLETION</p>
                                        <h3 class="text-xl font-black italic mt-1">68.4%</h3>
                                    </div>
                                    <div class="border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
                                        <p class="text-[8px] font-black opacity-50 uppercase tracking-widest">ASSETS</p>
                                        <h3 class="text-xl font-black italic mt-1">156 UNIT</h3>
                                    </div>
                                </div>

                                <div class="border-4 border-black bg-white shadow-[6px_6px_0_0_#000] p-5 flex-1 flex flex-col">
                                    <h4 class="font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-tighter italic border-b-2 border-black pb-2">
                                        <i data-lucide="trophy" class="w-4 h-4 text-black"></i> ACHIEVEMENT TRACKER
                                    </h4>
                                    <div class="border-2 border-black p-3 flex gap-4 bg-white shadow-[4px_4px_0_0_#000]">
                                        <div class="w-12 h-12 bg-gray-200 border-2 border-black flex items-center justify-center shrink-0">
                                            <i data-lucide="image" class="w-5 h-5 text-gray-400"></i>
                                        </div>
                                        <div class="flex-1">
                                            <h5 class="font-black text-xs uppercase">Cyberpunk 2077</h5>
                                            <p class="text-[8px] font-bold opacity-60 uppercase mb-2">Playtime: 124h</p>
                                            <div class="w-full h-2 bg-gray-200 border border-black relative">
                                                <div class="absolute top-0 left-0 h-full bg-[#F8F32B] border-r border-black w-[86%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                `;
            } else if (data.mockupType === 'optimizer') {
                featuresHtml = `
                    <div class="mt-auto mb-8 flex flex-col gap-4">
                        <div class="bg-black text-[#F8F32B] border-[3px] border-black p-3 font-heavy-title text-sm shadow-[4px_4px_0_0_#F8F32B]">
                            [!] SYSTEM OVERRIDE BYPASS
                            <p class="text-[10px] font-mono-data text-white font-bold mt-2 tracking-tight">웹 샌드박스 정책 우회 기술 적용 콘솔 명령 스니펫 제공.</p>
                        </div>
                    </div>
                `;
                mockupInnerHtml = `
                    <div class="w-full h-full flex bg-white text-black font-sans selection:bg-[#F8F32B]">
                        <!-- Sidebar Navigation -->
                        <aside class="w-48 border-r-4 border-black flex flex-col bg-white shrink-0">
                            <div class="p-4 flex items-center gap-2 border-b-4 border-black">
                                <div class="bg-black p-1"><i data-lucide="zap" class="text-[#F8F32B] w-5 h-5"></i></div>
                                <span class="font-black text-lg tracking-tighter uppercase italic">NEXUSPLAY</span>
                            </div>
                            <nav class="flex-1 p-2 space-y-2 mt-4">
                                <div class="flex items-center gap-3 p-3 opacity-40"><i data-lucide="home" class="w-5 h-5"></i><span class="text-[10px] font-black uppercase tracking-widest">Overview</span></div>
                                <div class="flex items-center gap-3 p-3 opacity-40"><i data-lucide="layout-dashboard" class="w-5 h-5"></i><span class="text-[10px] font-black uppercase tracking-widest">Library</span></div>
                                <div class="flex items-center gap-3 p-3 bg-[#F8F32B] border-2 border-black shadow-[2px_2px_0_0_#000]"><i data-lucide="settings" class="w-5 h-5"></i><span class="text-[10px] font-black uppercase tracking-widest">Optimize</span></div>
                            </nav>
                            <div class="p-4 mt-auto">
                                <div class="flex items-center gap-3 p-2 border-2 border-black">
                                    <div class="w-8 h-8 bg-black text-[#F8F32B] flex items-center justify-center font-black"><i data-lucide="user" class="w-4 h-4"></i></div>
                                    <div class="overflow-hidden">
                                        <p class="text-[10px] font-black truncate uppercase">PRO_GAMER_KR</p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <!-- Main Content: Optimizer -->
                        <main class="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                            <header class="h-14 border-b-4 border-black bg-white flex items-center justify-between px-6 shrink-0">
                                <h2 class="text-sm font-black tracking-tighter uppercase italic">Optimization Hub</h2>
                                <div class="flex items-center gap-2 text-[10px] font-black"><div class="w-2 h-2 bg-black animate-pulse"></div>API SYNC: ONLINE</div>
                            </header>
                            
                            <div class="p-6 flex-1 flex gap-6 overflow-hidden">
                                <div class="w-[40%] bg-black text-white p-5 border-4 border-black shadow-[6px_6px_0_0_#F8F32B] flex flex-col gap-5">
                                    <h3 class="text-[#F8F32B] text-[10px] font-black tracking-widest uppercase border-b-2 border-gray-800 pb-2">TARGET DEVICE PROFILE</h3>
                                    <div class="flex gap-3 items-center">
                                        <i data-lucide="cpu" class="w-5 h-5 opacity-50 shrink-0"></i>
                                        <div class="overflow-hidden"><p class="text-[8px] opacity-50 font-black tracking-widest">CPU</p><p class="text-xs font-black italic truncate">Ryzen 9 7950X3D</p></div>
                                    </div>
                                    <div class="flex gap-3 items-center">
                                        <i data-lucide="monitor" class="w-5 h-5 opacity-50 shrink-0"></i>
                                        <div class="overflow-hidden"><p class="text-[8px] opacity-50 font-black tracking-widest">GPU</p><p class="text-xs font-black italic truncate">RTX 4080 SUP</p></div>
                                    </div>
                                    <div class="flex gap-3 items-center">
                                        <i data-lucide="activity" class="w-5 h-5 opacity-50 shrink-0"></i>
                                        <div class="overflow-hidden"><p class="text-[8px] opacity-50 font-black tracking-widest">RAM</p><p class="text-xs font-black italic truncate">DDR5 6000 32GB</p></div>
                                    </div>
                                </div>

                                <div class="flex-1 flex flex-col bg-white border-4 border-black shadow-[6px_6px_0_0_#000]">
                                    <div class="p-4 border-b-4 border-black flex justify-between items-center bg-white shrink-0">
                                        <div>
                                            <h4 class="font-black text-lg uppercase italic flex items-center gap-2"><i data-lucide="shield-check" class="w-5 h-5 text-black"></i> Cyberpunk 2077</h4>
                                            <p class="text-[8px] font-bold opacity-60 uppercase mt-1">Matched via: CPU+GPU (98%)</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-[8px] font-black opacity-40 uppercase">Target FPS</p>
                                            <h3 class="text-2xl font-black italic text-black">118</h3>
                                        </div>
                                    </div>
                                    
                                    <div class="p-5 flex-1 flex flex-col justify-end gap-4 bg-gray-50">
                                        <div class="grid grid-cols-2 gap-3 mb-2">
                                            <div class="bg-black text-white p-3">
                                                <p class="text-[8px] font-bold opacity-50 uppercase border-b border-gray-700 pb-1 mb-1">Preset</p>
                                                <p class="text-xs font-black text-[#F8F32B]">RT OVERDRIVE</p>
                                            </div>
                                            <div class="bg-black text-white p-3">
                                                <p class="text-[8px] font-bold opacity-50 uppercase border-b border-gray-700 pb-1 mb-1">Upscaling</p>
                                                <p class="text-xs font-black text-[#F8F32B]">DLSS 3 FRAME GEN</p>
                                            </div>
                                        </div>
                                        <button class="w-full bg-[#F8F32B] text-black border-4 border-black py-3 font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-[#F8F32B] transition-colors">
                                            <i data-lucide="copy" class="w-4 h-4"></i> COPY CONSOLE SCRIPT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                `;
            }

            // [Layout Reset] Replaced overlapping Mockup Frame, explicit removal of bg-grid from right panel
            createSlide(globalSlideIndex++, `
                <div class="w-full h-full flex relative animate-in fade-in duration-300 bg-white">
                    <!-- Left Sidebar (Presentation Data) -->
                    <div class="w-[25%] bg-white h-full border-r-[8px] border-black flex flex-col px-10 py-16 z-20 shadow-[8px_0px_0px_rgba(0,0,0,1)]">
                        <div class="w-16 h-16 bg-[#F8F32B] border-[4px] border-black flex items-center justify-center font-heavy-title text-2xl mb-8 shadow-[6px_6px_0_0_#000]">
                            <i data-lucide="${data.icon || 'mouse-pointer'}" class="w-8 h-8 text-black" style="stroke-width: 3px;"></i>
                        </div>
                        <h2 class="text-4xl text-black font-heavy-title uppercase break-keep leading-tight mb-4 border-b-[4px] border-black pb-4">${data.title}</h2>
                        <p class="font-bold text-gray-700 text-lg break-keep">${data.topic}</p>
                        ${featuresHtml}
                    </div>

                    <!-- Right Mockup Container -->
                    <div class="w-[75%] h-full p-12 flex items-center justify-center relative bg-white">
                        <div class="w-full h-[90%] border-[6px] border-black shadow-[20px_20px_0_0_#000] flex flex-col bg-white z-10 overflow-hidden">
                            ${mockupInnerHtml}
                        </div>
                    </div>
                </div>
            `);
        }
        else if (data.type === 'timeline_slide') {
            createSlide(globalSlideIndex++, `
                <div class="w-full h-full flex flex-col items-center bg-white p-12">
                    <h2 class="font-heavy-title text-5xl uppercase border-[4px] border-black px-6 py-4 bg-[#F8F32B] shadow-[8px_8px_0_0_#000] mb-12 self-start">${data.title}</h2>
                    
                    <div class="w-full max-w-[1200px] h-[60vh] bg-grid border-[4px] border-black flex flex-col relative shadow-[16px_16px_0_0_#000] bg-white">
                        
                        <!-- Header 14 weeks X Axis -->
                        <div class="h-12 border-b-[8px] border-black flex items-center bg-gray-100 font-mono-data text-xs font-bold divide-x-[3px] divide-black">
                            <div class="w-48 text-center bg-white h-full leading-[44px]">PHASE</div>
                            ${[...Array(14)].map((_, i) => `<div class="flex-1 text-center h-full flex items-center justify-center">W${i + 1}</div>`).join('')}
                        </div>

                        <!-- Rows -->
                        ${data.events.map((ev, i) => {
                let wSpan, wStart, colorClass, isMilestone, markerStr;
                if (i === 0) { wStart = 1; wSpan = 4; colorClass = 'bg-black text-white'; } // 1~4
                if (i === 1) { wStart = 5; wSpan = 4; colorClass = 'bg-black text-white'; isMilestone = true; markerStr = 'w-[8]'; } // 5~8
                if (i === 2) { wStart = 9; wSpan = 3; colorClass = 'bg-[#F8F32B] text-black border-[3px] border-black'; isMilestone = true; } // 9~11
                if (i === 3) { wStart = 12; wSpan = 3; colorClass = 'bg-white text-black border-[3px] border-black border-dashed'; } // 12~14

                let milestoneLine = '';
                if (isMilestone) {
                    milestoneLine = `
                                    <div class="absolute top-0 bottom-0 w-[4px] bg-red-600 z-0" style="left: calc(12rem + ((100% - 12rem) / 14) * ${wStart + wSpan - 1});">
                                        <div class="w-6 h-6 bg-red-600 rotate-45 absolute -top-3 -translate-x-1/2 left-[2px] border-[2px] border-black"></div>
                                    </div>
                                `;
                }

                return `
                                <div class="flex-1 border-b-[3px] border-black flex items-center relative group bg-white/50 hover:bg-white transition-colors">
                                    <div class="w-48 h-full border-r-[4px] border-black flex flex-col justify-center px-4 bg-white z-10">
                                        <h4 class="font-heavy-title text-sm uppercase">${ev.title}</h4>
                                        <p class="text-[10px] font-bold text-gray-500 font-mono-data leading-tight mt-1 truncate">${ev.desc}</p>
                                    </div>
                                    <!-- Gantt Bar Region -->
                                    <div class="flex-1 h-full relative py-4 z-10">
                                        <div class="absolute h-10 top-1/2 -translate-y-1/2 ${colorClass} flex items-center justify-center font-heavy-title text-sm tracking-widest uppercase shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] transition-transform group-hover:scale-[1.02]"
                                             style="left: calc(((100%) / 14) * ${wStart - 1} + 8px); width: calc(((100%) / 14) * ${wSpan} - 16px);">
                                            ${ev.title.split(' ')[0]}
                                        </div>
                                    </div>
                                    ${milestoneLine}
                                </div>
                            `
            }).join('')}
                    </div>
                </div>
            `);
        }
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
    updateSlideState();
}

function createSlide(index, html) {
    const div = document.createElement('div');
    div.className = 'slide';
    div.dataset.index = index;
    div.innerHTML = html;
    container.appendChild(div);
}

function updateSlideState() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
            slide.classList.add('active');
            slide.style.display = 'flex';
        } else {
            slide.classList.remove('active');
            slide.style.display = 'none';
        }
    });
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    if (slideIndex >= 0 && slideIndex < slides.length) {
        currentSlide = slideIndex;
        updateSlideState();
    }
}

function adjustFontSize(delta) {
    if (delta === 0) {
        currentFontSize = DEFAULT_FONT_SIZE;
    } else {
        currentFontSize += delta;
        if (currentFontSize < 10) currentFontSize = 10;
        if (currentFontSize > 32) currentFontSize = 32;
    }
    document.documentElement.style.fontSize = `${currentFontSize}px`;
}

const goNext = () => {
    if (currentSlide < document.querySelectorAll('.slide').length - 1) {
        currentSlide++;
        updateSlideState();
    }
};

const goPrev = () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlideState();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderSlides();

    document.addEventListener('keydown', e => {
        if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
            e.preventDefault(); goNext();
        }
        if (['ArrowLeft', 'PageUp'].includes(e.key)) {
            e.preventDefault(); goPrev();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault(); adjustFontSize(1);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault(); adjustFontSize(-1);
        }
        if (e.key === 'Home') { currentSlide = 0; updateSlideState(); }
        if (e.key === 'End') { currentSlide = document.querySelectorAll('.slide').length - 1; updateSlideState(); }
    });

    document.getElementById('nav-left').addEventListener('click', goPrev);
    document.getElementById('nav-right').addEventListener('click', goNext);

    const btnDecrease = document.getElementById('btn-decrease');
    const btnReset = document.getElementById('btn-reset');
    const btnIncrease = document.getElementById('btn-increase');

    if (btnDecrease) btnDecrease.addEventListener('click', () => adjustFontSize(-1));
    if (btnReset) btnReset.addEventListener('click', () => adjustFontSize(0));
    if (btnIncrease) btnIncrease.addEventListener('click', () => adjustFontSize(1));
});