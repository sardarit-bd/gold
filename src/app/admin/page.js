'use client';

import { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Layout, Database, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const STATE_PRESETS = {
  1: {
    currentState: 1,
    dropNumber: 5,
    totalSupply: 20,
    soldCount: 17,
    remainingCount: 3,
    goldPrice: "6,850,000",
    goldPriceChange: "+0.35%",
    lastPurchaseTime: "2 دقیقه پیش"
  },
  2: {
    currentState: 2,
    dropNumber: 5,
    totalSupply: 20,
    soldCount: 20,
    remainingCount: 0,
    goldPrice: "6,850,000",
    goldPriceChange: "+0.35%",
    lastPurchaseTime: "2 دقیقه پیش"
  },
  3: {
    currentState: 3,
    dropNumber: 5,
    totalSupply: 20,
    soldCount: 20,
    remainingCount: 0,
    goldPrice: "6,850,000",
    goldPriceChange: "+0.35%",
    lastPurchaseTime: "2 دقیقه پیش"
  },
  4: {
    currentState: 4,
    dropNumber: 5,
    totalSupply: 20,
    soldCount: 20,
    remainingCount: 0,
    goldPrice: "6,850,000",
    goldPriceChange: "+0.35%",
    lastPurchaseTime: "2 دقیقه پیش"
  }
};

const DEFAULT_STATE = STATE_PRESETS[1];

export default function AdminPage() {
  const [dashboardState, setDashboardState] = useState(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('zargoy_dashboard_state');
    if (saved) {
      try {
        setDashboardState(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved dashboard state', e);
      }
    }
  }, []);

  const updateState = (newValues) => {
    const updated = { ...dashboardState, ...newValues };
    
    // Auto-calculate remaining if supply or sold changes
    if ('totalSupply' in newValues || 'soldCount' in newValues) {
      const supply = 'totalSupply' in newValues ? Number(newValues.totalSupply) : Number(dashboardState.totalSupply);
      const sold = 'soldCount' in newValues ? Number(newValues.soldCount) : Number(dashboardState.soldCount);
      updated.remainingCount = Math.max(0, supply - sold);
    }

    setDashboardState(updated);
    localStorage.setItem('zargoy_dashboard_state', JSON.stringify(updated));
    // Trigger storage event manually for same-page listeners in some edge environments
    window.dispatchEvent(new Event('storage'));
  };

  const applyPreset = (presetId) => {
    const preset = STATE_PRESETS[presetId];
    updateState(preset);
  };

  const resetToDefault = () => {
    updateState(DEFAULT_STATE);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-between font-sans pb-12">
      {/* Header */}
      <header className="border-b border-[#201d16] bg-[#070709] py-5 px-6 md:px-12 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#aa771c] to-[#fcf6ba] p-[1.5px] flex items-center justify-center shadow-md shadow-gold-glow/20">
            <div className="w-full h-full bg-[#070708] rounded-[7px] flex items-center justify-center">
              <span className="text-gold font-bold text-lg">Z</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gold-bright tracking-wide">پنل مدیریت زرگوی</h1>
            <p className="text-xs text-gray-400">کنترل پنل لحظه‌ای نمایشگرهای طلا‌فروشی</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button 
            onClick={resetToDefault} 
            className="flex items-center space-x-1.5 space-x-reverse bg-red-950/40 hover:bg-red-900/40 border border-red-500/20 text-red-300 text-xs px-3.5 py-2 rounded-lg transition-all"
          >
            <RefreshCw size={14} />
            <span>بازنشانی پیش‌فرض</span>
          </button>
          <a
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 space-x-reverse bg-[#aa771c]/20 hover:bg-[#aa771c]/30 border border-[#b38728]/30 text-gold-light text-xs px-4 py-2 rounded-lg transition-all"
          >
            <Layout size={14} />
            <span>مشاهده داشبورد (خروجی TV)</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8 flex-grow">
        {/* Help box */}
        <div className="mb-8 p-4 rounded-xl bg-[#0a0a0c] border border-blue-500/20 flex items-start space-x-3 space-x-reverse shadow-inner">
          <Database className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-blue-300">نکته برای تست و نمایش همزمان</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              داشبورد را در یک پنجره جدید باز کنید و آن را در کنار این پنجره قرار دهید. هر تغییری که در این پنل اعمال می‌کنید، بدون نیاز به رفرش کردن، بلافاصله با انیمیشن‌های نرم روی نمایشگر داشبورد طلافروشی اعمال خواهد شد.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Preset Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0a0a0c] border border-[#201d16] rounded-xl p-5 shadow-lg">
              <h2 className="text-base font-bold text-gold-light border-b border-[#201d16] pb-3 mb-4 flex items-center gap-2">
                <Layout size={18} className="text-gold" />
                حالت‌های پیش‌فرض مشتری (کارفرما)
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { id: 1, label: 'حالت ۱: عرضه عمومی فعال', desc: 'شمارنده باقی‌مانده و درب گاوصندوق قفل', color: 'bg-green-500' },
                  { id: 2, label: 'حالت ۲: عرضه عمومی تمام شد', desc: 'پایان عرضه، ساعت شنی و انتظار تأیید مرکز', color: 'bg-red-500' },
                  { id: 3, label: 'حالت ۳: در حال بررسی خزانه', desc: 'بارگذار انیمیشنی نقطه‌ای وضعیت خزانه', color: 'bg-yellow-500' },
                  { id: 4, label: 'حالت ۴: تأیید خزانه (عرضه جدید)', desc: 'تعداد ۲۰ عدد تایید شده و آزادسازی موفق', color: 'bg-emerald-500' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`text-right w-full p-4 rounded-xl border transition-all text-sm group ${
                      dashboardState.currentState === preset.id
                        ? 'bg-gradient-to-r from-[#aa771c]/20 to-[#ffd700]/5 border-[#b38728] shadow-md shadow-gold-glow/5'
                        : 'bg-[#0f0e12]/60 border-transparent hover:border-[#201d16] hover:bg-[#141318]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold ${dashboardState.currentState === preset.id ? 'text-gold-bright' : 'text-gray-200 group-hover:text-gold-light'}`}>
                        {preset.label}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${preset.color} ${dashboardState.currentState === preset.id ? 'animate-pulse' : 'opacity-60'}`} />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0a0a0c] border border-[#201d16] rounded-xl p-6 shadow-lg">
              <h2 className="text-base font-bold text-gold-light border-b border-[#201d16] pb-3 mb-6 flex items-center gap-2">
                <Sliders size={18} className="text-gold" />
                تنظیمات دستی فیلدهای داشبورد
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State selector */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">وضعیت فعال روی نمایشگر</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateState({ currentState: s })}
                        className={`py-2.5 text-center text-xs font-bold rounded-lg border transition-all ${
                          dashboardState.currentState === s
                            ? 'bg-[#b38728] text-black border-[#b38728] shadow-md shadow-gold-glow/10'
                            : 'bg-[#0f0e12] border-[#201d16] text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        حالت {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drop number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">شماره عرضه امروز (Drop Number)</label>
                  <input
                    type="number"
                    min="1"
                    value={dashboardState.dropNumber}
                    onChange={(e) => updateState({ dropNumber: Number(e.target.value) })}
                    className="w-full bg-[#0f0e12] border border-[#201d16] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b38728] transition-all"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">مثلا عدد ۵ که روی نمایشگر به کلمه "پنجمین" تبدیل می‌شود.</p>
                </div>

                {/* Live Gold Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-500" />
                    قیمت لحظه‌ای طلا (تومان / گرم)
                  </label>
                  <input
                    type="text"
                    value={dashboardState.goldPrice}
                    onChange={(e) => updateState({ goldPrice: e.target.value })}
                    className="w-full bg-[#0f0e12] border border-[#201d16] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b38728] transition-all text-left"
                    dir="ltr"
                  />
                </div>

                {/* Total inventory */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">کل موجودی عرضه (Total Supply)</label>
                  <input
                    type="number"
                    min="0"
                    value={dashboardState.totalSupply}
                    onChange={(e) => updateState({ totalSupply: Number(e.target.value) })}
                    className="w-full bg-[#0f0e12] border border-[#201d16] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b38728] transition-all"
                  />
                </div>

                {/* Gold price change */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-500" />
                    درصد تغییرات قیمت طلا
                  </label>
                  <input
                    type="text"
                    value={dashboardState.goldPriceChange}
                    onChange={(e) => updateState({ goldPriceChange: e.target.value })}
                    className="w-full bg-[#0f0e12] border border-[#201d16] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b38728] transition-all text-left"
                    dir="ltr"
                  />
                </div>

                {/* Sold count */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">تعداد فروخته شده (Sold Count)</label>
                  <input
                    type="number"
                    min="0"
                    value={dashboardState.soldCount}
                    onChange={(e) => updateState({ soldCount: Number(e.target.value) })}
                    className="w-full bg-[#0f0e12] border border-[#201d16] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b38728] transition-all"
                  />
                </div>

                {/* Last Purchase text */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <Clock size={12} className="text-gold" />
                    زمان آخرین خرید
                  </label>
                  <input
                    type="text"
                    value={dashboardState.lastPurchaseTime}
                    onChange={(e) => updateState({ lastPurchaseTime: e.target.value })}
                    className="w-full bg-[#0f0e12] border border-[#201d16] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b38728] transition-all"
                  />
                </div>

                {/* Auto Calculated Remaining Count */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">تعداد باقی‌مانده (سیستمی)</label>
                  <div className="w-full bg-[#141318]/50 border border-[#201d16] rounded-lg px-4 py-2.5 text-sm font-bold text-gold-light flex justify-between items-center select-none">
                    <span>{dashboardState.remainingCount} عدد</span>
                    <span className="text-[10px] text-gray-500 font-normal">کل منهای فروش</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-4 md:px-8 mt-12 text-center text-xs text-gray-600 border-t border-[#201d16]/40 pt-6">
        <p>زرگوی - توسعه داده شده با Next.js، Tailwind CSS و Framer Motion بدون کتابخانه‌های آماده UI</p>
      </footer>
    </div>
  );
}
