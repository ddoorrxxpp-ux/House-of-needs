import { 
  Sun, 
  Moon, 
  ShoppingBag, 
  Globe, 
  Search, 
  Trash2,
  Laptop
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ThemeType, LanguageType, translations } from '../types';

interface HeaderProps {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  language: LanguageType;
  setLanguage: (l: LanguageType) => void;
  cartCount: number;
  onCartToggle: () => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  logoSvg: string;
  logoUrl?: string;
  bannerText: string;
}

export default function Header({
  theme,
  setTheme,
  language,
  setLanguage,
  cartCount,
  onCartToggle,
  searchTerm,
  setSearchTerm,
  logoSvg,
  logoUrl,
  bannerText
}: HeaderProps) {
  const s = translations[language];
  const isRtl = language === 'ar' || language === 'ku';

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Logo Renderer supporting URLs and fallback dynamic layout SVG
  const renderLogo = (sizeClass: string) => {
    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt="Bayt Al-Hajat Logo" 
          className={`${sizeClass} object-contain rounded-xl select-none`}
          referrerPolicy="no-referrer"
        />
      );
    }
    
    if (logoSvg) {
      if (logoSvg.trim().startsWith('<svg')) {
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-1 rounded-xl text-[#E88A05] transition-transform duration-200"
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />
        );
      }
    }

    // Default Spinner / loading visual fallback
    return (
      <div className="w-full h-full flex items-center justify-center rounded-xl bg-amber-500/10 animate-pulse">
        <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    );
  };

  // Theme conditional background styles
  const bgClasses = theme === 'light' 
    ? 'bg-white/80 border-slate-200 text-slate-800' 
    : theme === 'dark' 
    ? 'bg-zinc-950/80 border-zinc-800 text-zinc-100' 
    : 'bg-[#09182C]/80 border-[#1A3454] text-stone-100';

  const stickyBgClasses = theme === 'light'
    ? 'bg-white border-slate-200 text-slate-800 shadow-lg'
    : theme === 'dark'
    ? 'bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-xl'
    : 'bg-[#09182C]/95 border-[#1A3454] text-stone-100 shadow-2xl';

  return (
    <header className="w-full flex flex-col z-45 relative">
      {/* Spacer to prevent shifting content under the fixed header when scrolled */}
      {isScrolled && <div className="h-[76px] w-full" />}

      {/* Main Bar Navigation Container with dynamic layout transition on scroll */}
      <div 
        id="main-nav-container"
        className={`w-full transition-all duration-300 border-b select-none ${
          isScrolled 
            ? `fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${stickyBgClasses} py-2` 
            : `relative ${bgClasses} py-8 sm:py-10`
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          
          {/* Top segment: Dynamic Logo placement depending on Scroll layout state */}
          {!isScrolled ? (
            /* --- INITIAL STATE: Prominent Large centered Logo & Brand text --- */
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <motion.div 
                layoutId="applet-logo-block"
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-[#E88A05]/20 p-2 shadow-inner relative"
              >
                {/* Yellow square grid layout design elements behind house */}
                <div className="absolute inset-0 border border-dashed border-amber-500/30 rounded-2xl m-1 pointer-events-none" />
                {renderLogo("w-full h-full")}
              </motion.div>

              <div className="flex flex-col items-center">
                <motion.h1 
                  layoutId="applet-title-brand"
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                  className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-[#E88A05] to-[#FFB03A] font-serif"
                >
                  {s.storeName}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className={`text-xs sm:text-sm font-semibold mt-2 tracking-wide uppercase opacity-75 font-serif max-w-lg leading-relaxed ${
                    theme === 'light' ? 'text-slate-600' : 'text-stone-300'
                  }`}
                >
                  {s.slogan}
                </motion.p>
              </div>
            </div>
          ) : (
            /* --- SCROLLED STATE: Sleek Compact sticky top navbar --- */
            <div className="flex items-center justify-between w-full h-[60px] gap-4">
              
              {/* Left element logo/name combo */}
              <div className="flex items-center gap-3">
                <motion.div 
                  layoutId="applet-logo-block"
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                  className="w-11 h-11 flex items-center justify-center rounded-xl bg-amber-500/15 border border-[#E88A05]/20 p-0.5 shadow-md relative animate-fade-in"
                >
                  {renderLogo("w-full h-full")}
                </motion.div>

                <div className="flex flex-col">
                  <motion.h1 
                    layoutId="applet-title-brand"
                    transition={{ type: "spring", stiffness: 220, damping: 28 }}
                    className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-[#E88A05] to-[#FFB03A] font-serif leading-none"
                  >
                    {s.storeName}
                  </motion.h1>
                </div>
              </div>

              {/* Center aligned search input on scrolled navbar */}
              <div className="hidden md:block flex-1 max-w-md mx-4">
                <div className="relative">
                  <span className={`absolute inset-y-0 ${isRtl ? 'left-3' : 'right-3'} flex items-center pointer-events-none opacity-60`}>
                    <Search className="w-4 h-4 text-zinc-400" />
                  </span>
                  <input
                    id="store-search-scrolled"
                    type="text"
                    placeholder={s.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-4 py-2 text-xs rounded-xl border outline-hidden transition ${
                      isRtl ? 'pl-8 pr-4 text-right' : 'pr-8 pl-4 text-left'
                    } ${
                      theme === 'light'
                        ? 'bg-slate-55 border-slate-200 focus:border-[#E88A05]'
                        : theme === 'dark'
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-yellow-500'
                        : 'bg-[#0B1E36] border-[#1A3454] text-stone-100 focus:border-[#E88A05]'
                    }`}
                  />
                </div>
              </div>

              {/* Multi-toggle segments controls */}
              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div 
                  id="lang-switcher-sticky"
                  className={`flex items-center p-0.5 rounded-lg border ${
                    theme === 'light' ? 'bg-slate-100 border-slate-250' : 'bg-black/20 border-white/10'
                  }`}
                >
                  <button onClick={() => setLanguage('ar')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer ${language === 'ar' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-75 hover:opacity-100'}`}>
                    عربي
                  </button>
                  <button onClick={() => setLanguage('ku')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer ${language === 'ku' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-75 hover:opacity-100'}`}>
                    کوردی
                  </button>
                  <button onClick={() => setLanguage('en')} className={`px-2 py-0.5 text-[10px] font-bold rounded-md cursor-pointer ${language === 'en' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-75 hover:opacity-100'}`}>
                    EN
                  </button>
                </div>

                {/* Theme Switcher */}
                <div className={`flex items-center p-0.5 rounded-lg border ${
                  theme === 'light' ? 'bg-slate-100 border-slate-250' : 'bg-black/20 border-white/10'
                }`}>
                  <button onClick={() => setTheme('light')} className={`p-1 rounded-md cursor-pointer ${theme === 'light' ? 'bg-[#0B1E36] text-[#E88A05]' : 'opacity-75 hover:opacity-100'}`}>
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setTheme('dark')} className={`p-1 rounded-md cursor-pointer ${theme === 'dark' ? 'bg-yellow-500 text-zinc-950' : 'opacity-75 hover:opacity-100'}`}>
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setTheme('system')} className={`p-1 rounded-md cursor-pointer ${theme === 'system' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-75 hover:opacity-100'}`}>
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sticky Shopping bag toggler */}
                <button
                  onClick={onCartToggle}
                  className={`flex items-center justify-center p-2 rounded-xl relative border active:scale-95 transition cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-white border-slate-200 hover:bg-slate-50' 
                      : theme === 'dark' 
                      ? 'bg-zinc-900 border-zinc-800' 
                      : 'bg-[#0F2847] border-[#1A3454]'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-[#E88A05]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* Bottom segment action bars (Search + controls), visible ONLY in top expanded view */}
          {!isScrolled && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
              {/* Expanded general search input */}
              <div className="relative w-full md:max-w-lg">
                <span className={`absolute inset-y-0 ${isRtl ? 'left-3.5' : 'right-3.5'} flex items-center pointer-events-none opacity-60`}>
                  <Search className="w-5 h-5 text-zinc-400" />
                </span>
                <input
                  id="store-search-expanded"
                  type="text"
                  placeholder={s.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-3 text-sm rounded-2xl border outline-hidden transition ${
                    isRtl ? 'pl-11 pr-5 text-right' : 'pr-11 pl-5 text-left'
                  } ${
                    theme === 'light'
                      ? 'bg-slate-55 border-slate-200 focus:border-[#E88A05] focus:ring-1 focus:ring-[#E88A05]'
                      : theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500'
                      : 'bg-[#0B1E36] border-[#1A3454] text-stone-100 focus:border-[#E88A05] focus:ring-1 focus:ring-[#E88A05]'
                  }`}
                />
              </div>

              {/* Action buttons controls row */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                {/* Languages selectors */}
                <div 
                  id="language-switcher-expanded"
                  className={`flex items-center gap-1 p-1 rounded-xl border ${
                    theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-black/20 border-white/10'
                  }`}
                >
                  <button onClick={() => setLanguage('ar')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${language === 'ar' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-70 hover:opacity-100'}`}>
                    عربي
                  </button>
                  <button onClick={() => setLanguage('ku')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${language === 'ku' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-70 hover:opacity-100'}`}>
                    کوردی
                  </button>
                  <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-70 hover:opacity-100'}`}>
                    EN
                  </button>
                </div>

                {/* Themes selector */}
                <div 
                  id="theme-switcher-expanded"
                  className={`flex items-center gap-1 p-1 rounded-xl border ${
                    theme === 'light' ? 'bg-slate-100 border-slate-220' : 'bg-black/20 border-white/10'
                  }`}
                >
                  <button onClick={() => setTheme('light')} title={s.themeLight} className={`p-2 rounded-lg transition-all cursor-pointer ${theme === 'light' ? 'bg-[#0B1E36] text-[#E88A05]' : 'opacity-70 hover:opacity-100'}`}>
                    <Sun className="w-4 h-4" />
                  </button>
                  <button onClick={() => setTheme('dark')} title={s.themeDark} className={`p-2 rounded-lg transition-all cursor-pointer ${theme === 'dark' ? 'bg-yellow-500 text-zinc-950' : 'opacity-70 hover:opacity-100'}`}>
                    <Moon className="w-4 h-4" />
                  </button>
                  <button onClick={() => setTheme('system')} title={s.themeSystem} className={`p-2 rounded-lg transition-all cursor-pointer ${theme === 'system' ? 'bg-[#E88A05] text-[#0B1E36]' : 'opacity-70 hover:opacity-100'}`}>
                    <Laptop className="w-4 h-4" />
                  </button>
                </div>

                {/* Cart toggler desktop expanded */}
                <button 
                  id="desktop-cart-expanded"
                  onClick={onCartToggle}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-extrabold rounded-xl border transition-all active:scale-95 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      : theme === 'dark'
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-850'
                      : 'bg-[#0F2847] border-[#1A3454] text-stone-100 hover:bg-[#15345b]'
                  }`}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 text-[#E88A05]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-extrabold text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span>{s.cart}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
