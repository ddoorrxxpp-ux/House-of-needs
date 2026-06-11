import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  User, 
  Phone, 
  MapPin, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, ThemeType, LanguageType, translations } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  theme: ThemeType;
  language: LanguageType;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  theme,
  language
}: CartDrawerProps) {
  const s = translations[language];
  const isRtl = language === 'ar' || language === 'ku';

  // Checkout form fields state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [formError, setFormError] = useState('');

  // Cart math
  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const itemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Construct WhatsApp checkout message body
  const buildWhatsAppMessage = () => {
    const isAr = language === 'ar';
    const isKu = language === 'ku';

    let header = `🛒 *طلب جديد من متجر ${translations.ar.storeName}*`;
    let clientLabel = "👤 *بيانات المستلم:*";
    let nameTxt = `- الاسم: ${name}`;
    let phoneTxt = `- الهاتف: ${phone}`;
    let addrTxt = `- العنوان بالتفصيل: ${address}`;
    let itemsHeader = "\n📦 *المنتجات المطلوبة:*";
    let totalLabel = "💰 *المجموع الكلي للطلب:*";
    let footer = "\n🔔 الدفع نقداً عند الاستلام مع فحص الطلب باليد. شكراً لتسوقكم معنا!";

    if (isKu) {
      header = `🛒 *داواکاری نوێ لە بەیتی ئەل-حاجات*`;
      clientLabel = "👤 *زانیاری وەرگر:*";
      nameTxt = `- ناو: ${name}`;
      phoneTxt = `- تەلەفۆن: ${phone}`;
      addrTxt = `- ناونیشان: ${address}`;
      itemsHeader = "\n📦 *لیستی کاڵاکان:*";
      totalLabel = "💰 *کۆی گشتی داواکاری:*";
      footer = "\n🔔 پارەدان لەکاتی وەرگرتن و بینینی کاڵاکە. سوپاس بۆ کڕینەکەتان!";
    } else if (language === 'en') {
      header = `🛒 *New Order from ${translations.en.storeName}*`;
      clientLabel = "👤 *Recipient Details:*";
      nameTxt = `- Name: ${name}`;
      phoneTxt = `- Phone: ${phone}`;
      addrTxt = `- Address: ${address}`;
      itemsHeader = "\n📦 *Order Items:*";
      totalLabel = "💰 *Subtotal Price:*";
      footer = "\n🔔 Payment Method: Cash on Delivery with manual check of the items. Thank you!";
    }

    let itemsStr = "";
    cartItems.forEach((item, index) => {
      const prodName = item.product[`name_${language}`] || item.product.name_en;
      const unitPrice = item.product.price.toLocaleString();
      const subtotal = (item.product.price * item.quantity).toLocaleString();
      itemsStr += `\n${index + 1}. ${prodName}\n   الكمية (Qty): ${item.quantity} | السعر: ${unitPrice} ${s.iqd}\n   الكلي (Sub): ${subtotal} ${s.iqd}`;
    });

    const body = `${header}\n\n${clientLabel}\n${nameTxt}\n${phoneTxt}\n${addrTxt}\n${itemsHeader}${itemsStr}\n\n${totalLabel} *${cartTotal.toLocaleString()} ${s.iqd}*\n${footer}`;
    return body;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name || name.trim().length < 3) {
      setFormError(language === 'ar' ? 'الرجاء إدخال الاسم الكامل الثلاثي بالتفصيل' : language === 'ku' ? 'تکایە ناوی تەواو بە روونی بنووسە' : 'Please input a valid recipient complete name');
      return;
    }

    if (!phone || phone.trim().length < 8) {
      setFormError(language === 'ar' ? 'الرجاء إدخال رقم هاتف واتساب عراقي فعال للتوجيه' : language === 'ku' ? 'تکایە ژمارەی مۆبایلی وەتسئەپ بنووسە' : 'Please input a valid active contact number');
      return;
    }

    if (!address || address.trim().length < 6) {
      setFormError(language === 'ar' ? 'الرجاء كتابة المحافظة والمحلة أو المنطقة بالتفصيل للتنسيق مع سائق الدليفري' : language === 'ku' ? 'تکایە ناونیشانی ورد بنووسە بۆ شۆفێری گەیاندن' : 'Please input a detailed physical address');
      return;
    }

    // Build query & route
    const rawMessage = buildWhatsAppMessage();
    const encoded = encodeURIComponent(rawMessage);
    const storeWhatsAppNumber = "9647829071777";
    const finalUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encoded}`;

    // Dynamic redirect to WhatsApp API
    window.open(finalUrl, '_blank');
  };

  // Color scheme bindings
  const isLight = theme === 'light';
  const isDark = theme === 'dark';

  const drawerBg = isLight 
    ? "bg-slate-55 text-slate-800" 
    : isDark 
    ? "bg-zinc-950 text-zinc-100" 
    : "glass text-stone-100 shadow-2xl backdrop-blur-xl border-[#E88A05]/20";

  const headBg = isLight ? "bg-slate-100/90" : isDark ? "bg-zinc-900/90" : "bg-[#162D4A]/90 backdrop-blur-md";
  const itemBorder = isLight ? "border-slate-100" : isDark ? "border-zinc-800" : "border-[#E88A05]/20";
  const rowItemBg = isLight ? "bg-white" : isDark ? "bg-zinc-900" : "bg-[#162D4A]/50 backdrop-blur-md";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Backdrop Layer with Fade-In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-45"
          />

          {/* Sliding Side Container Drawer Panel with physical layout direction checks */}
          <motion.div
            id="shopping-cart-drawer"
            dir={isRtl ? "rtl" : "ltr"}
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} z-50 w-full sm:max-w-md h-full flex flex-col shadow-2xl border-l ${itemBorder} ${drawerBg}`}
          >
            {/* Header section inside panel */}
            <div className={`p-5 flex items-center justify-between border-b ${itemBorder} ${headBg}`}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#E88A05]" />
                <h2 className="text-xl font-bold tracking-tight">
                  {s.cart}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-yellow-500/10 text-[#E88A05] rounded-md border border-[#E88A05]/20">
                  {itemsCount} {s.items}
                </span>
              </div>
              
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-500/10 transition cursor-pointer"
                aria-label="Close Shopping Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core shopping list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              {!showCheckout ? (
                // Display cart listing
                cartItems.length === 0 ? (
                  <div className="h-[70vh] flex flex-col items-center justify-center text-center opacity-80 gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-500/10 flex items-center justify-center border border-[#E88A05]/15">
                      <ShoppingBag className="w-10 h-10 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium tracking-wide max-w-[280px]">
                      {s.cartEmpty}
                    </p>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E88A05] text-[#0B1E36] active:scale-95 transition"
                    >
                      {s.allCategories}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const prodName = item.product[`name_${language}`] || item.product.name_en;
                      const subtotal = item.product.price * item.quantity;
                      
                      return (
                        <div
                          key={item.product.id}
                          id={`cart-item-${item.product.id}`}
                          className={`p-3.5 rounded-2xl border flex gap-3.5 transition items-center relative ${itemBorder} ${rowItemBg}`}
                        >
                          {/* Image Box */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-500/10 shrink-0 border border-slate-500/10 select-none">
                            <img
                              src={item.product.imageUrl}
                              alt={prodName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          {/* Data Details column */}
                          <div className="flex-1 min-w-0 pr-1 select-none">
                            <h4 className="text-xs sm:text-sm font-bold truncate">
                              {prodName}
                            </h4>
                            <span className="text-[10px] text-zinc-500">
                              {item.product.category}
                            </span>
                            <div className="flex items-center justify-between mt-2 gap-2">
                              {/* Quantity Editors */}
                              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-500/10 border border-slate-600/10">
                                <button
                                  onTouchStart={() => {}}
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 rounded-md hover:bg-slate-500/20 text-[#E88A05]"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold px-1.5 min-w-[16px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onTouchStart={() => {}}
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 rounded-md hover:bg-slate-500/20 text-[#E88A05]"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Price unit display */}
                              <span className="text-xs font-black text-[#E88A05]">
                                {subtotal.toLocaleString()} {s.iqd}
                              </span>
                            </div>
                          </div>

                          {/* Delete Item shortcut */}
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1 text-red-400 hover:text-red-500 rounded-md transition hover:bg-red-500/10 self-center shrink-0 cursor-pointer"
                            aria-label="Remove item from drawer"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Delivery notice */}
                    <div className="p-3.5 rounded-xl border border-yellow-500/25 bg-yellow-500/5 text-yellow-300 text-xs leading-relaxed flex gap-2 mt-4 select-none">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-400" />
                      <span>{s.cartDisclaimer}</span>
                    </div>

                    {/* Cash checkout safety guarantee info box */}
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs leading-relaxed flex gap-2 select-none">
                      <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                      <span>{s.paymentDisclaimer}</span>
                    </div>
                  </div>
                )
              ) : (
                // Display checkout form
                <form id="whatsapp-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 pt-1">
                  <div className="p-4 rounded-xl border border-[#1A3454] bg-[#0F2847]/60 text-xs leading-relaxed">
                    <p className={isLight ? "text-slate-600" : "text-stone-300"}>
                      {s.checkoutDesc}
                    </p>
                  </div>

                  {/* Form Error Field */}
                  {formError && (
                    <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold">
                      ⚠ {formError}
                    </div>
                  )}

                  {/* Customer name input field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold flex items-center gap-1.5 opacity-85">
                      <User className="w-4 h-4 text-[#E88A05]" />
                      <span>{s.customerName} *</span>
                    </label>
                    <input
                      id="input-customer-name"
                      type="text"
                      required
                      placeholder={language === 'ar' ? "علي كاظم الموسوي" : language === 'ku' ? "ئاراس فتاح عومەر" : "E.g. Ali Ahmed Al-Hassan"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-hidden transition ${
                        isRtl ? 'text-right' : 'text-left'
                      } ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 text-slate-900 focus:border-[#E88A05]'
                          : theme === 'dark'
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-yellow-500'
                          : 'bg-[#0B1E36] border-[#1A3454] text-stone-100 focus:border-[#E88A05]'
                      }`}
                    />
                  </div>

                  {/* Customer phone input field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold flex items-center gap-1.5 opacity-85">
                      <Phone className="w-4 h-4 text-[#E88A05]" />
                      <span>{s.phoneNumber} *</span>
                    </label>
                    <input
                      id="input-customer-phone"
                      type="tel"
                      required
                      placeholder="078xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-hidden transition ${
                        isRtl ? 'text-right' : 'text-left'
                      } ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 text-slate-900 focus:border-[#E88A05]'
                          : theme === 'dark'
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-yellow-500'
                          : 'bg-[#0B1E36] border-[#1A3454] text-stone-100 focus:border-[#E88A05]'
                      }`}
                    />
                  </div>

                  {/* Customer address input field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold flex items-center gap-1.5 opacity-85">
                      <MapPin className="w-4 h-4 text-[#E88A05]" />
                      <span>{s.deliveryAddress} *</span>
                    </label>
                    <textarea
                      id="input-delivery-address"
                      required
                      rows={3}
                      placeholder={language === 'ar' ? 'بغداد - الكرادة - شارع العرصات قرب صيدلية...' : language === 'ku' ? 'سلێمانی - جادەی سالم - بەرامبەر سەنتەری...' : 'Baghdad, Mansour, Street 14, Near...'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-hidden transition ${
                        isRtl ? 'text-right' : 'text-left'
                      } ${
                        theme === 'light'
                          ? 'bg-white border-slate-200 text-slate-900 focus:border-[#E88A05]'
                          : theme === 'dark'
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-yellow-500'
                          : 'bg-[#0B1E36] border-[#1A3454] text-stone-100 focus:border-[#E88A05]'
                      }`}
                    />
                  </div>

                  {/* Return block or trigger */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <button
                      id="back-cart-btn"
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 py-3 text-xs font-bold rounded-xl border border-slate-500/20 active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      {isRtl ? <ArrowRight className="w-4.5 h-4.5" /> : <ArrowLeft className="w-4.5 h-4.5" />}
                      <span>{s.cancel}</span>
                    </button>

                    <button
                      id="submit-whatsapp-btn"
                      type="submit"
                      className={`flex-[2] py-3 text-xs font-bold rounded-xl active:scale-95 transition flex items-center justify-center gap-1.5 shadow-md ${
                        theme === 'light'
                          ? 'bg-[#0B1E36] text-white hover:bg-slate-800'
                          : theme === 'dark'
                          ? 'bg-yellow-500 text-zinc-950 font-black hover:bg-yellow-400'
                          : 'bg-[#E88A05] text-[#0B1E36] font-extrabold hover:bg-[#FF9B0D] glow-accent font-serif tracking-wider'
                      }`}
                    >
                      <ShoppingBag className="w-4.5 h-4.5 animate-pulse" />
                      <span>{s.placeOrderWhatsapp}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sticky bottom summary actions (calculated grand price and checkout/whatsapp trigger bounds) */}
            {cartItems.length > 0 && (
              <div className={`p-5 border-t shrink-0 ${itemBorder} ${headBg}`}>
                <div className="flex items-center justify-between gap-4 mb-4 select-none">
                  <div className="flex flex-col">
                    <span className={`text-xs uppercase font-semibold opacity-65 ${
                      isLight ? 'text-slate-500' : 'text-stone-300'
                    }`}>
                      {s.total}
                    </span>
                    <span className="text-2xl font-black text-[#E88A05]">
                      {cartTotal.toLocaleString()} <span className="text-sm font-bold">{s.iqd}</span>
                    </span>
                  </div>

                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
                    ✓ COD {s.iqd}
                  </span>
                </div>

                {!showCheckout ? (
                  // Trigger Checkout form visibility
                  <button
                    id="trigger-form-btn"
                    onClick={() => setShowCheckout(true)}
                    className={`w-full py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#0B1E36] text-white hover:bg-slate-800'
                        : theme === 'dark'
                        ? 'bg-yellow-500 text-zinc-950 hover:bg-yellow-400 shadow-yellow-500/10'
                        : 'bg-[#E88A05] text-[#0B1E36] hover:bg-[#FF9B0D] glow-accent font-serif tracking-wider'
                    }`}
                  >
                    <span>{s.checkout}</span>
                    {isRtl ? <ArrowLeft className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
                  </button>
                ) : null}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
