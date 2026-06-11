import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Grid,
  Sparkles,
  Zap,
  Hammer,
  Notebook,
  Clock,
  Palette,
  Gamepad2,
  Gem,
  CheckCircle,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Product, 
  LayoutConfig, 
  ThemeType, 
  LanguageType, 
  CartItem, 
  translations 
} from './types';
import { 
  fetchProductsFromDB, 
  fetchLayoutConfigFromDB, 
  fetchMainConfigFromDB,
  seedDatabaseIfEmpty
} from './dbService';
import { testConnection } from './firebase';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';

// Static Category Keys list
const CATEGORIES = [
  "Electrical",
  "Construction",
  "Stationery",
  "Clocks",
  "Art/Decor",
  "Toys",
  "Perfumes",
  "Accessories"
];

// Helper to render matched category icons
const renderCategoryIcon = (category: string) => {
  const cn = "w-4 h-4 sm:w-5 sm:h-5 text-[#E88A05]";
  switch (category) {
    case "Electrical": return <Zap className={cn} />;
    case "Construction": return <Hammer className={cn} />;
    case "Stationery": return <Notebook className={cn} />;
    case "Clocks": return <Clock className={cn} />;
    case "Art/Decor": return <Palette className={cn} />;
    case "Toys": return <Gamepad2 className={cn} />;
    case "Perfumes": return <Sparkles className={cn} />;
    case "Accessories": return <Gem className={cn} />;
    default: return <Grid className={cn} />;
  }
};

