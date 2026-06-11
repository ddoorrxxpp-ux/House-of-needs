import { Star, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ThemeType, LanguageType, translations } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  theme: ThemeType;
  language: LanguageType;
  onAddToCart: (p: Product) => void;
}

export default function ProductCard({
  product,
  theme,
  language,
  onAddToCart
}: ProductCardProps) {
  const s = translations[language];
  const isRtl = language === 'ar' || language === 'ku';

  // Get localized names and descriptions
  const name = product[`name_${language}`] || product.name_en;
  const description = product[`description_${language}`] || product.description_en || "";

  // Dynamic Theme mappings for styles
  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  
  // Custom theme classes
  const cardBg = isLight 
    ? "bg-white border border-slate-100 hover:shadow-2xl hover:border-slate-300"
    : isDark
    ? "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:shadow-yellow-500/5"
    : "glass hover:border-[#E88A05]/50 hover:shadow-2xl hover:shadow-[#E88A05]/15 hover:glow-accent";

  const btnBg = isLight
    ? "bg-[#0B1E36] text-[#E88A05] hover:bg-slate-800 transition shadow-xs"
    : isDark
    ? "bg-yellow-500 text-zinc-950 font-extrabold hover:bg-yellow-400 shadow-md"
    : "bg-[#E88A05] text-[#0B1E36] font-black hover:bg-[#FF9B0D] shadow-lg glow-accent transition-all";

  const textMuted = isLight ? "text-slate-500" : isDark ? "text-zinc-400" : "text-stone-300 font-serif";
  const textTitle = isLight ? "text-slate-900" : isDark ? "text-zinc-100" : "text-stone-100 font-serif";
  const ratingColor = isLight ? "text-amber-500 fill-amber-500" : isDark ? "text-yellow-400 fill-yellow-400" : "text-[#E88A05] fill-[#E88A05]";

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`flex flex-col h-full rounded-3xl overflow-hidden transition-all relative ${cardBg}`}
    >
      {/* Product Image Holder */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-500/10 self-center">
        <img
          id={`product-image-${product.id}`}
          referrerPolicy="no-referrer"
          src={product.imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
          loading="lazy"
        />
        
        {/* Localized Category Badge overlay */}
        <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg shadow-md backdrop-blur-md ${
          theme === 'light'
            ? 'bg-slate-900/80 text-[#E88A05]'
            : theme === 'dark'
            ? 'bg-zinc-950/80 text-yellow-500 border border-zinc-800'
            : 'bg-[#0B1E36]/80 text-[#E88A05] border border-[#1A3454]'
        }`}>
          {product.category}
        </span>

        {/* Localized Availability Badge overlay */}
        <span className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} px-2 py-0.5 rounded-md flex items-center gap-1 text-[9px] font-bold shadow-md backdrop-blur-md ${
          product.inStock 
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/35'
            : 'bg-red-500/15 text-red-400 border border-red-500/35'
        }`}>
          {product.inStock ? (
            <>
              <CheckCircle className="w-3 h-3" />
              <span>{s.inStock}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3" />
              <span>{s.outOfStock}</span>
            </>
          )}
        </span>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Rating stars row */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating || 5) 
                  ? ratingColor 
                  : 'text-zinc-600/30'
              }`}
            />
          ))}
          <span className={`text-[10px] font-bold ${textMuted} ml-1`}>
            ({product.rating || 5.0})
          </span>
        </div>

        {/* Product translate name */}
        <h3 className={`text-base sm:text-lg font-bold tracking-tight mb-2.5 leading-snug line-clamp-2 ${textTitle}`}>
          {name}
        </h3>

        {/* Short details translate info */}
        <p className={`text-xs leading-relaxed mb-4 line-clamp-3 ${textMuted}`}>
          {description}
        </p>

        {/* Price and add action line */}
        <div className="mt-auto pt-3 border-t border-slate-500/10 flex items-center justify-between gap-2">
          {/* Price label */}
          <div className="flex flex-col">
            <span className={`text-xs font-semibold uppercase opacity-65 ${textMuted}`}>
              {s.total}
            </span>
            <span className={`text-lg sm:text-xl font-black ${
              theme === 'system' ? 'text-[#E88A05]' : theme === 'dark' ? 'text-yellow-400' : 'text-[#0B1E36]'
            }`}>
              {product.price.toLocaleString()} <span className="text-xs font-bold">{s.iqd}</span>
            </span>
          </div>

          {/* Add to Cart button */}
          <motion.button
            id={`add-btn-${product.id}`}
            onClick={() => product.inStock && onAddToCart(product)}
            disabled={!product.inStock}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${btnBg}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{s.add_to_cart}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
