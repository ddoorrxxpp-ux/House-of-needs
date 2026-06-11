export interface Product {
  id: string;
  name_ar: string;
  name_ku: string;
  name_en: string;
  description_ar?: string;
  description_ku?: string;
  description_en?: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating?: number;
}

export interface LayoutConfig {
  id: string;
  storeLogo: string;
  bannerText_ar: string;
  bannerText_ku: string;
  bannerText_en: string;
}

export type ThemeType = "light" | "dark" | "system";
export type LanguageType = "ar" | "ku" | "en";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LanguageStrings {
  storeName: string;
  slogan: string;
  cart: string;
  checkout: string;
  items: string;
  total: string;
  add_to_cart: string;
  categories: string;
  searchPlaceholder: string;
  inStock: string;
  outOfStock: string;
  paymentDisclaimer: string;
  allCategories: string;
  whatsappCheckout: string;
  checkoutFormTitle: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  placeOrderWhatsapp: string;
  cancel: string;
  loading: string;
  noProducts: string;
  iqd: string;
  cartEmpty: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  checkoutDesc: string;
  seedDb: string;
  seeding: string;
  categoryTitle: string;
  cartDisclaimer: string;
}

export const translations: Record<LanguageType, LanguageStrings> = {
  ar: {
    storeName: "بيت الحاجيات",
    slogan: "شريككم الأمثل لكل ما يحتاجه المنزل والعمل بأعلى الفخامة والجودة",
    cart: "عربة التسوق",
    checkout: "إتمام الشراء",
    items: "مواد",
    total: "المجموع الكلي",
    add_to_cart: "إضافة للعربة",
    categories: "الأقسام",
    searchPlaceholder: "البحث عن منتج بالاسم...",
    inStock: "متوفر في المخزن",
    outOfStock: "نفذت الكمية",
    paymentDisclaimer: "الدفع عند الاستلام فقط في جميع محافظات العراق",
    allCategories: "الكل",
    whatsappCheckout: "إتمام مع واتساب",
    checkoutFormTitle: "بيانات التوصيل وإتمام الطلب",
    customerName: "الاسم الكامل للمستلم",
    phoneNumber: "رقم هاتف الاتصال والواتساب",
    deliveryAddress: "عنوان التوصيل بالتفصيل (المحافظة والمنطقة)",
    placeOrderWhatsapp: "إرسال الطلب عبر واتساب",
    cancel: "إلغاء",
    loading: "جاري التحميل والمزامنة مع السيرفر العراقي...",
    noProducts: "لم يتم العثور على أي منتج يطابق هذا المسمى",
    iqd: "د.ع",
    cartEmpty: "العربة فارغة، تسوّق الآن واملأها بمستلزماتك",
    themeLight: "مود ناصع",
    themeDark: "مود ليلي",
    themeSystem: "مود تلقائي (النظام)",
    checkoutDesc: "يرجى ملء النموذج أدناه لتنظيم طلبك وتحضيره فوراً ثم إرساله لخدمة الزبائن لدينا عبر الواتساب لتأكيد الاستلام والتوصيل.",
    seedDb: "تغذية قاعدة البيانات تلقائياً",
    seeding: "جاري الحقن والتعبئة...",
    categoryTitle: "تصفح حسب فئات المنتجات",
    cartDisclaimer: "سعر التوصيل يضاف لاحقاً حسب المحافظة (من 3,000 إلى 5,000 د.ع)"
  },
  ku: {
    storeName: "بەیتی ئەل-حاجات",
    slogan: "باشترین هاوبەشتان بۆ پێداویستییەکانی ماڵ و کار بە فەخامەتترین جۆر",
    cart: "سەبەتەی کڕین",
    checkout: "تەواوکردنی کڕین",
    items: "پێداویست",
    total: "کۆی گشتی",
    add_to_cart: "خستنە نێو سەبەتە",
    categories: "بەشەکان",
    searchPlaceholder: "گەڕان بەدوای دیزاین یان بابەت...",
    inStock: "بەردەستە لە کۆگا",
    outOfStock: "تەواو بووە",
    paymentDisclaimer: "شێوازی پارەدان لە کاتی وەرگرتن تەنها لە هەموو پارێزگاکانی عێراق",
    allCategories: "هەمووی",
    whatsappCheckout: "تەواوکردن لەگەڵ وەتسئەپ",
    checkoutFormTitle: "زانیاری گەیاندن و سپاردنی داواکاری",
    customerName: "ناوی تەواوی وەرگر",
    phoneNumber: "ژمارەی تەلەفۆن یان وەتسئەپ",
    deliveryAddress: "ناونیشانی گەیاندن بە وردی (شار و گەڕەک)",
    placeOrderWhatsapp: "ناردنی داواکاری بە وەتسئەپ",
    cancel: "پاشگەزبوونەوە",
    loading: "کاردەکات لەسەر هێنانی زانیارییەکان لە داتابەیس...",
    noProducts: "هیچ کاڵایەک نەدۆزرایەوە کە بگونجێت لەگەڵ گەڕانەکەت",
    iqd: "د.ع",
    cartEmpty: "سەبەتەکەت بەتاڵە، ئێستە پێداویستییەکانت زیاد بکە",
    themeLight: "شێوازی ڕووناک",
    themeDark: "شێوازی تاریک",
    themeSystem: "سیستەمی ئامێر",
    checkoutDesc: "تکایە ئەم فۆرمەی خوارەوە پڕ بکەرەوە بۆ ڕێکخستنی داواکارییەکەت و ناردنی بۆ ڕاژەی کڕیاران لە ڕێگەی وەتسئەپەوە بۆ خێراکردنی گەیاندن.",
    seedDb: "بارکردنی زانیاری داتابەیس بە شێوەی خۆکار",
    seeding: "خەریکی بارکردنە...",
    categoryTitle: "گەڕان بەپێی بەشەکانی کاڵا",
    cartDisclaimer: "کرێی گەیاندن پاشان زیاد دەکرێت بەپێی پارێزگاکان (٣,٠٠٠ بۆ ٥,٠٠٠ دینار)"
  },
  en: {
    storeName: "Bayt Al-Hajat",
    slogan: "Your ultimate premier partner for home & professional items of high-end quality",
    cart: "Shopping Cart",
    checkout: "Checkout",
    items: "items",
    total: "Grand Total",
    add_to_cart: "Add to Cart",
    categories: "Categories",
    searchPlaceholder: "Search products by name...",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    paymentDisclaimer: "Cash on delivery available across all Iraq governorates",
    allCategories: "All Products",
    whatsappCheckout: "Checkout to WhatsApp",
    checkoutFormTitle: "Delivery Details & Order Placement",
    customerName: "Recipient's Complete Name",
    phoneNumber: "Contact & WhatsApp Number",
    deliveryAddress: "Detailed Delivery Address (Governorate & Area)",
    placeOrderWhatsapp: "Submit Order to WhatsApp",
    cancel: "Cancel",
    loading: "Loading and syncing database...",
    noProducts: "No products matched your active filters",
    iqd: "IQD",
    cartEmpty: "Your cart is empty. Start shopping now to add premium essentials!",
    themeLight: "Pure Light Mode",
    themeDark: "Deep Dark Mode",
    themeSystem: "System Default Theme",
    checkoutDesc: "Fill in the fast delivery form below to instantly organize and transmit your cart items to our direct WhatsApp agent for prompt arrival.",
    seedDb: "Auto-Seed Firestore Database",
    seeding: "Seeding products...",
    categoryTitle: "Browse by Product Categories",
    cartDisclaimer: "Delivery fee added later based on governorate (3,000 to 5,000 IQD)"
  }
};

export const categoryIcons: Record<string, string> = {
  "Electrical": "Zap",
  "Construction": "Hammer",
  "Stationery": "Notebook",
  "Clocks": "Clock",
  "Art/Decor": "Palette",
  "Toys": "Gamepad2",
  "Perfumes": "Sparkles",
  "Accessories": "Gem"
};
