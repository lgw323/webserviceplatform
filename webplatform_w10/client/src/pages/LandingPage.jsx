import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSEO from '../hooks/useSEO';
import useAuthStore from '../store/useAuthStore';

// Famous Game Splash Arts for the Vortex
const GAMES = [
  "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/28d0eb5f34bc481cc8ccddb2a6a68cd1ffeb63990263f9eb.jpg", // Cyberpunk 2077
  "https://image.api.playstation.com/vulcan/ap/rnd/202211/1511/V1xKSTq28bC1O4Vd4x0eF040.png", // Rainbow Six Siege
  "https://cdn.dribbble.com/users/2348/screenshots/10696082/media/4a24583ea649f9df1415775a37c84ae5.jpg", // Valorant
  "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg", // Apex Legends
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg", // League of Legends
  "https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltc18a0eb1d2b77a7b/632cfb53e346b9112a1f28b4/Overwatch2_Secondary_KeyArt.jpg" // Overwatch 2
];

export default function LandingPage() {
  useSEO('landing');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isConverging, setIsConverging] = useState(false);
  const [radius, setRadius] = useState(800);

  // Calculate dynamic radius based on window size
  useEffect(() => {
    const updateRadius = () => {
      // Find the diagonal or just a large enough number to spawn off-screen
      const r = Math.max(window.innerWidth, window.innerHeight) * 0.7;
      setRadius(r);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginBtnClick = () => {
    setIsConverging(true);
    // Wait for the fast "suck-in" animation to complete
    setTimeout(() => {
      navigate('/login');
    }, 800); 
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex items-center justify-center overflow-hidden font-sans">
      
      {/* ── Background Starfield / Glow ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-accent/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyber-purple/10 blur-[80px] rounded-full" />
      </div>

      {/* ── Top Header Navbar ── */}
      <header className="absolute top-0 left-0 w-full px-8 py-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <nav className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-6 py-2 backdrop-blur-md gap-6 text-sm font-medium">
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Platform</span>
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Games</span>
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Community</span>
        </nav>
        <button
          onClick={handleLoginBtnClick}
          className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all transform hover:scale-105"
        >
          Sign In
        </button>
      </header>

      {/* ── Full Screen Cosmos Vortex ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-[1500px]">
        {/* Rotating container to naturally create curved/spiral trajectories */}
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          animate={isConverging ? {} : { rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          {GAMES.map((game, i) => {
            // Hexagon logic (6 corners)
            const angle = (i * 60) * (Math.PI / 180);
            const startX = Math.cos(angle) * radius;
            const startY = Math.sin(angle) * radius;
            
            // Randomize trajectory slightly per card for organic feel
            const midX = startX * 0.4 + (Math.random() * 100 - 50);
            const midY = startY * 0.4 + (Math.random() * 100 - 50);

            return (
              <motion.div
                key={i}
                className="absolute w-40 h-28 md:w-64 md:h-40 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/10 bg-black/50"
                style={{ zIndex: 10 - i }}
                initial={{ 
                  x: startX, 
                  y: startY, 
                  scale: 0, 
                  opacity: 0, 
                  rotateZ: angle * (180 / Math.PI)
                }}
                animate={
                  isConverging
                    ? { 
                        x: 0, 
                        y: 0, 
                        scale: 0, 
                        opacity: 0, 
                        rotateZ: "+=180",
                        transition: { duration: 0.6, ease: "backIn" } 
                      }
                    : { 
                        // The card is "thrown": starts big, scales down as it falls into the center
                        x: [startX, midX, 0],
                        y: [startY, midY, 0],
                        scale: [0, 1.2, 0.6, 0], 
                        opacity: [0, 1, 0.8, 0],
                        // Adds a spinning/tumbling effect like a card being thrown
                        rotateZ: [angle * (180 / Math.PI), angle * (180 / Math.PI) + 180, angle * (180 / Math.PI) + 360],
                        rotateY: [0, 15, 30, 45]
                      }
                }
                transition={
                  isConverging
                    ? undefined
                    : {
                        duration: 8, // Takes 8 seconds to fall into the black hole
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: i * (8 / 6) // Perfectly staggered so someone throws a card every 1.33 seconds
                      }
                }
              >
                <img src={game} alt={`Game ${i}`} className="w-full h-full object-cover opacity-80 mix-blend-lighten" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Center Content (The "Black Hole" Core) ── */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <motion.div
          animate={isConverging ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "anticipate" }}
          className="flex flex-col items-center"
        >
          <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_40px_20px_rgba(255,255,255,0.2)] mb-8" />
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            SYNCRIG
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl max-w-xl font-light tracking-wide mb-10 border border-white/10 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full">
            A hardware matching engine for gamers
          </p>
          
          <button
            onClick={handleLoginBtnClick}
            className="pointer-events-auto px-10 py-4 bg-white hover:bg-gray-200 text-black rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Get Started
          </button>
        </motion.div>
      </div>
      
    </div>
  );
}
