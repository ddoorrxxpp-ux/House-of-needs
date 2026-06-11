import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product, LayoutConfig } from './types';

// Structured seed products dataset for 'Bayt Al-Hajat'
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-fan-01",
    name_ar: "مروحة شحن ذكية فخمة",
    name_ku: "پانکەی بارگاوی زیرەکی فەخم",
    name_en: "Smart Premium Rechargeable Fan",
    description_ar: "مروحة شحن ذكية برأس مغناطيسي متطور، وبطارية ليثيوم تدوم لـ 12 ساعة متواصلة مع منفذ شحن USB ذكي وجهاز تحكم ومؤقت ذاتي.",
    description_ku: "پانکەی بارگاوی زیرەک بەسەری موگناتیسی پێشکەوتوو، و پاتری لیسیۆم کە بۆ ١٢ کاتژمێر کاردەکات لەگەڵ دەرچەی USB و کۆنترۆڵ.",
    description_en: "Ultra-quiet smart pedestal rechargeable fan featuring a dual magnetic core, 12-hour high capacity lithium cell, smart USB device charger, and complete wireless remote.",
    price: 45000,
    category: "Electrical",
    imageUrl: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.8
  },
  {
    id: "prod-heater-02",
    name_ar: "مدفأة دائرية كلاسيك 2000W",
    name_ku: "گێرمی بازنەیی کلاسیک ٢٠٠٠ واط",
    name_en: "Classic Circular 2000W Room Heater",
    description_ar: "تصميم كلاسيكي ريترو مذهل وقدرة تسخين سريعة بزاوية 360 درجة للأجواء الشتوية الباردة مع نظام حماية الإطفاء الذاتي عند السقوط.",
    description_ku: "دیزاینی کلاسیکی زۆر تایبەت بە گەرمکردنی ٣٦٠ پلە بۆ کاتی زستان لەگەڵ سیستەمی کوژانەوەی خۆکار کاتی کەوتن.",
    description_en: "Stunning vintage retro tabletop radial heater with fast 360-degree thermal projection, dual power elements, and mechanical tip-over cutoff switch.",
    price: 35000,
    category: "Electrical",
    imageUrl: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.5
  },
  {
    id: "prod-drill-03",
    name_ar: "حقيبة دريل شحن متكاملة 18V",
    name_ku: "کۆمەڵە درێلی بارگاوی ١٨ ڤۆڵت",
    name_en: "18V Cordless Drill Complete Kit",
    description_ar: "دريل شحن فائق القوة لجميع الأعمال الإنشائية والمنزلية السريعة، يأتي مع بطاريتين ليثيوم ورؤوس حفر متكاملة مقاس 24 قطعة بشنطة بريميوم.",
    description_ku: "درێلی بارگاوی زۆر بەهێز بۆ هەموو کارێکی ئاواکاری و ماڵەوە، لەگەڵ دوو پاتری لیسیۆم و ٢٤ سەرەتای جیاواز کلیک پێشکەش دەکرێت.",
    description_en: "Heavy duty 18V torque-action wireless driver drill for professional construction, packaged with two battery cells, 24 core heads, and robust polymer grip-case.",
    price: 65000,
    category: "Construction",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.9
  },
  {
    id: "prod-notes-04",
    name_ar: "منظم وأجندة جلد طبيعي ياباني",
    name_ku: "ئەجێندا و دەفتەری پێستی تەواو سروشتی",
    name_en: "Japanese Leather Craft Agenda Planner",
    description_ar: "أجندة سنوية فاخرة مغلفة بالجلد الطبيعي المعالج يدوياً، ورق عالي الكثافة لا يطبع الحبر، قفل مغناطيسي، وجيب داخلي للكروت.",
    description_ku: "ئەجێندای ساڵانەی شاهانە بە بەرگی پێستی سروشتی پێشکەوتوو، کاغەزی ئەستووری ژاپۆنی دژە مەرکەب لەگەڵ قفڵی موگناتیسی خۆکار.",
    description_en: "Executive natural grain stitched leather planner notebook featuring off-white ivory bleed-proof internal binding, secure magnetic folder lock, and smart card pockets.",
    price: 18000,
    category: "Stationery",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.7
  },
  {
    id: "prod-clock-05",
    name_ar: "ساعة حائط كلاسيك خشب بندول",
    name_ku: "کاتژمێری دیواری بندۆلی داری کلاسیک",
    name_en: "Handcarved Pendulum Wall Clock",
    description_ar: "مصنوعة من الخشب الطبيعي المحفور يدوياً بنقوش كلاسيكية هادئة وبندول ميكانيكي راقص يضفي فخامة لكل مضافة أو صالون.",
    description_ku: "دروستکراوە لە داری سروشتی کەنەدی بە تاشینی دەستی لەگەڵ بندۆلی جولاو کە شیکی دەبەخشێت بە هەر ژوورێکی مێوان یان هۆڵێک.",
    description_en: "Charming hand-carved heritage wall clock in solid Canadian pine wood finish. Complete with silent-glide mechanical swinging pendulum and melodic time bells.",
    price: 125000,
    category: "Clocks",
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.6
  },
  {
    id: "prod-art-06",
    name_ar: "لوحة جدارية مذهبة عتيقة",
    name_ku: "تابلۆی دیواری کارکراو بە وەرەقەی ئاڵتوون",
    name_en: "Antique Calligraphy Gold Foil Art",
    description_ar: "لوحة فنية فاخرة للخط العربي الأصيل لآية الكرسي المطلية يدوياً بأوراق الذهب عيار 24 اللامع مع إطار كلاسيكي مزخرف.",
    description_ku: "تابلۆیەکی هونەری فەخمی نوسینی ئایەتی عەرەبی بە دەست کێشراو بە وەرەقەی ئاڵتوونی عەیار ٢٤ لەگەڵ چوارچێوەی بە نەخشی کلاسیک.",
    description_en: "Gallery-class premium arabic gilded masterpiece. Features Ayat Al-Kursi calligraphic patterns layered on black velvet with 24K gold foil embellishments and timber museum frame.",
    price: 75000,
    category: "Art/Decor",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 5.0
  },
  {
    id: "prod-toy-07",
    name_ar: "مكعبات تشكيل خشبية بيئية",
    name_ku: "بلۆکی دارینی ئەندازیاری هۆشیار",
    name_en: "Eco Wooden Geometry Building Blocks",
    description_ar: "مجموعة من 100 مكعب خشبي هندسي ملون بألوان مائية طبيعية بالكامل صديقة للطفل والبيئة لتطوير هدوء ومخيلة الأطفال وتنمية ذكائهم.",
    description_ku: "١٠٠ پارچەی ئەندازیاری ڕەنگاوڕەنگی دروستکراو لە داری سروشتی بۆ بەرزکردنەوەی هۆشیاری و مێشکی منداڵ زیانی نیە بۆ ژینگە.",
    description_en: "100-piece toddler geometry stack kit featuring water-tinted natural organic wood bricks, non-toxic eco surfaces, and tactile forms for spatial cognitive growth.",
    price: 22000,
    category: "Toys",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.8
  },
  {
    id: "prod-perfume-08",
    name_ar: "عطر تاج الطيب الفاخر 100 مل",
    name_ku: "بۆنی شاهانەی تاج ئەل-تەیب ١٠٠مل",
    name_en: "Taj Al-Teeb Luxury Oud Parfum",
    description_ar: "مزيج مترف ساحر يدمج بين العود الملكي المعتّق والمسك الأبيض الفواح والورد الإسطنبولي المركز لثبات أسطوري يدوم لأيام.",
    description_ku: "بۆنێکی شاهانەی سەرنجڕاکێش لە تێکەڵەی عوودی کۆنە و میسکی سپی و گوڵی ئەستەنبوڵی بۆ مانەوەی زۆر درێژخایەن.",
    description_en: "Signature luxury amber and royal oud release. A dense concentrated scent weaving authentic aged cambodian agarwood, powdery musk, and dry damascus rose petal oils.",
    price: 85000,
    category: "Perfumes",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.9
  },
  {
    id: "prod-acc-09",
    name_ar: "ميدالية جلد طبيعي لتتبع المفاتيح",
    name_ku: "میدالیای پێستی ئەندرۆید بۆ دۆزینەوەی کلیل",
    name_en: "Genuine Leather Smart Tracer Keyring",
    description_ar: "ميدالية كلاسيكية فخمة من الجلد السويدي مدمجة بجهاز تتبع بلوتوث ذكي للبحث عن ممتلكاتك ومفاتيحك عبر الهاتف فوراً بمدى 50 متر.",
    description_ku: "میدالیای کلاسیکی لە پێستی شیک بە عەلاگەی تایبەت لەگەڵ سیستەمی بلوتووسی زیرەک بۆ نیشاندانی شوێنی کلیل لە ٥٠ مەتریدا.",
    description_en: "Stitch-leather holster housing a Bluetooth finder module. Integrates with your smartphone to emit local signals up to 50 meters to prevent any key misplacement.",
    price: 15000,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600",
    inStock: true,
    rating: 4.4
  }
];

