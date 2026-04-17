// 하드코딩된 게임 최적화 데이터베이스
const gamesDB = {
    "사이버펑크 2077": {
        fps: "68",
        lowFps: "49 fps",
        settings: [
            { name: "해상도", value: "1920x1080 (FHD)", class: "" },
            { name: "DLSS / FSR", value: "균형 (Balanced)", class: "med" },
            { name: "텍스처 품질", value: "높음", class: "high" },
            { name: "그림자 품질", value: "중간", class: "med" },
            { name: "볼류메트릭 포그", value: "낮음", class: "low" },
            { name: "레이 트레이싱", value: "끄기", class: "low" },
            { name: "군중 밀도", value: "높음", class: "high" }
        ]
    },
    "발로란트": {
        fps: "240+",
        lowFps: "180 fps",
        settings: [
            { name: "해상도", value: "1920x1080 (FHD)", class: "" },
            { name: "NVIDIA Reflex", value: "켜기 + 부스트", class: "high" },
            { name: "안티앨리어싱", value: "MSAA 4x", class: "high" },
            { name: "머티리얼 품질", value: "높음", class: "high" },
            { name: "디테일 품질", value: "높음", class: "high" }
        ]
    },
    "디아블로 4": {
        fps: "110",
        lowFps: "85 fps",
        settings: [
            { name: "해상도", value: "1920x1080 (FHD)", class: "" },
            { name: "DLSS", value: "품질 (Quality)", class: "high" },
            { name: "텍스처", value: "높음 (High)", class: "high" },
            { name: "그림자", value: "중간", class: "med" },
            { name: "클러터 품질", value: "중간", class: "med" }
        ]
    }
};

function startAnalysis() {
    const gameInput = document.getElementById('game-search').value.trim();
    const btn = document.getElementById('analyze-btn');

    // 1. 상황 대응: 빈 값 검증
    if (!gameInput) {
        alert("최적화할 게임 이름을 입력해주세요.");
        document.getElementById('game-search').focus();
        return;
    }

    const resultSection = document.getElementById('result-section');
    const loader = document.getElementById('loader');
    const progressText = document.getElementById('progress-text');
    const b2bAd = document.getElementById('b2b-ad');
    const errorMsg = document.getElementById('error-message');
    
    // UI 초기화 및 버튼 비활성화 (이중 클릭 방지)
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 분석 중...';
    btn.style.opacity = '0.7';
    btn.style.cursor = 'not-allowed';

    resultSection.classList.remove('visible');
    b2bAd.style.display = 'none';
    if(errorMsg) errorMsg.style.display = 'none';

    setTimeout(() => {
        resultSection.style.display = 'none';
        loader.style.display = 'block';
        progressText.innerText = '0%';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 10;
            if(progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressText.innerText = progress + '%';
        }, 200);

    }, 300);

    // 가짜 딜레이 (분석하는 척)
    setTimeout(() => {
        loader.style.display = 'none';
        
        // 버튼 상태 롤백
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-bolt"></i> 최적화 설정 매칭';
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';

        displayResults(gameInput);
    }, 1500);
}