export default function App() {
  // Operational state fields
  const [theme, setTheme] = useState<ThemeType>('system'); // Default system preference
  const [language, setLanguage] = useState<LanguageType>('ar'); // Default Arabic
  const [products, setProducts] = useState<Product[]>([]);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(''); // Dynamic URL from site_settings/main_config
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Track system theme preferences dynamically
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemPrefersDark]);

  // 1. Initial Connection Validations & Firestore Data Load
  useEffect(() => {
    // Audit Firestore connection
    testConnection();

    const loadAllDatabaseContent = async () => {
      try {
        setIsLoading(true);
        // Load layout config
        let layout = await fetchLayoutConfigFromDB();
        // Load items dataset
        let prods = await fetchProductsFromDB();
        // Load site_settings/main_config
        let mainConf = await fetchMainConfigFromDB();

        // If Firestore database is completely blank, trigger an automated seed routine
        if (!prods.length || !layout || !mainConf) {
          console.log("Empty Firestore datasets detected, beginning auto-seeding routine...");
          await seedDatabaseIfEmpty();
          prods = await fetchProductsFromDB();
          layout = await fetchLayoutConfigFromDB();
          mainConf = await fetchMainConfigFromDB();
        }

        setProducts(prods);
        if (layout) {
          setLayoutConfig(layout);
        }
        if (mainConf && mainConf.logoUrl !== undefined) {
          setLogoUrl(mainConf.logoUrl);
        }
      } catch (err) {
        console.error("Critical error during layout/product hydration:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllDatabaseContent();
  }, []);

  // Show a brief toast notification on item action
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  // 2. Shopping Cart actions
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        showToast(language === 'ar' ? `تم تحديث كمية المنتج في عربتك` : language === 'ku' ? `میقداری کاڵاکەت زیادکرا` : `Updated ${product.name_en} quantity`);
        return prevItems.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showToast(language === 'ar' ? `تم إضافة المنتج بنجاح لعربتك` : language === 'ku' ? `کاڵاکە خرایە ناو سەبەتەکەت` : `Added ${product.name_en} to cart`);
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => {
      const matched = prevItems.find((item) => item.product.id === productId);
      if (matched) {
        showToast(language === 'ar' ? `تم إزالة المنتج من العربة` : language === 'ku' ? `کاڵاکە لە سەبەتەکە لابرا` : `Removed item from cart`);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  // 3. Search and Category filter pipelines
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Filter by category
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      
      // Filter by search terms matching ar/ku/en titles
      const query = searchTerm.toLowerCase().trim();
      if (!query) return matchesCategory;

      const nameAr = (p.name_ar || '').toLowerCase();
      const nameKu = (p.name_ku || '').toLowerCase();
      const nameEn = (p.name_en || '').toLowerCase();
      const descAr = (p.description_ar || '').toLowerCase();
      const descKu = (p.description_ku || '').toLowerCase();
      const descEn = (p.description_en || '').toLowerCase();

      const matchesSearch = nameAr.includes(query) || 
                            nameKu.includes(query) || 
                            nameEn.includes(query) ||
                            descAr.includes(query) ||
                            descKu.includes(query) ||
                            descEn.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Total amount computed
  const cartTotalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const s = translations[language];
  const isRtl = language === 'ar' || language === 'ku';

  // Build appropriate layout direction container classes & dynamic styling
  const isLight = resolvedTheme === 'light';
  const isDark = resolvedTheme === 'dark';

  const bodyBgClass = isLight 
    ? "bg-slate-55 text-slate-800" 
    : isDark 
    ? "bg-[#0c0d0f] text-zinc-100" 
    : "bg-[#0B1E36] text-stone-100 font-sans selection:bg-[#E88A05]/30";

  const containerBgClass = isLight
    ? "bg-white text-slate-900 border border-slate-200"
    : isDark
    ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
    : "bg-gradient-to-l from-[#162D4A] to-[#0B1E36] text-stone-100 border border-[#E88A05]/20 glass shadow-2xl";

  const categoryBtnActive = isLight
    ? "bg-[#0B1E36] text-[#E88A05] border border-[#E88A05]/30 shadow-md font-bold"
    : isDark
    ? "bg-yellow-500 text-zinc-950 border border-yellow-400/35 shadow-lg font-bold"
    : "bg-amber-500 text-[#0B1E36] border border-[#E88A05] glow-accent shadow-xl font-bold";

  const categoryBtnInactive = isLight
    ? "bg-slate-100/90 text-slate-700 hover:bg-slate-200"
    : isDark
    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-850"
    : "glass text-stone-200 hover:border-[#E88A05]/40 transition-colors";

  const spinnerColor = isLight ? "border-[#0B1E36]" : isDark ? "border-yellow-500" : "border-[#E88A05]";

  // Fallback defaults for missing logo / announcement strings
  const activeLogo = layoutConfig?.storeLogo || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12 text-[#E88A05]" fill="currentColor"><path d="M50 8.5C51.6 8.5 53.1 9.3 54.1 10.7L82.1 48.7C83.8 51 82.1 54.3 79.2 54.3H72.1V82.3C72.1 84.5 70.3 86.3 68.1 86.3H56.1V64.3H43.9V86.3H31.9C29.7 86.3 27.9 84.5 27.9 82.3V54.3H20.8C17.9 54.3 16.2 51 17.9 48.7L45.9 10.7C46.9 9.3 48.4 8.5 50 8.5V8.5Z"/></svg>`;
  const activeBanner = layoutConfig ? layoutConfig[`bannerText_${language}`] : s.loading;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={`min-h-screen flex flex-col transition-all duration-300 ${bodyBgClass}`}>
      
      {/* Central Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-55 bg-emerald-500 text-slate-950 font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-300/35"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core Navigation bar */}
      <Header
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        cartCount={cartTotalCount}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        logoSvg={activeLogo}
        logoUrl={logoUrl}
        bannerText={activeBanner}
      />

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* Dynamic Interactive Catalog Loading State */}
        {isLoading ? (
          <div className="flex-1 h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
            <div className={`w-14 h-14 rounded-full border-4 ${spinnerColor} border-t-transparent animate-spin`} />
            <p className="text-sm font-semibold animate-pulse tracking-wide opacity-80 mt-1">
              {s.loading}
            </p>
          </div>
        ) : (
          <>
            {/* Elegant Hero / Branding Visualizer Box */}
            <div 
              id="branding-hero-box"
              className={`p-6 sm:p-10 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-6 justify-between border relative overflow-hidden transition-all duration-350 select-none ${containerBgClass}`}
            >
              {/* Absolutes for visual aesthetics */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#E88A05]/5 rounded-full filter blur-xl" />
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-yellow-500/5 rounded-full filter blur-2xl" />

              <div className="flex flex-col gap-2.5 max-w-xl text-center md:text-right">
                <span className="text-[10px] uppercase tracking-widest font-black text-[#E88A05] flex items-center gap-1 justify-center md:justify-start">
                  <span>{language === 'ar' ? "أرقى المنتجات والأجهزة" : language === 'ku' ? "کوالێتی نایاب و بێ هاوتا" : "PREMIUM IRAQ IMPORTS"}</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {s.storeName}
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-stone-300'}`}>
                  {s.slogan}
                </p>
              </div>

              {/* Promo graphics card */}
              <div className="hidden sm:flex flex-col gap-1 items-end bg-black/10 px-5 py-4 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#E88A05]">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>{language === 'ar' ? 'سيرفر الدفع بالدينار العراقي' : language === 'ku' ? 'تەواوی پارێزگاکان' : 'IQD Currency Synced'}</span>
                </div>
                <span className="text-[10px] opacity-75 mt-1 text-right max-w-[200px]">
                  {language === 'ar' ? 'تحديث الأسعار فوري ومباشر مع السوق المحلي بغداد/أربيل' : language === 'ku' ? 'تیرواردکردنی نرخەکان راستەوخۆ لە بازاری عیراق' : 'Instant market-rate syncing (Baghdad/Erbil)'}
                </span>
              </div>
            </div>

            {/* Sub-Header / Filters Menu Segment */}
            <div id="filter-wrapper" className="mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold tracking-tight uppercase flex items-center gap-1.5">
                  <span>{s.categoryTitle}</span>
                </h3>
                {searchTerm && (
                  <span className="text-xs font-semibold px-2 py-1 bg-red-500/10 text-red-400 rounded-md">
                    🔍 {searchTerm}
                  </span>
                )}
              </div>

              {/* Horizontal Scrollable Categories Container */}
              <div 
                id="categories-chips-belt"
                className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 select-none scrollbar-thin max-w-full"
              >
                {/* 'All Categories' switch */}
                <button
                  id="category-btn-all"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 cursor-pointer border ${
                    selectedCategory === 'All' ? categoryBtnActive : categoryBtnInactive
                  }`}
                >
                  <Grid className="w-4.5 h-4.5" />
                  <span>{s.allCategories}</span>
                </button>

                {/* Sub-categories loop */}
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  
                  return (
                    <button
                      key={cat}
                      id={`category-btn-${cat.toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 cursor-pointer border ${
                        isActive ? categoryBtnActive : categoryBtnInactive
                      }`}
                    >
                      {renderCategoryIcon(cat)}
                      <span>
                        {language === 'ar' 
                          ? cat === 'Electrical' ? 'كهربائيات' : cat === 'Construction' ? 'إنشائية وبناء' : cat === 'Stationery' ? 'قرطاسية' : cat === 'Clocks' ? 'ساعات' : cat === 'Art/Decor' ? 'لوحات وتحف' : cat === 'Toys' ? 'ألعاب أطفال' : cat === 'Perfumes' ? 'العطور والمكياج' : 'إكسسوارات'
                          : language === 'ku'
                          ? cat === 'Electrical' ? 'کارەبایی' : cat === 'Construction' ? 'ئاواکاری' : cat === 'Stationery' ? 'نووسینگە' : cat === 'Clocks' ? 'کاتژمێر' : cat === 'Art/Decor' ? 'هونەر و دیکۆر' : cat === 'Toys' ? 'یاری منداڵان' : cat === 'Perfumes' ? 'بۆنەکان' : 'ئێکسسوارات'
                          : cat
                        }
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products catalog listing grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex-1 py-16 flex flex-col items-center justify-center text-center opacity-80 gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center border border-red-500/10">
                  <ShoppingBag className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-sm font-bold mt-1">
                  {s.noProducts}
                </p>
              </div>
            ) : (
              <div 
                id="products-showcase-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 flex-grow"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      theme={theme}
                      language={language}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer detailing cash policies, app credentials, and direct developer controls */}
      <footer className={`py-8 px-6 mt-16 text-center border-t transition select-none ${
        isLight 
          ? 'bg-slate-100 border-slate-200 text-slate-600'
          : isDark
          ? 'bg-zinc-950 border-zinc-900 text-zinc-400'
          : 'bg-[#061426] border-[#132E52] text-stone-400'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <span className="text-sm font-black text-[#E88A05]">
              {s.storeName} © 2026
            </span>
            <span className="text-[10px] opacity-75">
              Premium Household, Electrical, and Professional Accessories Marketplace in Iraq
            </span>
          </div>

        </div>
      </footer>

      {/* Slide open sliding-cart side drawer panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        theme={theme}
        language={language}
      />
    </div>
  );
}
