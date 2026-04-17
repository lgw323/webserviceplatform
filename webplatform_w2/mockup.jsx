import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Cpu,
    Gamepad2,
    Settings,
    ShieldCheck,
    Zap,
    Monitor,
    Activity,
    User,
    ExternalLink,
    Crown,
    Trophy,
    Copy,
    CheckCircle2,
    Home,
    Image as ImageIcon,
    Globe,
    RefreshCw
} from 'lucide-react';

const App = () => {
    // View Routing State: 'home' | 'dashboard' | 'optimize'
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Design System Tokens
    const COLORS = {
        yellow: "#F8F32B",
        white: "#FFFFFF",
        black: "#000000",
        gray: "#F3F4F6"
    };

    // User Hardware Specifications
    const userSpecs = {
        cpu: "AMD Ryzen 9 7950X3D",
        gpu: "ASUS TUF Gaming RTX 4080 SUPER",
        mb: "ASUS TUF X670E-PLUS WIFI",
        ram: "DDR5 6000 32GB",
        monitor: "LG 27GP850 (QHD 165Hz)"
    };

    // Normalized Game Data Entity (Image URLs removed for Wireframe integrity)
    const gameLibrary = [
        {
            id: 1,
            title: "Cyberpunk 2077",
            playtime: "124h",
            achievements: { total: 44, unlocked: 38 },
            status: "Optimized",
            targetFps: 118
        },
        {
            id: 2,
            title: "Elden Ring",
            playtime: "210h",
            achievements: { total: 42, unlocked: 42 },
            status: "Update Needed",
            targetFps: 60
        },
        {
            id: 3,
            title: "Red Dead Redemption 2",
            playtime: "86h",
            achievements: { total: 52, unlocked: 12 },
            status: "Optimized",
            targetFps: 95
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCopyScript = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: COLORS.white }} className="flex items-center justify-center min-h-screen">
                <div style={{ borderColor: COLORS.black }} className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: COLORS.white, color: COLORS.black }} className="flex min-h-screen font-sans selection:bg-[#F8F32B]">
            {/* Sidebar Navigation */}
            <aside style={{ backgroundColor: COLORS.white }} className="w-20 lg:w-64 border-r-2 border-black flex flex-col transition-all">
                <div className="p-6 flex items-center gap-3">
                    <div style={{ backgroundColor: COLORS.black }} className="p-2 rounded-none">
                        <Zap style={{ color: COLORS.yellow }} className="fill-current w-6 h-6" />
                    </div>
                    <span className="hidden lg:block font-black text-2xl tracking-tighter uppercase italic">NEXUSPLAY</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1">
                    <NavItem colors={COLORS} active={activeTab === 'home'} icon={<Home size={22} />} label="OVERVIEW" onClick={() => setActiveTab('home')} />
                    <NavItem colors={COLORS} active={activeTab === 'dashboard'} icon={<LayoutDashboard size={22} />} label="LIBRARY & STATS" onClick={() => setActiveTab('dashboard')} />
                    <NavItem colors={COLORS} active={activeTab === 'optimize'} icon={<Settings size={22} />} label="OPTIMIZATION HUB" onClick={() => setActiveTab('optimize')} />
                    <NavItem colors={COLORS} active={activeTab === 'hardware'} icon={<Cpu size={22} />} label="DEVICE PROFILE" onClick={() => setActiveTab('hardware')} />
                </nav>

                <div className="p-4 space-y-4">
                    <div style={{ backgroundColor: COLORS.yellow }} className="p-4 border-2 border-black shadow-[4px_4px_0px_#000000] hidden lg:block">
                        <p className="text-[10px] font-black mb-1 flex items-center gap-1 uppercase tracking-widest">
                            <Crown size={12} /> PREMIUM ACTIVE
                        </p>
                        <p className="text-[11px] font-bold leading-tight">B2C SUBSCRIPTION VALID</p>
                    </div>
                    <div className="flex items-center gap-3 p-2 border-2 border-transparent hover:border-black transition-all cursor-pointer">
                        <div style={{ backgroundColor: COLORS.black, color: COLORS.yellow }} className="w-10 h-10 flex items-center justify-center font-black text-sm">
                            <User size={18} />
                        </div>
                        <div className="hidden lg:block overflow-hidden">
                            <p className="text-xs font-black truncate uppercase">PRO_GAMER_KR</p>
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">Verified System</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header style={{ backgroundColor: COLORS.white }} className="h-20 border-b-2 border-black flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-xl font-black tracking-tighter uppercase italic">
                        {activeTab === 'home' && 'Platform Overview'}
                        {activeTab === 'dashboard' && 'Analytics Dashboard'}
                        {activeTab === 'optimize' && 'Optimization & Matching Hub'}
                    </h2>
                    <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div style={{ backgroundColor: COLORS.black }} className="w-2 h-2 rounded-none animate-pulse"></div>
                            <span>API SYNC: ONLINE</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-12">

                    {/* VIEW: Home (Platform Landing & Overview) */}
                    {activeTab === 'home' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* System Greeting */}
                            <div style={{ backgroundColor: COLORS.black, color: COLORS.white }} className="p-8 border-2 border-black shadow-[8px_8px_0px_#F8F32B]">
                                <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">SYSTEM ONLINE</h1>
                                <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-6">ALL EXTERNAL API NODES CONNECTED</p>

                                <div className="flex gap-4">
                                    <button style={{ backgroundColor: COLORS.yellow, color: COLORS.black }} className="px-6 py-3 font-black text-sm uppercase flex items-center gap-2 border-2 border-transparent hover:border-white transition-all">
                                        <RefreshCw size={16} /> SYNC NEW DATA
                                    </button>
                                    <button className="px-6 py-3 font-black text-sm uppercase flex items-center gap-2 border-2 border-white hover:bg-white hover:text-black transition-all">
                                        RUN BENCHMARK
                                    </button>
                                </div>
                            </div>

                            {/* Quick Global Metrics */}
                            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard colors={COLORS} title="LINKED PLATFORMS" value="3" detail="STEAM / EPIC / RIOT" />
                                <StatCard colors={COLORS} title="PROFILE MATCHES" value="1,402" detail="LAST 24 HOURS" />
                                <StatCard colors={COLORS} title="GLOBAL USERS" value="84.2K" detail="ACTIVE DATABASE" />
                                <StatCard colors={COLORS} title="SYSTEM HEALTH" value="99.9%" detail="LATENCY: 12MS" highlight />
                            </section>

                            {/* Recent Platform Activity */}
                            <section className="space-y-6">
                                <div className="border-b-4 border-black pb-2 flex justify-between items-end">
                                    <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 italic">
                                        <Globe size={24} /> PLATFORM ACTIVITY LOG
                                    </h3>
                                </div>
                                <div className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000] p-6 space-y-4">
                                    {[
                                        { time: "2 MIN AGO", action: "PROFILE UPLOADED", target: "CYBERPUNK 2077 (RTX 4090)" },
                                        { time: "15 MIN AGO", action: "SYSTEM VERIFIED", target: "RYZEN 7800X3D BUILD" },
                                        { time: "1 HOUR AGO", action: "API BATCH SYNC", target: "12,400 STEAM LIBRARIES" }
                                    ].map((log, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black w-24 opacity-50">{log.time}</span>
                                                <span className="text-sm font-bold uppercase">{log.action}</span>
                                            </div>
                                            <span className="text-sm font-black italic">{log.target}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* VIEW: Dashboard (Library & Achievements) */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard colors={COLORS} title="TOTAL PLAYTIME" value="2,482H" detail="STEAM / EPIC / RIOT" />
                                <StatCard colors={COLORS} title="AVG. COMPLETION" value="68.4%" detail="GLOBAL TOP 12%" highlight />
                                <StatCard colors={COLORS} title="INTEGRATED ASSETS" value="156 UNIT" detail="VERIFIED LICENSES" />
                            </section>

                            <section className="space-y-6">
                                <div className="border-b-4 border-black pb-2 flex justify-between items-end">
                                    <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 italic">
                                        <Trophy size={24} /> ACHIEVEMENT TRACKER
                                    </h3>
                                    <span className="text-[10px] font-black opacity-40 uppercase">Sort by: Playtime</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {gameLibrary.map(game => {
                                        const progress = Math.round((game.achievements.unlocked / game.achievements.total) * 100);
                                        return (
                                            <div key={game.id} className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000000] hover:-translate-y-1 transition-transform">
                                                <div className="flex items-start gap-4 mb-4">
                                                    {/* Replaced external image with Wireframe Placeholder */}
                                                    <div className="w-16 h-16 bg-gray-200 border-2 border-black flex items-center justify-center shrink-0">
                                                        <ImageIcon size={24} className="text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black text-sm uppercase truncate">{game.title}</h4>
                                                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter mb-2">Playtime: {game.playtime}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Trophy size={14} className={progress === 100 ? "text-[#F8F32B] fill-current" : "text-black"} />
                                                            <span className="text-xs font-black">{game.achievements.unlocked} / {game.achievements.total}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Progress Bar UI */}
                                                <div className="w-full h-3 bg-gray-200 border border-black overflow-hidden relative">
                                                    <div
                                                        style={{ backgroundColor: progress === 100 ? COLORS.yellow : COLORS.black, width: `${progress}%` }}
                                                        className="h-full border-r border-black"
                                                    />
                                                </div>
                                                <div className="text-right mt-1">
                                                    <span className="text-[10px] font-black italic">{progress}% COMPLETION</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* VIEW: Optimization Hub (Hardware Matching & Expected FPS) */}
                    {activeTab === 'optimize' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                                {/* User Hardware Context */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div style={{ backgroundColor: COLORS.black, color: COLORS.white }} className="p-6 border-2 border-black shadow-[8px_8px_0px_#F8F32B]">
                                        <h3 style={{ color: COLORS.yellow }} className="text-[11px] font-black uppercase tracking-[0.2em] mb-6">TARGET DEVICE PROFILE</h3>
                                        <div className="space-y-5">
                                            <SpecItem icon={<Cpu size={16} />} label="CENTRAL PROCESSOR" value={userSpecs.cpu} />
                                            <SpecItem icon={<Activity size={16} />} label="MOTHERBOARD" value={userSpecs.mb} />
                                            <SpecItem icon={<Monitor size={16} />} label="GRAPHICS ADAPTER" value={userSpecs.gpu} />
                                        </div>
                                    </div>

                                    {/* B2B Targeted Ad Slot */}
                                    <div style={{ backgroundColor: COLORS.yellow }} className="border-2 border-black p-4 relative group cursor-pointer overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-black text-white text-[8px] font-black px-2 py-0.5">SPONSORED</div>
                                        <h5 className="text-[11px] font-black uppercase mb-1">SYSTEM UPGRADE ADVICE</h5>
                                        <p className="text-[10px] font-bold leading-tight mb-3">YOUR 4080 SUPER IS CAPABLE OF 240HZ. UPGRADE TO ROG SWIFT OLED PG27AQDM.</p>
                                        <div className="flex justify-end">
                                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* DB Profile Matching Result */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="border-b-4 border-black pb-2 flex justify-between items-end">
                                        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 italic">
                                            <ShieldCheck size={24} /> PROFILE MATCHING ENGINE
                                        </h3>
                                    </div>

                                    <div className="border-2 border-black bg-white shadow-[8px_8px_0px_#000000]">
                                        <div className="p-6 border-b-2 border-black flex justify-between items-center bg-gray-50">
                                            <div>
                                                <h4 className="font-black text-xl uppercase italic">CYBERPUNK 2077</h4>
                                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Matched via: CPU + GPU Similarity (98%)</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase opacity-40">Target Benchmark</p>
                                                <span className="text-3xl font-black italic">118 FPS</span>
                                                <span className="text-[10px] font-bold uppercase ml-1">(AVG)</span>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-black text-white p-4 space-y-2 italic">
                                                    <p className="text-[10px] font-bold opacity-50 uppercase border-b border-gray-700 pb-1">Graphics Preset</p>
                                                    <p className="text-sm font-black text-[#F8F32B]">RT OVERDRIVE</p>
                                                </div>
                                                <div className="bg-black text-white p-4 space-y-2 italic">
                                                    <p className="text-[10px] font-bold opacity-50 uppercase border-b border-gray-700 pb-1">Upscaling Method</p>
                                                    <p className="text-sm font-black text-[#F8F32B]">DLSS 3 FRAME GEN</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCopyScript}
                                                style={{ backgroundColor: copied ? COLORS.black : COLORS.yellow, color: copied ? COLORS.white : COLORS.black }}
                                                className="w-full py-4 flex items-center justify-center gap-2 text-sm font-black border-2 border-black uppercase tracking-widest transition-all"
                                            >
                                                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                                {copied ? 'SCRIPT COPIED TO CLIPBOARD' : 'COPY CONSOLE SCRIPT'}
                                            </button>
                                            <p className="text-center text-[10px] font-bold opacity-40 uppercase">Paste this script in the game console to apply settings.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// Architecture: Reusable UI Components
const NavItem = ({ icon, label, active, onClick, colors }) => (
    <button
        onClick={onClick}
        style={{ backgroundColor: active ? colors.yellow : 'transparent', borderColor: active ? colors.black : 'transparent' }}
        className={`w-full flex items-center gap-4 px-4 py-3 border-2 transition-all duration-150 group ${!active && 'hover:bg-black/5'}`}
    >
        <div className={active ? 'text-black scale-110' : 'text-black opacity-40 group-hover:opacity-100'}>
            {icon}
        </div>
        <span className={`hidden lg:block text-[11px] font-black tracking-widest uppercase ${!active && 'opacity-40 group-hover:opacity-100'}`}>
            {label}
        </span>
    </button>
);

const StatCard = ({ title, value, detail, highlight, colors }) => (
    <div style={{ backgroundColor: highlight ? colors.yellow : colors.white, borderColor: colors.black }} className="border-4 p-6 shadow-[8px_8px_0px_#000000]">
        <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">{title}</p>
        <h3 className="text-3xl font-black tracking-tighter mb-2 italic">{value}</h3>
        <p className="text-[10px] font-bold uppercase tracking-tight border-t border-black pt-2">{detail}</p>
    </div>
);

const SpecItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="mt-1 opacity-50">{icon}</div>
        <div className="overflow-hidden">
            <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-xs font-black truncate leading-tight uppercase italic">{value}</p>
        </div>
    </div>
);

export default App;