function displayResults(gameQuery) {
    const resultSection = document.getElementById('result-section');
    const nameEl = document.getElementById('res-game-name');
    const fpsEl = document.getElementById('res-fps');
    const lowFpsEl = document.getElementById('res-low-fps');
    const settingsEl = document.getElementById('res-settings');
    const b2bAd = document.getElementById('b2b-ad');
    const lowValEl = document.getElementById('res-low-val');
    const errorMsg = document.getElementById('error-message');
    
    // 데이터 매칭 (대소문자/공백 무시 대략적 검색 처리)
    let matchedGame = null;
    let displayTitle = gameQuery;

    if (gameQuery) {
        for(let key in gamesDB) {
            if(key.toLowerCase().includes(gameQuery.toLowerCase()) || gameQuery.toLowerCase().includes(key.toLowerCase())) {
                matchedGame = gamesDB[key];
                displayTitle = key;
                break;
            }
        }
    }

    // 2. 상황 대응: 검색 실패 시 에러 처리
    if (!matchedGame) {
        if(errorMsg) {
            errorMsg.innerHTML = `<h3 style="margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-exclamation"></i> 검색 실패</h3><p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;"><strong>'${gameQuery}'</strong> 에 대한 최적화 데이터를 찾을 수 없습니다.<br>현재 사이버펑크 2077, 발로란트, 디아블로 4만 시범 지원됩니다.</p>`;
            errorMsg.style.display = 'block';
            
            // 결과창은 숨김 유지, 애니메이션 트리거 적용 위해 opacity 등 처리
            errorMsg.style.opacity = 0;
            errorMsg.style.transform = 'translateY(-10px)';
            errorMsg.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                errorMsg.style.opacity = 1;
                errorMsg.style.transform = 'translateY(0)';
            }, 50);
        }
        return; // 렌더링 중단
    }

    // UI 렌더링
    nameEl.textContent = displayTitle;
    fpsEl.innerHTML = `${matchedGame.fps}<span style="font-size: 1rem; color: #fff;">fps</span>`;
    
    // Split lowFps text to get the actual value vs the label
    const lowFpsParts = matchedGame.lowFps.split(' ');
    if(lowValEl) lowValEl.innerHTML = `${lowFpsParts[0]}<span style="font-size: 1rem; color: #fff;">${lowFpsParts.slice(1).join(' ')}</span>`;
    lowFpsEl.textContent = "방어 가능";
    
    settingsEl.innerHTML = '';
    matchedGame.settings.forEach(setting => {
        let iconHtml = '';
        if (setting.class === 'high') {
            iconHtml = '<i class="fa-solid fa-arrow-up"></i>';
        } else if (setting.class === 'med') {
            iconHtml = '<i class="fa-solid fa-minus"></i>';
        } else if (setting.class === 'low') {
            iconHtml = '<i class="fa-solid fa-arrow-down"></i>';
        } else if (setting.name === '해상도') {
            iconHtml = '<i class="fa-solid fa-display"></i>';
        }

        settingsEl.innerHTML += `
            <div class="setting-item">
                <span class="setting-name">${setting.name}</span>
                <span class="setting-value ${setting.class}">${iconHtml} ${setting.value}</span>
            </div>
        `;
    });

    // B2B Ad Logic (If fps is below 80, show upgrade recommend)
    const fpsVal = parseInt(matchedGame.fps);
    if (!isNaN(fpsVal) && fpsVal < 80) {
        b2bAd.style.display = 'block';
    }

    // 결과 표시 애니메이션
    resultSection.style.display = 'block';
    void resultSection.offsetWidth;
    resultSection.classList.add('visible');
}

// 엔터키 지원
document.getElementById('game-search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        startAnalysis();
    }
});

// Tab Switching Logic
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding tab content
        const targetTab = button.getAttribute('data-tab');
        document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
});

// 커뮤니티 탭: 프로파일 로드 버튼 상호작용
function loadProfile(btn, userName) {
    if(btn.disabled) return;

    const originalText = btn.innerHTML;
    // 1. 로딩 상태
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 로딩 중...';
    
    // 2. 가짜 통신 구현 (상황 대응)
    setTimeout(() => {
        // 성공 상태 피드백
        btn.innerHTML = '<i class="fa-solid fa-check"></i> 적용 완료';
        btn.style.background = 'var(--primary)';
        btn.style.color = '#000';
        
        alert(`[${userName}]님의 최적화 프로파일을 내 설정으로 성공적으로 가져왔습니다.`);
        
        // 3초 후 원상복구 (재사용 편의성)
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.style.background = ''; 
            btn.style.color = '';
            btn.style.opacity = '1';
        }, 3000);
    }, 1200);
}

// 랜딩 페이지 진입 모달
function enterDashboard() {
    const modal = document.getElementById('landing-modal');
    const btn = modal.querySelector('button');
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 인증 중...';
    btn.style.background = 'var(--accent-purple)';
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 800);
}