const DEFAULT_LAYOUT: LayoutConfig = {
  id: "config",
  storeLogo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12 text-[#E88A05]" fill="currentColor">
  <path d="M50 8.5C51.6 8.5 53.1 9.3 54.1 10.7L82.1 48.7C83.8 51 82.1 54.3 79.2 54.3H72.1V82.3C72.1 84.5 70.3 86.3 68.1 86.3H56.1V64.3H43.9V86.3H31.9C29.7 86.3 27.9 84.5 27.9 82.3V54.3H20.8C17.9 54.3 16.2 51 17.9 48.7L45.9 10.7C46.9 9.3 48.4 8.5 50 8.5ZM50 14.5L24.3 49.3H32.9C34.6 49.3 35.9 51.1 35.9 52.8V80.3H49.9V58.3H59.9V80.3H64.1V52.8C64.1 51.1 65.4 49.3 67.1 49.3H75.7L50 14.5Z" />
  <circle cx="50" cy="40" r="4" fill="currentColor"/>
</svg>`,
  bannerText_ar: "توصيل سريع مجاني وسريع لكافة مناطق ومحافظات العراق للطلبات فوق الـ 100,000 د.ع! الدفع عند الاستلام وسهولة المعاينة.",
  bannerText_ku: "گەیاندنی خێرا بۆ هەموو پارێزگاکانی عێراق بۆ داواکاری سەروو ١٠٠ هەزار د.ع بە متمانەی تەواو، پێش پارەدان کاڵاکەت ببينە.",
  bannerText_en: "Express delivery across all Iraq governorates. Free delivery for purchases above 100,000 IQD with safety check upon receipt."
};

/**
 * Fetch all products from Firestore database
 */
export async function fetchProductsFromDB(): Promise<Product[]> {
  const colPath = 'products';
  try {
    const querySnapshot = await getDocs(collection(db, colPath));
    const items: Product[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as Product);
    });
    return items;
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, colPath);
  }
}

/**
 * Fetch Layout Config from Firestore database
 */
export async function fetchLayoutConfigFromDB(): Promise<LayoutConfig | null> {
  const colPath = 'layout';
  const docId = 'config';
  try {
    const docRef = doc(db, colPath, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as LayoutConfig;
    }
    return null;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, `${colPath}/${docId}`);
  }
}

/**
 * Fetch Main Config from site_settings/main_config
 */
export async function fetchMainConfigFromDB(): Promise<{ logoUrl: string } | null> {
  const colPath = 'site_settings';
  const docId = 'main_config';
  try {
    const docRef = doc(db, colPath, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as { logoUrl: string };
    }
    return null;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, `${colPath}/${docId}`);
  }
}

/**
 * Seed database with full premium initial products and layout configuration 
 * in case the collections are currently empty.
 */
export async function seedDatabaseIfEmpty(force: boolean = false): Promise<void> {
  const productsCol = 'products';
  const layoutCol = 'layout';
  const settingsCol = 'site_settings';
  try {
    // 1. Check operations for layout
    const layoutRef = doc(db, layoutCol, 'config');
    const layoutSnap = await getDoc(layoutRef);
    
    // 2. Check operations for products
    const productsSnap = await getDocs(collection(db, productsCol));

    // 3. Check site_settings/main_config
    const mainConfigRef = doc(db, settingsCol, 'main_config');
    const mainConfigSnap = await getDoc(mainConfigRef);
    
    const layoutEmpty = !layoutSnap.exists();
    const productsEmpty = productsSnap.empty;
    const settingsEmpty = !mainConfigSnap.exists();

    if (layoutEmpty || force) {
      await setDoc(layoutRef, {
        id: DEFAULT_LAYOUT.id,
        storeLogo: DEFAULT_LAYOUT.storeLogo,
        bannerText_ar: DEFAULT_LAYOUT.bannerText_ar,
        bannerText_ku: DEFAULT_LAYOUT.bannerText_ku,
        bannerText_en: DEFAULT_LAYOUT.bannerText_en
      });
      console.log("Seeded layout configuration to firestore");
    }

    if (settingsEmpty || force) {
      await setDoc(mainConfigRef, {
        logoUrl: "" // Seed with empty logoUrl initially to trigger premium fallback, and fully controlled via firebase
      });
      console.log("Seeded main_config configuration to firestore");
    }

    if (productsEmpty || force) {
      for (const prod of SEED_PRODUCTS) {
        await setDoc(doc(db, productsCol, prod.id), {
          id: prod.id,
          name_ar: prod.name_ar,
          name_ku: prod.name_ku,
          name_en: prod.name_en,
          description_ar: prod.description_ar,
          description_ku: prod.description_ku,
          description_en: prod.description_en,
          price: prod.price,
          category: prod.category,
          imageUrl: prod.imageUrl,
          inStock: prod.inStock,
          rating: prod.rating || 5
        });
      }
      console.log("Seeded products to Firestore database");
    }
  } catch (error) {
    // Handled safely
    handleFirestoreError(error, OperationType.WRITE, 'seeding');
  }
}
