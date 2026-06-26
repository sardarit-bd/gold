'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Default initial state matching State 1
const DEFAULT_STATE = {
  currentState: 1,
  dropNumber: 5,
  totalSupply: 20,
  soldCount: 17,
  remainingCount: 3,
  goldPrice: "6,850,000",
  goldPriceChange: "+0.35%",
  lastPurchaseTime: "2 دقیقه پیش"
};

// Ordinal words mapper for the Drop Number in Persian
const getDropOrdinalWord = (num) => {
  const words = {
    1: 'اولین',
    2: 'دومین',
    3: 'سومین',
    4: 'چهارمین',
    5: 'پنجمین',
    6: 'ششمین',
    7: 'هفتمین',
    8: 'هشتمین',
    9: 'نهمین',
    10: 'دهمین'
  };
  return words[num] || `${num}مین`;
};

// Animated Number Component for micro-interactions
const AnimatedNumber = ({ value, className = "", isRed = false }) => {
  return (
    <motion.span
      key={value}
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`inline-block ${className} ${isRed ? 'text-red-500 gold-glow-text-red' : ''}`}
    >
      {value}
    </motion.span>
  );
};

export default function Dashboard() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Initial State Load
    const saved = localStorage.getItem('zargoy_dashboard_state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing storage state', e);
      }
    } else {
      localStorage.setItem('zargoy_dashboard_state', JSON.stringify(DEFAULT_STATE));
    }

    // 2. LocalStorage Change Listener (Real-Time Sync)
    const handleStorageChange = () => {
      const updated = localStorage.getItem('zargoy_dashboard_state');
      if (updated) {
        try {
          setState(JSON.parse(updated));
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-t-2 border-[#b38728] animate-spin"></div>
      </div>
    );
  }

  const { currentState, dropNumber, totalSupply, soldCount, remainingCount, goldPrice, goldPriceChange, lastPurchaseTime } = state;
  const isSoldOut = remainingCount === 0;

  // Calculate percentage of remaining items
  const remainingPercent = totalSupply > 0 ? (remainingCount / totalSupply) * 100 : 0;

  // Circle gauge math (R = 132, C = 2 * PI * 132 = 829.38)
  const radius = 132;
  const circumference = 2 * Math.PI * radius;

  // State 4 represents a 100% full release ring, otherwise proportional to remaining
  const ringPercentage = currentState === 4 ? 100 : remainingPercent;
  const strokeDashoffset = circumference - (ringPercentage / 100) * circumference;

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white flex flex-col justify-center items-center p-2 lg:p-4 select-none relative overflow-hidden font-sans">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none z-0" />

      {/* The Dashboard Outer Panel Frame (Locked h-97vh to maximize display usage) */}
      <div className="w-full h-full max-w-[1920px] max-h-[1080px] lg:h-[97vh] bg-[#070709]/95 border-[3px] border-[#b38728] rounded-[36px] p-6 lg:p-10 flex flex-col justify-between shadow-[0_0_120px_rgba(0,0,0,0.95),0_0_50px_rgba(179,135,40,0.25)] relative z-10 overflow-hidden">

        {/* Decorative inner corner borders */}
        <div className="absolute top-0 right-0 w-32 h-32 border-t-[3px] border-r-[3px] border-[#b38728]/30 rounded-tr-[32px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-[3px] border-l-[3px] border-[#b38728]/30 rounded-bl-[32px] pointer-events-none" />

        {/* HEADER SECTION (10% of viewport height) */}
        <header className="w-full flex justify-between items-center z-10 pb-4 border-b border-[#201d16]/30">

          {/* Top-Left State Indicator Badge */}
          <div className="flex items-center">
            <div className="border border-[#b38728]/35 bg-[#0e0e12]/90 rounded-xl px-6 py-3 flex flex-col items-start min-w-[170px] shadow-md shadow-black/60">
              <span className="text-[10px] text-gray-500 font-bold mb-0.5">حالت {currentState}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${currentState === 1 ? 'bg-green-500 shadow-green-500/50 animate-pulse' :
                  currentState === 2 ? 'bg-red-500 shadow-red-500/50 animate-pulse' :
                    currentState === 3 ? 'bg-yellow-500 shadow-yellow-500/50 animate-pulse' :
                      'bg-emerald-500 shadow-emerald-500/50 animate-pulse'
                  }`} />
                <span className="text-xs lg:text-sm xl:text-base font-black text-gray-200">
                  {currentState === 1 && "عرضه عمومی فعال"}
                  {currentState === 2 && "عرضه عمومی تمام شد"}
                  {currentState === 3 && "در حال بررسی خزانه"}
                  {currentState === 4 && "تأیید خزانه"}
                </span>
              </div>
            </div>
          </div>

          {/* Center Title and Logo */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gold-bright tracking-wider gold-glow-text mb-0.5">زرگوی</h1>
              <p className="text-xs lg:text-sm xl:text-base font-bold text-gold-light opacity-80 tracking-wider">طلای هوشمند. ارزش ماندگار</p>
            </div>
            {/* Glowing Golden Mandala Logo */}
            <div className="w-16 h-16 lg:w-20 lg:h-20 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#b38728]/15 rounded-full blur-md" />
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" className="gold-glow-node">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bf953f" />
                    <stop offset="25%" stopColor="#fcf6ba" />
                    <stop offset="50%" stopColor="#b38728" />
                    <stop offset="75%" stopColor="#fbf5b7" />
                    <stop offset="100%" stopColor="#aa771c" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="44" stroke="url(#goldGrad)" strokeWidth="3" strokeDasharray="6 3" />
                <circle cx="50" cy="50" r="35" stroke="url(#goldGrad)" strokeWidth="1.8" />
                <circle cx="50" cy="50" r="26" stroke="url(#goldGrad)" strokeWidth="1.2" strokeDasharray="10 3" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                  <line
                    key={idx}
                    x1="50"
                    y1="50"
                    x2={50 + 35 * Math.cos((angle * Math.PI) / 180)}
                    y2={50 + 35 * Math.sin((angle * Math.PI) / 180)}
                    stroke="url(#goldGrad)"
                    strokeWidth="1.2"
                    opacity="0.6"
                  />
                ))}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
                  <circle
                    key={`dot-${idx}`}
                    cx={50 + 17 * Math.cos((angle * Math.PI) / 180)}
                    cy={50 + 17 * Math.sin((angle * Math.PI) / 180)}
                    r="2.5"
                    fill="url(#goldGrad)"
                  />
                ))}
                <circle cx="50" cy="50" r="8" fill="url(#goldGrad)" />
              </svg>
            </div>
          </div>

        </header>

        {/* MAIN DISPLAY AREA (72% of viewport height) */}
        <main className="w-full flex-grow flex flex-col lg:flex-row items-center justify-between my-4 gap-6 lg:h-[72%] overflow-y-auto lg:overflow-y-visible">

          {/* LEFT PANEL: stats list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="gold-card rounded-2xl p-6 lg:p-10 flex flex-col justify-between h-[360px] lg:h-full w-full lg:w-[26%] shadow-[0_0_25px_rgba(197,160,89,0.3),inset_0_0_15px_rgba(197,160,89,0.1)]"
          >
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-center text-gold-light tracking-wide">خزانه مرکزی زرگوی</h2>
            </div>

            {/* Central Graphic Area */}
            <div className="flex-grow flex items-center justify-center my-3 relative">
              <AnimatePresence mode="wait">

                {/* State 1: Metallic Vault Door */}
                {currentState === 1 && (
                  <motion.div
                    key="s1-vault"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-44 h-44 lg:w-56 lg:h-56 xl:w-64 xl:h-64 flex items-center justify-center"
                  >
                    <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" className="gold-glow-node">
                      <circle cx="60" cy="60" r="54" fill="url(#goldGrad)" />
                      <circle cx="60" cy="60" r="50" fill="#080709" />

                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <circle
                          key={deg}
                          cx={60 + 44 * Math.cos((deg * Math.PI) / 180)}
                          cy={60 + 44 * Math.sin((deg * Math.PI) / 180)}
                          r="3"
                          fill="url(#goldGrad)"
                          stroke="#000"
                          strokeWidth="0.5"
                        />
                      ))}

                      <circle cx="60" cy="60" r="36" stroke="url(#goldGrad)" strokeWidth="5" fill="none" />
                      <circle cx="60" cy="60" r="33.5" stroke="#000" strokeWidth="0.8" fill="none" />

                      {[0, 60, 120, 180, 240, 300].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const x1 = 60 + 8 * Math.cos(rad);
                        const y1 = 60 + 8 * Math.sin(rad);
                        const x2 = 60 + 33 * Math.cos(rad);
                        const y2 = 60 + 33 * Math.sin(rad);
                        const tipX = 60 + 38 * Math.cos(rad);
                        const tipY = 60 + 38 * Math.sin(rad);
                        return (
                          <g key={deg}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#goldGrad)" strokeWidth="3.5" />
                            <circle cx={tipX} cy={tipY} r="4" fill="url(#goldGrad)" stroke="#000" strokeWidth="0.5" />
                          </g>
                        );
                      })}

                      <circle cx="60" cy="60" r="12" fill="url(#goldGrad)" />
                      <circle cx="60" cy="60" r="9" fill="#080709" />
                      <circle cx="60" cy="60" r="4.5" fill="url(#goldGrad)" />
                    </svg>
                  </motion.div>
                )}

                {/* State 2: Hourglass */}
                {currentState === 2 && (
                  <motion.div
                    key="s2-hourglass"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-40 h-40 lg:w-48 lg:h-52 xl:w-56 xl:h-60 flex items-center justify-center"
                  >
                    <svg width="100%" height="100%" viewBox="0 0 80 110" fill="none" className="gold-glow-node">
                      <rect x="8" y="4" width="64" height="6" rx="1.5" fill="url(#goldGrad)" />
                      <rect x="8" y="100" width="64" height="6" rx="1.5" fill="url(#goldGrad)" />
                      <rect x="12" y="10" width="5" height="90" fill="url(#goldGrad)" opacity="0.6" />
                      <rect x="63" y="10" width="5" height="90" fill="url(#goldGrad)" opacity="0.6" />

                      <path
                        d="M20,10 L60,10 C60,10 60,37 48,55 C60,73 60,100 60,100 L20,100 C20,100 20,73 32,55 C20,37 20,10 20,10 Z"
                        stroke="url(#goldGrad)"
                        strokeWidth="2"
                        fill="rgba(186,142,49,0.02)"
                      />

                      <path d="M22,12 L58,12 C58,12 57,28 49,42 C46,38 34,38 31,42 C23,28 22,12 22,12 Z" fill="url(#goldGrad)" opacity="0.3" />
                      <line x1="40" y1="43" x2="40" y2="98" stroke="url(#goldGrad)" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                      <path d="M34,70 C39,63 41,63 46,70 C54,82 57,98 57,98 L23,98 C23,98 26,82 34,70 Z" fill="url(#goldGrad)" className="animate-pulse" />
                    </svg>
                  </motion.div>
                )}

                {/* State 3: Dot Loader */}
                {currentState === 3 && (
                  <motion.div
                    key="s3-loader"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-40 h-40 lg:w-48 lg:h-48 xl:w-52 xl:h-52 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                      className="w-24 h-24 relative"
                    >
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
                        const rad = (deg * Math.PI) / 180;
                        const r = 38;
                        const cx = 48 + r * Math.cos(rad);
                        const cy = 48 + r * Math.sin(rad);
                        const opacity = 0.2 + (idx / 7) * 0.8;
                        const size = 6 + (idx / 7) * 4.5;
                        return (
                          <div
                            key={deg}
                            style={{
                              position: 'absolute',
                              left: `${cx}px`,
                              top: `${cy}px`,
                              width: `${size}px`,
                              height: `${size}px`,
                              opacity: opacity,
                              transform: 'translate(-50%, -50%)',
                            }}
                            className="rounded-full bg-gradient-to-tr from-[#bf953f] to-[#fcf6ba] shadow-[0_0_8px_rgba(186,142,49,0.65)]"
                          />
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}

                {/* State 4: Checkmark Success */}
                {currentState === 4 && (
                  <motion.div
                    key="s4-success"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 lg:w-26 lg:h-26 rounded-full border-[6px] border-emerald-500 bg-emerald-950/20 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-1"
                    >
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="gold-glow-text-green">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <span className="text-2xl lg:text-3xl xl:text-4xl font-black text-emerald-400 gold-glow-text-green leading-none">تأیید شد</span>
                    <span className="text-xs lg:text-sm text-gray-300 font-bold">آزادسازی از خزانه مرکزی</span>
                    <span className="text-4xl lg:text-5xl font-black text-emerald-500 gold-glow-text-green leading-none pt-1">+{totalSupply} عدد</span>
                    <span className="text-xs lg:text-sm text-gray-300 font-bold">عرضه جدید با موفقیت آزاد شد.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Status labels inside card */}
            <div className="h-14 flex flex-col items-center justify-end text-center">
              <AnimatePresence mode="wait">
                {currentState === 1 && (
                  <motion.div key="v1-stat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-bold mb-0.5">وضعیت خزانه</span>
                    <div className="flex items-center gap-1.5" dir="rtl">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-sm lg:text-base font-black text-gold-light">قفل</span>
                    </div>
                  </motion.div>
                )}

                {currentState === 2 && (
                  <motion.div key="v2-stat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-bold mb-0.5">وضعیت خزانه</span>
                    <span className="text-2xl lg:text-3xl font-black text-white gold-glow-text tracking-wide">تأیید مرکز</span>
                  </motion.div>
                )}

                {currentState === 3 && (
                  <motion.div key="v3-stat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-bold mb-0.5">وضعیت خزانه</span>
                    <span className="text-2xl lg:text-3xl font-black text-yellow-500 gold-glow-text tracking-wide animate-pulse">در حال بررسی</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CENTER PANEL: Segmented progress circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center relative w-full lg:w-[48%] h-[340px] lg:h-full"
          >
            <div className="relative w-[320px] h-[320px] lg:w-[500px] lg:h-[500px] xl:w-[580px] xl:h-[580px] flex items-center justify-center">

              {/* Outer Decorative Rings */}
              <svg width="100%" height="100%" viewBox="0 0 320 320" className="absolute top-0 left-0">
                {/* Thick outer gold border ring (aligned tightly to segment boundary) */}
                <circle cx="160" cy="160" r="141" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" className="filter drop-shadow-[0_0_8px_rgba(186,142,49,0.65)]" />
                {/* Thick inner gold border ring (aligned tightly to segment boundary) */}
                <circle cx="160" cy="160" r="123" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" className="filter drop-shadow-[0_0_8px_rgba(186,142,49,0.65)]" />

                {/* Base Dark Segmented Track (Static) */}
                <circle
                  cx="160"
                  cy="160"
                  r="132"
                  stroke="#121215"
                  strokeWidth="16"
                  strokeDasharray="18 6"
                  fill="none"
                />
              </svg>

              {/* Glowing Active Gold Segmented Ring */}
              {currentState !== 2 && currentState !== 3 && (
                <svg width="100%" height="100%" viewBox="0 0 320 320" className="absolute top-0 left-0 -rotate-90">
                  <defs>
                    {/* The Mask containing the animated solid circle */}
                    <mask id="gaugeMask">
                      <motion.circle
                        cx="160"
                        cy="160"
                        r="132"
                        stroke="#ffffff"
                        strokeWidth="20"
                        fill="none"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        style={{
                          strokeDasharray: circumference,
                        }}
                        className="-rotate-90 origin-center"
                      />
                    </mask>
                  </defs>

                  {/* Glowing Active Gold Segmented Ring (Masked for progress reveal) */}
                  <circle
                    cx="160"
                    cy="160"
                    r="132"
                    stroke="url(#goldGrad)"
                    strokeWidth="16"
                    strokeDasharray="18 6"
                    fill="none"
                    mask="url(#gaugeMask)"
                    className="filter drop-shadow-[0_0_12px_rgba(186,142,49,0.85)]"
                  />
                </svg>
              )}

              {/* Center Panel Contents - Scaled dynamically based on percentage */}
              <div className="absolute w-[77.5%] h-[77.5%] rounded-full bg-gradient-to-b from-[#09090c] to-[#040405] border-[3px] border-[#c5a059]/75 shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_20px_rgba(197,160,89,0.2),inset_0_0_35px_rgba(186,142,49,0.25)] flex flex-col items-center justify-center text-center p-4">
                <AnimatePresence mode="wait">
                  {/* State 1 Content */}
                  {currentState === 1 && (
                    <motion.div
                      key="s1-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-base lg:text-3xl font-bold text-gold-light tracking-wide">باقی‌مانده</span>
                      <span className="text-9xl lg:text-[160px] xl:text-[200px] font-black text-gold-bright gold-glow-text leading-none my-2">
                        <AnimatedNumber value={remainingCount} />
                      </span>
                      <span className="text-base lg:text-3xl font-bold text-gold-light">عدد</span>
                      <div className="h-[2px] w-20 bg-[#b38728]/40 my-3" />
                      <span className="text-xl lg:text-3xl font-bold text-gray-500">از {totalSupply} عدد</span>
                    </motion.div>
                  )}

                  {/* State 2 Content */}
                  {currentState === 2 && (
                    <motion.div
                      key="s2-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-sm lg:text-2xl font-bold text-gold-light tracking-widest mb-2">عرضه عمومی</span>
                      <span className="text-6xl lg:text-7xl xl:text-8xl font-black text-red-500 gold-glow-text-red leading-none my-3.5">
                        تمام شد
                      </span>
                      <span className="text-sm lg:text-xl font-bold text-gray-400 my-2">{totalSupply} / {soldCount}</span>
                      <div className="mt-4 px-6 py-2.5 rounded-lg border border-red-500/45 bg-red-950/20 text-red-400 text-xs lg:text-base font-black tracking-wider shadow-sm shadow-red-500/10">
                        به اتمام رسید
                      </div>
                    </motion.div>
                  )}

                  {/* State 3 Content */}
                  {currentState === 3 && (
                    <motion.div
                      key="s3-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-sm lg:text-2xl font-bold text-gold-light tracking-widest mb-2">عرضه عمومی</span>
                      <span className="text-6xl lg:text-7xl xl:text-8xl font-black text-red-500 gold-glow-text-red leading-none my-3.5">
                        تمام شد
                      </span>
                      <span className="text-sm lg:text-xl font-bold text-gray-400 my-2">{totalSupply} / {soldCount}</span>
                      <div className="mt-4 px-6 py-2.5 rounded-lg border border-yellow-500/35 bg-yellow-950/20 text-yellow-500 text-xs lg:text-base font-black tracking-wider shadow-sm shadow-yellow-500/10">
                        در حال بررسی خزانه
                      </div>
                    </motion.div>
                  )}

                  {/* State 4 Content */}
                  {currentState === 4 && (
                    <motion.div
                      key="s4-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-base lg:text-3xl font-bold text-gold-light tracking-wide">خزانه مرکزی</span>
                      <span className="text-9xl lg:text-[140px] xl:text-[180px] font-black text-gold-bright gold-glow-text leading-none my-2">
                        <AnimatedNumber value={totalSupply} />
                      </span>
                      <span className="text-base lg:text-3xl font-bold text-gold-light">عدد</span>
                      <div className="mt-4 px-6 py-2.5 rounded-lg bg-[#100f13] border border-[#b38728]/45 text-gold-light text-xs lg:text-base font-bold tracking-wider">
                        جدید از خزانه
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>

          {/* RIGHT PANEL: vault graphic & labels */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="gold-card rounded-2xl p-6 lg:p-10 flex flex-col justify-between h-[360px] lg:h-full w-full lg:w-[26%] shadow-[0_0_25px_rgba(197,160,89,0.3),inset_0_0_15px_rgba(197,160,89,0.1)]"
          >
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-gold-light tracking-wide">
                {getDropOrdinalWord(dropNumber)} عرضه امروز
              </h2>
            </div>

            <div className="flex-grow flex flex-col justify-center space-y-6 lg:space-y-12 xl:space-y-16">

              {/* Supply Row */}
              <div className="flex flex-row items-center gap-4" dir="ltr">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black border-2 border-[#b38728]/45 flex items-center justify-center shadow-[0_0_12px_rgba(179,135,40,0.25)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="2.2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="flex flex-col items-start text-right flex-grow" dir="rtl">
                  <span className="text-sm lg:text-base text-[#dfba73] font-bold mb-1">تعداد عرضه</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base lg:text-lg text-[#dfba73] font-black">عدد</span>
                    <AnimatedNumber value={totalSupply} className="text-4xl lg:text-5xl xl:text-6xl font-black text-white" />
                  </div>
                </div>
              </div>

              {/* Sold Row */}
              <div className="flex flex-row items-center gap-4" dir="ltr">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black border-2 flex items-center justify-center transition-all ${isSoldOut
                  ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                  : 'border-[#b38728]/45 shadow-[0_0_12px_rgba(179,135,40,0.25)]'
                  }`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isSoldOut ? '#ef4444' : 'url(#goldGrad)'} strokeWidth="2.2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div className="flex flex-col items-start text-left flex-grow" dir="rtl">
                  <span className={`text-sm lg:text-base font-bold mb-1 ${isSoldOut ? 'text-red-500' : 'text-[#dfba73]'}`}>فروخته شده</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-base lg:text-lg font-black ${isSoldOut ? 'text-red-500' : 'text-[#dfba73]'}`}>عدد</span>
                    <AnimatedNumber value={soldCount} className="text-4xl lg:text-5xl xl:text-6xl font-black text-white" isRed={isSoldOut} />
                  </div>
                </div>
              </div>

              {/* Remaining Row */}
              <div className="flex flex-row items-center gap-4" dir="ltr">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-black border-2 flex items-center justify-center transition-all ${isSoldOut
                  ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                  : 'border-[#b38728]/45 shadow-[0_0_12px_rgba(179,135,40,0.25)]'
                  }`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isSoldOut ? '#ef4444' : 'url(#goldGrad)'} strokeWidth="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <div className="flex flex-col items-start text-left flex-grow" dir="rtl">
                  <span className={`text-sm lg:text-base font-bold mb-1 ${isSoldOut ? 'text-red-500' : 'text-[#dfba73]'}`}>باقی‌مانده</span>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-base lg:text-lg font-black ${isSoldOut ? 'text-red-500' : 'text-[#dfba73]'}`}>عدد</span>
                    <AnimatedNumber value={remainingCount} className="text-4xl lg:text-5xl xl:text-6xl font-black text-white" isRed={isSoldOut} />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>


        </main>

        {/* GOLD DIVIDER LINE (Separates content from footer) */}
        <div className="w-full h-[1.5px] bg-[#b38728]/45 my-1" />

        {/* BOTTOM PANEL STATUS BAR (15% of viewport height) */}
        <footer className="w-full flex items-center justify-between z-10 py-4 pb-2">



          {/* Last Purchase Section (Right) */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-10 h-10 rounded-full bg-black border-2 border-[#b38728] flex items-center justify-center shadow-[0_0_8px_rgba(179,135,40,0.1)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[#dfba73] font-bold mb-0.5">آخرین خرید</span>
              <span className="text-lg lg:text-xl xl:text-2xl font-black text-white opacity-95">{lastPurchaseTime}</span>
            </div>
          </div>



          {/* Price Stack Section (Left) */}
          <div className="flex items-center gap-4">
            {/* Isometric 3D Metallic Gold Bars */}
            <div className="w-20 h-12 relative flex items-center justify-center">
              <svg width="65" height="42" viewBox="0 0 60 40" fill="none" className="gold-glow-node">
                <defs>
                  <linearGradient id="gTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff8db" />
                    <stop offset="100%" stopColor="#d4a035" />
                  </linearGradient>
                  <linearGradient id="gFront" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#b58724" />
                    <stop offset="100%" stopColor="#876212" />
                  </linearGradient>
                  <linearGradient id="gSide" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a3781e" />
                    <stop offset="100%" stopColor="#694d0c" />
                  </linearGradient>
                </defs>

                {/* Bottom Left Bar */}
                <g transform="translate(4, 18)">
                  <polygon points="0,8 18,8 24,16 6,16" fill="url(#gSide)" />
                  <polygon points="24,16 34,16 31,8 18,8" fill="url(#gFront)" />
                  <polygon points="0,8 12,0 31,8 18,8" fill="url(#gTop)" />
                </g>

                {/* Bottom Right Bar */}
                <g transform="translate(24, 18)">
                  <polygon points="0,8 18,8 24,16 6,16" fill="url(#gSide)" />
                  <polygon points="24,16 34,16 31,8 18,8" fill="url(#gFront)" />
                  <polygon points="0,8 12,0 31,8 18,8" fill="url(#gTop)" />
                </g>

                {/* Top Center Bar */}
                <g transform="translate(14, 6)">
                  <polygon points="0,8 18,8 24,16 6,16" fill="url(#gSide)" />
                  <polygon points="24,16 34,16 31,8 18,8" fill="url(#gFront)" />
                  <polygon points="0,8 12,0 31,8 18,8" fill="url(#gTop)" />
                </g>
              </svg>
            </div>

            {/* Price values and direction tag */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-[#dfba73] font-bold mb-0.5">قیمت لحظه‌ای طلا</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-wide" dir="ltr">{goldPrice}</span>
                <span className="text-sm font-bold text-gold-light opacity-85">تومان / گرم</span>

                {/* Trend Tag */}
                <div className="flex items-center gap-0.5 bg-green-500/10 border border-green-500/20 rounded px-1.5 py-0.5 text-[10px] font-black text-green-400">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                  <span dir="ltr">{goldPriceChange}</span>
                </div>
              </div>
            </div>
          </div>



        </footer>

      </div>
    </div>
  );
}
