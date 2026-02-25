import { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext } from "react";
import { supabase } from './lib/supabaseClient';
import * as recharts from "recharts";
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Area, AreaChart } = recharts;

// ═══════════════════════════════════════════════════════════════════════════
// DIAMCO v2 — Themes (Dark/Light) В· Languages (EN/RU/AR) В· RTL
// ═══════════════════════════════════════════════════════════════════════════

const THEMES = {
  dark: { name:"dark", bg:"#060610", bgCard:"rgba(14,18,35,0.85)", bgHover:"rgba(20,26,50,0.95)", bgInput:"rgba(14,18,35,0.9)", bgModal:"#0c0c1a",
    ice:"#7eb8d8", iceLight:"#a8d8ee", iceDark:"#4a8baa", accent:"#89c4e1", accentGlow:"rgba(126,184,216,0.12)",
    text:"#e8f0f6", textSecondary:"#b0c4d4", textMuted:"#7a8ea0", textDim:"#5a6a7a",
    border:"rgba(126,184,216,0.12)", borderHover:"rgba(126,184,216,0.28)",
    success:"#4ecdc4", warning:"#f7b731", danger:"#e74c3c",
    gradient:"linear-gradient(135deg,#7eb8d8,#4a8baa)", headerBg:"rgba(6,6,16,0.9)", tooltipBg:"#0c0c1a",
    chipActive:"rgba(126,184,216,0.18)", chipText:"#c8dde8", scrollThumb:"rgba(126,184,216,0.15)", shadow:"rgba(0,0,0,0.3)" },
  light: { name:"light", bg:"#f4f7fa", bgCard:"rgba(255,255,255,0.92)", bgHover:"#ffffff", bgInput:"#ffffff", bgModal:"#ffffff",
    ice:"#2a7ba8", iceLight:"#1a6a96", iceDark:"#1b5a7a", accent:"#2a88b5", accentGlow:"rgba(42,123,168,0.08)",
    text:"#1a2530", textSecondary:"#3a4e5c", textMuted:"#5a7080", textDim:"#8a9aaa",
    border:"rgba(42,123,168,0.12)", borderHover:"rgba(42,123,168,0.25)",
    success:"#0d9488", warning:"#d97706", danger:"#dc2626",
    gradient:"linear-gradient(135deg,#2a7ba8,#1b5a7a)", headerBg:"rgba(244,247,250,0.92)", tooltipBg:"#ffffff",
    chipActive:"rgba(42,123,168,0.12)", chipText:"#2a5570", scrollThumb:"rgba(42,123,168,0.15)", shadow:"rgba(0,0,0,0.08)" },
};

const LANGS = {
  en: { dir:"ltr", label:"English",
    catalog:"Catalog", calculator:"Calculator", analytics:"Analytics", profile:"My Account",
    signUp:"Sign Up Free", settings:"Settings",
    filters:"Filters", resetAll:"Reset All", naturalOnly:"Natural Only",
    shape:"Shape", carat:"Carat", color:"Color", clarity:"Clarity", cut:"Cut",
    lab:"Lab", price:"Price", source:"Source", diamonds:"diamonds",
    saveSearch:"Save Search", setAlert:"Set Alert", searchPH:"Search Code, ID, color, clarity...",
    priceAsc:"Price ↑", priceDesc:"Price ↓", caratDesc:"Carat ↓", caratAsc:"Carat ↑", pctAsc:"$/ct ↑", pctDesc:"$/ct ↓",
    perCt:"/ct", rap:"Rap", daysAgo:"days ago", contactDealer:"Contact Dealer",
    save:"Save", saved:"Saved", share:"Share", compare:"Compare", close:"Close",
    excellentDeal:"Excellent deal", fairPrice:"Fair price", premium:"Premium", value:"Value",
    totalPrice:"Total Price", polish:"Polish", symmetry:"Symmetry", fluorescence:"Fluorescence",
    certNum:"Cert #", depth:"Depth", table:"Table", measurements:"Measurements", listed:"Listed",
    calcTitle:"Diamond Price Calculator", calcDesc:"Estimate market value based on 4Cs using Rapaport methodology.",
    estimatedPrice:"Estimated Market Price", perCarat:"per carat",
    whatIf:"What-if Savings", colorM1:"Color −1 grade", clarityM1:"Clarity −1 grade",
    medFluor:"+ Medium fluor", vgCut:"Very Good cut", saveMoney:"Save", plus:"+",
    caratEd:"Weight. Price jumps at 0.5, 1.0, 1.5, 2.0 thresholds.",
    cutEd:"Ideal/Excellent = max brilliance. Biggest impact on beauty.",
    colorEd:"D (colorless) → M (tint). G-H = sweet spot for value.",
    clarityEd:"FL → I2. VS2-SI1 are eye-clean — great value zone.",
    analyticsTitle:"Market Analytics", from:"from", sources:"sources", tracked:"diamonds tracked",
    priceTrends:"Price Trends — 12 Months", avgPop:"Avg $/ct for popular 1ct+ categories",
    shapeDist:"Shape Distribution", avgByColor:"Avg $/ct by Color",
    totalListings:"Total Listings", avgPriceCt:"Avg $/ct", allShapes:"All shapes",
    avgDiscount:"Avg Discount", offRap:"Off Rapaport", activeDealers:"Active Dealers", inCities:"in", cities:"cities",
    welcomeBack:"Welcome back", joinMP:"Join the diamond marketplace",
    signIn:"Sign In", register:"Register", fullName:"Full Name", company:"Company (optional)",
    email:"Email", password:"Password", buyer:"🛒 Buyer", seller:"💎 Seller", both:"🔄 Both",
    freeForever:"Free forever В· No credit card", byReg:"By registering you agree to Terms",
    savedSearches:"Saved Searches", priceAlerts:"Price Alerts", favorites:"Favorites",
    noSaved:"No saved searches yet", startSearch:"Start Searching",
    noAlerts:"No alerts set", alertDesc:"Save a search to get notified when prices drop",
    noFavs:"Tap the heart icon on any diamond to save it here",
    load:"Load", watching:"Watching", triggered:"Triggered!",
    alertWhen:"Alert when price drops below", results:"results", notifications:"Notifications",
    spec:"Spec", showing:"Showing", of:"of", narrowF:"Narrow filters for more specific results.",
    noMatch:"No diamonds match", adjustF:"Adjust your filters or",
    settingsTitle:"Settings", theme:"Theme", dark:"Dark", light:"Light", language:"Language",
    colorTip:"D=Colorless → M=Light Yellow", clarityTip:"FL=Flawless → I2=Visible",
    googleSignUp:"Sign up with Google", googleSignIn:"Sign in with Google", orEmail:"or with email", noAccount:"Don't have an account?", haveAccount:"Already have an account?",
    footerAbout:"About DIAMCO", footerAboutTxt:"Free diamond marketplace platform connecting buyers, sellers and dealers worldwide.", footerLinks:"Quick Links", footerContact:"Contact", footerRights:"All rights reserved", footerTerms:"Terms", footerPrivacy:"Privacy", footerSupport:"Support" },
  ru: { dir:"ltr", label:"Русский",
    catalog:"Каталог", calculator:"Калькулятор", analytics:"Аналитика", profile:"Кабинет",
    signUp:"Регистрация", settings:"Настройки",
    filters:"Фильтры", resetAll:"Сбросить", naturalOnly:"Только натуральные",
    shape:"Форма", carat:"Карат", color:"Цвет", clarity:"Чистота", cut:"Огранка",
    lab:"Лаборатория", price:"Цена", source:"Рсточник", diamonds:"бриллиантов",
    saveSearch:"Сохранить", setAlert:"Алерт", searchPH:"Поиск: Code, цвет, чистота...",
    priceAsc:"Цена ↑", priceDesc:"Цена ↓", caratDesc:"Карат ↓", caratAsc:"Карат ↑", pctAsc:"$/ct ↑", pctDesc:"$/ct ↓",
    perCt:"/ct", rap:"Rap", daysAgo:"дн. назад", contactDealer:"Связаться с дилером",
    save:"Сохранить", saved:"Сохранено", share:"Поделиться", compare:"Сравнить", close:"Закрыть",
    excellentDeal:"Отличная цена", fairPrice:"Хорошая цена", premium:"Премиум", value:"Оценка",
    totalPrice:"Ртого", polish:"Полировка", symmetry:"Симметрия", fluorescence:"Флуоресценция",
    certNum:"Серт. №", depth:"Глубина", table:"Площадка", measurements:"Размеры", listed:"В листинге",
    calcTitle:"Калькулятор стоимости", calcDesc:"Оценка рыночной стоимости по методологии Rapaport.",
    estimatedPrice:"Расчётная цена", perCarat:"за карат",
    whatIf:"Сценарии экономии", colorM1:"Цвет −1", clarityM1:"Чистота −1",
    medFluor:"+ Средн. флуор.", vgCut:"Very Good огранка", saveMoney:"Экономия", plus:"+",
    caratEd:"Вес. Цена скачет на 0.5, 1.0, 1.5, 2.0 ct.", cutEd:"Ideal/Excellent — максимальный блеск.",
    colorEd:"D (бесцветный) → M (оттенок). G-H — лучшая цена/вид.", clarityEd:"FL → I2. VS2-SI1 — не видны глазу.",
    analyticsTitle:"Аналитика рынка", from:"из", sources:"источн.", tracked:"бриллиантов",
    priceTrends:"Тренды цен — 12 мес.", avgPop:"Средняя $/ct для 1ct+",
    shapeDist:"По формам", avgByColor:"Средн. $/ct по цветам",
    totalListings:"Листингов", avgPriceCt:"Средн. $/ct", allShapes:"Все формы",
    avgDiscount:"Средн. скидка", offRap:"от Rapaport", activeDealers:"Дилеров", inCities:"в", cities:"городах",
    welcomeBack:"С возвращением", joinMP:"Присоединяйтесь",
    signIn:"Войти", register:"Регистрация", fullName:"Рмя", company:"Компания",
    email:"Email", password:"Пароль", buyer:"🛒 Покупатель", seller:"💎 Продавец", both:"🔄 Оба",
    freeForever:"Бесплатно навсегда", byReg:"Регистрируясь, вы принимаете Условия",
    savedSearches:"Сохранённые поиски", priceAlerts:"Алерты цен", favorites:"Рзбранное",
    noSaved:"Нет сохранённых поисков", startSearch:"Начать поиск",
    noAlerts:"Нет алертов", alertDesc:"Сохраните поиск для уведомлений",
    noFavs:"Нажмите ♡ чтобы сохранить",
    load:"Загрузить", watching:"Отслеживаем", triggered:"Сработал!",
    alertWhen:"Алерт при снижении ниже", results:"результатов", notifications:"Уведомления",
    spec:"Параметр", showing:"Показано", of:"из", narrowF:"Сузьте фильтры.",
    noMatch:"Ничего не найдено", adjustF:"Рзмените фильтры или",
    settingsTitle:"Настройки", theme:"Тема", dark:"Тёмная", light:"Светлая", language:"Язык",
    colorTip:"D=Бесцветный → M=Жёлтый", clarityTip:"FL=Безупречный → I2=Видимые",
    googleSignUp:"Зарегистрироваться через Google", googleSignIn:"Войти через Google", orEmail:"или по email", noAccount:"Нет аккаунта?", haveAccount:"Уже есть аккаунт?",
    footerAbout:"О DIAMCO", footerAboutTxt:"Бесплатная платформа для торговли бриллиантами, связывающая покупателей, продавцов и дилеров по всему миру.", footerLinks:"Навигация", footerContact:"Контакты", footerRights:"Все права защищены", footerTerms:"Условия", footerPrivacy:"Конфиденциальность", footerSupport:"Поддержка" },
  ar: { dir:"rtl", label:"العربية",
    catalog:"الكتالوج", calculator:"الحاسبة", analytics:"التحليلات", profile:"حسابي",
    signUp:"تسجيل مجاني", settings:"الإعدادات",
    filters:"تصفية", resetAll:"إعادة", naturalOnly:"طبيعي فقط",
    shape:"الشكل", carat:"القيراط", color:"اللون", clarity:"النقاء", cut:"القطع",
    lab:"المختبر", price:"السعر", source:"المصدر", diamonds:"ألماس",
    saveSearch:"حفظ البحث", setAlert:"تنبيه", searchPH:"بحث Code أو لون أو نقاء...",
    priceAsc:"السعر ↑", priceDesc:"السعر ↓", caratDesc:"القيراط ↓", caratAsc:"القيراط ↑", pctAsc:"$/ct ↑", pctDesc:"$/ct ↓",
    perCt:"/ct", rap:"Rap", daysAgo:"أيام", contactDealer:"اتصل بالتاجر",
    save:"حفظ", saved:"محفوظ", share:"مشاركة", compare:"مقارنة", close:"إغلاق",
    excellentDeal:"صفقة ممتازة", fairPrice:"سعر عادل", premium:"مميز", value:"التقييم",
    totalPrice:"السعر الإجمالي", polish:"التلميع", symmetry:"التماثل", fluorescence:"الفلورة",
    certNum:"رقم الشهادة", depth:"العمق", table:"الطاولة", measurements:"القياسات", listed:"مدرج",
    calcTitle:"حاسبة أسعار الألماس", calcDesc:"تقدير القيمة السوقية وفقاً لمنهجية Rapaport.",
    estimatedPrice:"السعر المقدر", perCarat:"لكل قيراط",
    whatIf:"سيناريوهات التوفير", colorM1:"لون −1", clarityM1:"نقاء −1",
    medFluor:"+ فلورة متوسطة", vgCut:"قطع V.Good", saveMoney:"توفير", plus:"+",
    caratEd:"الوزن. يقفز السعر عند 0.5، 1.0، 2.0 ct.", cutEd:"Ideal = أقصى بريق.",
    colorEd:"D (عديم اللون) → M. أفضل قيمة: G-H.", clarityEd:"FL → I2. VS2-SI1 = نظيف بالعين.",
    analyticsTitle:"تحليلات السوق", from:"من", sources:"مصادر", tracked:"ألماسة",
    priceTrends:"اتجاهات الأسعار — 12 شهر", avgPop:"متوسط $/ct للفئات 1ct+",
    shapeDist:"توزيع الأشكال", avgByColor:"متوسط $/ct حسب اللون",
    totalListings:"العروض", avgPriceCt:"متوسط $/ct", allShapes:"جميع الأشكال",
    avgDiscount:"متوسط الخصم", offRap:"من Rapaport", activeDealers:"التجار", inCities:"في", cities:"مدينة",
    welcomeBack:"مرحباً بعودتك", joinMP:"انضم إلى المنصة",
    signIn:"دخول", register:"إنشاء حساب", fullName:"الاسم", company:"الشركة",
    email:"البريد", password:"كلمة المرور", buyer:"🛒 مشتري", seller:"💎 بائع", both:"🔄 كلاهما",
    freeForever:"مجاني للأبد", byReg:"بالتسجيل توافق على الشروط",
    savedSearches:"بحث محفوظ", priceAlerts:"تنبيهات", favorites:"المفضلة",
    noSaved:"لا بحث محفوظ", startSearch:"ابدأ البحث",
    noAlerts:"لا تنبيهات", alertDesc:"احفظ بحثاً للإشعار عند انخفاض الأسعار",
    noFavs:"اضغط ♡ لحفظ الألماس",
    load:"تحميل", watching:"مراقبة", triggered:"!تم التنبيه",
    alertWhen:"تنبيه عند أقل من", results:"نتائج", notifications:"إشعارات",
    spec:"المواصفات", showing:"عرض", of:"من", narrowF:"حدد الفلاتر.",
    noMatch:"لا نتائج", adjustF:"عدّل الفلاتر أو",
    settingsTitle:"الإعدادات", theme:"المظهر", dark:"داكن", light:"فاتح", language:"اللغة",
    colorTip:"D=عديم اللون → M=أصفر", clarityTip:"FL=مثالي → I2=شوائب مرئية",
    googleSignUp:"التسجيل عبر Google", googleSignIn:"الدخول عبر Google", orEmail:"أو بالبريد", noAccount:"ليس لديك حساب؟", haveAccount:"لديك حساب بالفعل؟",
    footerAbout:"عن DIAMCO", footerAboutTxt:"منصة مجانية لتجارة الألماس تربط المشترين والبائعين والتجار حول العالم.", footerLinks:"روابط سريعة", footerContact:"اتصل بنا", footerRights:"جميع الحقوق محفوظة", footerTerms:"الشروط", footerPrivacy:"الخصوصية", footerSupport:"الدعم" },
};

const Ctx = createContext(); const useApp = () => useContext(Ctx);

// ─── Diamond Data ───────────────────────────────────────────────────────
const SHAPES=["Round","Princess","Oval","Emerald","Cushion","Pear","Marquise","Radiant","Asscher","Heart"];
const COLORS_LIST=["D","E","F","G","H","I","J","K","L","M"];
const CLARITIES=["FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","I1","I2"];
const CUTS=["Ideal","Excellent","Very Good","Good","Fair"];
const FLUORESCENCE=["None","Faint","Medium","Strong","Very Strong"];
const LABS=["GIA","AGS","IGI","HRD"];
const BP={"D-FL":16500,"D-IF":14200,"D-VVS1":12800,"D-VVS2":11000,"D-VS1":9800,"D-VS2":8600,"D-SI1":7200,"D-SI2":5800,"D-I1":3800,"D-I2":2400,"E-FL":14000,"E-IF":12500,"E-VVS1":11200,"E-VVS2":9800,"E-VS1":8800,"E-VS2":7800,"E-SI1":6600,"E-SI2":5400,"E-I1":3500,"E-I2":2200,"F-FL":12500,"F-IF":11000,"F-VVS1":10000,"F-VVS2":8800,"F-VS1":7900,"F-VS2":7100,"F-SI1":6000,"F-SI2":5000,"F-I1":3200,"F-I2":2000,"G-FL":10500,"G-IF":9500,"G-VVS1":8600,"G-VVS2":7600,"G-VS1":6800,"G-VS2":6200,"G-SI1":5300,"G-SI2":4500,"G-I1":2900,"G-I2":1800,"H-FL":8800,"H-IF":8000,"H-VVS1":7200,"H-VVS2":6500,"H-VS1":5800,"H-VS2":5300,"H-SI1":4600,"H-SI2":3900,"H-I1":2600,"H-I2":1600,"I-FL":7200,"I-IF":6500,"I-VVS1":5900,"I-VVS2":5300,"I-VS1":4800,"I-VS2":4400,"I-SI1":3800,"I-SI2":3200,"I-I1":2200,"I-I2":1400,"J-FL":6000,"J-IF":5400,"J-VVS1":4900,"J-VVS2":4400,"J-VS1":4000,"J-VS2":3600,"J-SI1":3100,"J-SI2":2700,"J-I1":1900,"J-I2":1200,"K-FL":4800,"K-IF":4300,"K-VVS1":3900,"K-VVS2":3500,"K-VS1":3200,"K-VS2":2900,"K-SI1":2500,"K-SI2":2200,"K-I1":1600,"K-I2":1000,"L-FL":3800,"L-IF":3400,"L-VVS1":3100,"L-VVS2":2800,"L-VS1":2500,"L-VS2":2300,"L-SI1":2000,"L-SI2":1800,"L-I1":1300,"L-I2":850,"M-FL":3000,"M-IF":2700,"M-VVS1":2500,"M-VVS2":2300,"M-VS1":2100,"M-VS2":1900,"M-SI1":1700,"M-SI2":1500,"M-I1":1100,"M-I2":750};
const SM={Round:1,Princess:.72,Oval:.82,Emerald:.75,Cushion:.78,Pear:.76,Marquise:.7,Radiant:.74,Asscher:.77,Heart:.73};
const CM=ct=>ct<.3?.35:ct<.5?.55:ct<.7?.72:ct<.9?.85:ct<1?.92:ct<1.5?1:ct<2?1.35:ct<3?1.8:ct<4?2.5:ct<5?3.2:4;
const UM={Ideal:1.12,Excellent:1.05,"Very Good":1,Good:.92,Fair:.82};
const FM={None:1,Faint:.98,Medium:.95,Strong:.88,"Very Strong":.82};
const calcPrice=(sh,ct,co,cl,cu,fl)=>Math.round((BP[`${co}-${cl}`]||3000)*(SM[sh]||1)*CM(ct)*(UM[cu]||1)*(FM[fl]||1)*ct);

const SRCS=[{name:"Nivoda",region:"Global",count:0,c:"#3498db"},{name:"IDEX",region:"Tel Aviv",count:0,c:"#9b59b6"},{name:"VDB",region:"Antwerp",count:0,c:"#e67e22"},{name:"Direct",region:"Mumbai",count:0,c:"#2ecc71"},{name:"Stonealgo",region:"USA",count:0,c:"#e74c3c"}];
const DLRS=["KGK Group","Dharmanandan","Hari Krishna","Venus Jewel","Kiran Gems","Rosy Blue","Diarough","Laurelton","Graff","De Beers","Surat Bourse","Antwerp DC","NY Diamond","HK Gems Hub","Dubai DMCC","Tel Aviv Ex","Bangkok Gem","Tokyo Corp","London Hatton","Paris Vendome"];
const CITIES=["Mumbai","Surat","Antwerp","New York","Dubai","Tel Aviv","Hong Kong","Bangkok","Tokyo","London","Paris","LA","Geneva","Singapore"];



const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PH=MONTHS.map((m,i)=>({month:m,r1:Math.round(6200-i*25+Math.sin(i)*80+(i>8?150:0)),r2:Math.round(14800-i*50+Math.sin(i)*120+(i>8?300:0)),o1:Math.round(5100-i*20+Math.cos(i)*60+(i>9?100:0)),c1:Math.round(4800-i*18+Math.sin(i+1)*55+(i>8?90:0))}));

// ─── Icons ──────────────────────────────────────────────────────────────
const Ic=({d,sz=18,f="none",s="currentColor",w=1.8})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill={f} stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const I={
  diamond:<Ic d={<><path d="M2.7 10.3l9.3 11.7 9.3-11.7-4.3-8.3h-10z"/><path d="M2.7 10.3h18.6"/><path d="M12 22l3-11.7M12 22l-3-11.7"/><path d="M7.7 2l1.3 8.3M16.3 2l-1.3 8.3"/></>} sz={20}/>,
  search:<Ic d={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>}/>,
  calc:<Ic d={<><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4M8 18h4"/></>}/>,
  chart:<Ic d={<><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></>}/>,
  user:<Ic d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>,
  heart:f=><Ic d={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>} f={f?"#e74c3c":"none"} s={f?"#e74c3c":"currentColor"} sz={16}/>,
  cmp:<Ic d={<><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></>} sz={16}/>,
  bell:<Ic d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>}/>,
  sv:<Ic d={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>}/>,
  x:<Ic d={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>}/>,
  menu:<Ic d={<><path d="M3 12h18M3 6h18M3 18h18"/></>}/>,
  filter:<Ic d={<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>}/>,
  star:f=><Ic d={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} f={f?"currentColor":"none"} sz={14}/>,
  ext:<Ic d={<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>} sz={14}/>,
  del:<Ic d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} sz={14}/>,
  info:<Ic d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>} sz={14}/>,
  gear:<Ic d={<><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>}/>,
  moon:<Ic d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>} sz={16}/>,
  sun:<Ic d={<><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>} sz={16}/>,
};

// ─── Shared Components ──────────────────────────────────────────────────
const Tip=({text,children})=>{const[s,setS]=useState(false);const{T}=useApp();return<span style={{position:"relative",display:"inline-flex",alignItems:"center",cursor:"help"}} onMouseEnter={()=>setS(true)} onMouseLeave={()=>setS(false)}>{children}{s&&<span style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:T.tooltipBg,color:T.text,padding:"8px 12px",borderRadius:8,fontSize:12,whiteSpace:"nowrap",zIndex:999,boxShadow:`0 8px 32px ${T.shadow}`,border:`1px solid ${T.border}`,backdropFilter:"blur(20px)"}}>{text}</span>}</span>;};
const Btn=({children,primary,small,danger,style:sx,...p})=>{const{T}=useApp();return<button{...p}style={{padding:small?"6px 12px":"10px 20px",borderRadius:10,cursor:"pointer",fontSize:small?12:13,fontWeight:600,fontFamily:"'Outfit',sans-serif",display:"inline-flex",alignItems:"center",gap:6,transition:"all .2s",background:primary?T.gradient:danger?`${T.danger}18`:"transparent",color:primary?"#fff":danger?T.danger:T.ice,border:primary?"none":`1px solid ${danger?`${T.danger}40`:T.border}`,...sx}}>{children}</button>;};
const Chips=({label,opts,sel,onChange,tip})=>{const{T}=useApp();return<div style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice}}>{label}</span>{tip&&<Tip text={tip}>{I.info}</Tip>}</div><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{opts.map(o=>{const a=sel.includes(o);return<button key={o} onClick={()=>onChange(a?sel.filter(s=>s!==o):[...sel,o])} style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${a?T.ice:T.border}`,background:a?T.chipActive:"transparent",color:a?T.chipText:T.textMuted,fontSize:11,cursor:"pointer",fontWeight:a?600:400,fontFamily:"'Outfit',sans-serif"}}>{o}</button>;})}</div></div>;};
const RangeField=({val,fmt,onCommit})=>{
  const{T}=useApp();
  const[edit,setEdit]=useState(false);
  const[tmp,setTmp]=useState("");
  const open=()=>{setTmp(String(val));setEdit(true);};
  const commit=()=>{const n=parseFloat(tmp);if(!isNaN(n))onCommit(n);setEdit(false);};
  return<div onClick={open} style={{width:64,height:36,background:T.bgInput,borderLeft:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"text"}}>
    {edit
      ?<input autoFocus value={tmp} onChange={e=>setTmp(e.target.value)}
          onBlur={commit} onKeyDown={e=>e.key==="Enter"&&commit()}
          style={{width:"100%",background:"transparent",border:"none",color:T.text,fontSize:13,fontWeight:600,textAlign:"center",fontFamily:"'Outfit',sans-serif",padding:"0 4px",outline:"none"}}/>
      :<span style={{fontSize:13,fontWeight:600,color:T.text,fontFamily:"'Outfit',sans-serif"}}>{fmt(val)}</span>}
  </div>;};
const Range=({label,min,max,value:v,onChange,step=.1,fmt=x=>x})=>{
  const{T}=useApp();
  const timerRef=useRef(null);
  const intervalRef=useRef(null);
  const clamp=(val,lo,hi)=>Math.round(Math.min(Math.max(val,lo),hi)*100)/100;
  const stopHold=()=>{clearTimeout(timerRef.current);clearInterval(intervalRef.current);};
  const startHold=(idx,delta)=>{
    const move=()=>onChange(p=>{const nv=[...p];nv[idx]=clamp(nv[idx]+delta,idx===0?min:p[0]+step,idx===1?max:p[1]-step);return nv;});
    move();timerRef.current=setTimeout(()=>{intervalRef.current=setInterval(move,80);},400);
  };
  useEffect(()=>()=>stopHold(),[]);
  const BtnPM=({idx,up})=>{const delta=up?step:-step;return<button type="button"
    onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);startHold(idx,delta);}}
    onPointerUp={stopHold} onPointerCancel={stopHold} onPointerLeave={stopHold}
    style={{width:36,height:22,border:`1px solid ${T.border}`,borderBottom:up?`1px solid ${T.border}`:"none",borderRadius:up?"4px 4px 0 0":"0 0 4px 4px",background:T.accentGlow,color:T.ice,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,userSelect:"none",WebkitUserSelect:"none",touchAction:"none"}}>
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d={up?"M1 4l3-3 3 3":"M1 1l3 3 3-3"} stroke={T.ice} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>;};
  return<div style={{marginBottom:20}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice}}>{label}</span>
      <span style={{fontSize:11,color:T.text,fontWeight:600,background:T.accentGlow,padding:"2px 8px",borderRadius:5,border:`1px solid ${T.border}`}}>{fmt(v[0])} — {fmt(v[1])}</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"stretch",borderRadius:6,overflow:"hidden",border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",flexDirection:"column"}}><BtnPM idx={0} up={true}/><BtnPM idx={0} up={false}/></div>
        <RangeField val={v[0]} fmt={fmt} onCommit={n=>onChange([clamp(n,min,v[1]-step),v[1]])}/>
      </div>
      <div style={{flex:1,height:2,background:`linear-gradient(90deg,${T.ice}30,${T.ice}80,${T.ice}30)`,borderRadius:1,margin:"0 4px"}}/>
      <div style={{display:"flex",alignItems:"stretch",borderRadius:6,overflow:"hidden",border:`1px solid ${T.border}`}}>
        <RangeField val={v[1]} fmt={fmt} onCommit={n=>onChange([v[0],clamp(n,v[0]+step,max)])}/>
        <div style={{display:"flex",flexDirection:"column"}}><BtnPM idx={1} up={true}/><BtnPM idx={1} up={false}/></div>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
      <span style={{fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:".05em",marginLeft:36}}>min</span>
      <span style={{fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:".05em",marginRight:36}}>max</span>
    </div>
  </div>;};



// ─── Card ───────────────────────────────────────────────────────────────
const Card=({d,onFav,isFav,onCmp,isCmp,onSel})=>{const[h,setH]=useState(false);const{T,t,fmtPrice}=useApp();
  const hasPhoto=d.image_url||d.photo_url;
  return<div onClick={()=>onSel(d)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:h?T.bgHover:T.bgCard,borderRadius:16,overflow:"hidden",cursor:"pointer",border:`1px solid ${h?T.borderHover:T.border}`,transition:"all .25s",transform:h?"translateY(-3px)":"none",backdropFilter:"blur(12px)",boxShadow:h?`0 12px 40px ${T.shadow}`:"none"}}>
  {/* Photo / Shape icon area */}
  <div style={{height:140,background:hasPhoto?"#000":`linear-gradient(135deg,${T.accentGlow},rgba(0,0,0,0.05))`,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
    {hasPhoto?<img src={hasPhoto} alt={d.shape} style={{width:"100%",height:"100%",objectFit:"cover",opacity:.95}}/>
    :<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:.5}}><svg width={56} height={56} viewBox="0 0 48 48" fill="none" stroke={T.ice} strokeWidth=".9" strokeLinejoin="round">{
      d.shape==="Round"?<><circle cx="24" cy="24" r="20"/><polygon points="24,4 44,24 24,44 4,24"/><line x1="24" y1="4" x2="24" y2="44" opacity=".5"/><line x1="4" y1="24" x2="44" y2="24" opacity=".5"/><polygon points="24,10 38,24 24,38 10,24" opacity=".4"/></>
      :d.shape==="Princess"?<><rect x="4" y="4" width="40" height="40" rx="1"/><line x1="4" y1="4" x2="44" y2="44"/><line x1="44" y1="4" x2="4" y2="44"/><polygon points="24,4 44,24 24,44 4,24" opacity=".5"/></>
      :d.shape==="Cushion"?<><rect x="4" y="4" width="40" height="40" rx="10"/><polygon points="24,8 40,24 24,40 8,24" opacity=".35"/><line x1="10" y1="7" x2="38" y2="41" opacity=".3"/><line x1="38" y1="7" x2="10" y2="41" opacity=".3"/></>
      :d.shape==="Oval"?<><ellipse cx="24" cy="24" rx="14" ry="21"/><line x1="24" y1="3" x2="24" y2="45" opacity=".5"/><ellipse cx="24" cy="24" rx="7" ry="12" opacity=".35"/></>
      :d.shape==="Emerald"?<><rect x="6" y="3" width="36" height="42" rx="3"/><rect x="10" y="7" width="28" height="34" rx="2" opacity=".5"/><rect x="14" y="11" width="20" height="26" rx="1" opacity=".35"/></>
      :d.shape==="Pear"?<><path d="M24 3C18 3 10 12 10 24c0 8 6 21 14 21s14-13 14-21C38 12 30 3 24 3z"/><line x1="24" y1="3" x2="24" y2="45" opacity=".5"/></>
      :d.shape==="Marquise"?<><ellipse cx="24" cy="24" rx="11" ry="22"/><line x1="24" y1="2" x2="24" y2="46" opacity=".5"/></>
      :d.shape==="Radiant"?<><rect x="5" y="3" width="38" height="42" rx="2"/><line x1="5" y1="3" x2="43" y2="45"/><line x1="43" y1="3" x2="5" y2="45"/></>
      :d.shape==="Asscher"?<><rect x="4" y="4" width="40" height="40" rx="2"/><rect x="10" y="10" width="28" height="28" rx="1" opacity=".5"/><rect x="16" y="16" width="16" height="16" rx="1" opacity=".35"/></>
      :d.shape==="Heart"?<><path d="M24 44C24 44 4 30 4 16C4 9 9 4 15 4c3.5 0 6.5 1.8 9 5 2.5-3.2 5.5-5 9-5 6 0 11 5 11 12C44 30 24 44 24 44z"/><line x1="24" y1="9" x2="24" y2="44" opacity=".5"/></>
      :<><path d="M4 18l20 26 20-26L36 4H12z"/><path d="M4 18h40"/></>
    }</svg><span style={{fontSize:10,color:T.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{d.shape}</span></div>}
    <div style={{position:"absolute",top:8,right:8,display:"flex",gap:4}}>
      <button onClick={e=>{e.stopPropagation();onCmp(d);}} style={{background:isCmp?"rgba(52,152,219,0.2)":"rgba(0,0,0,.4)",backdropFilter:"blur(8px)",border:"none",cursor:"pointer",color:isCmp?"#3498db":"#fff",width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{I.cmp}</button>
      <button onClick={e=>{e.stopPropagation();onFav(d.id);}} style={{background:"rgba(0,0,0,.4)",backdropFilter:"blur(8px)",border:"none",cursor:"pointer",color:isFav?"#e74c3c":"#fff",width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{I.heart(isFav)}</button>
    </div>
  </div>
  {/* Info area */}
  <div style={{padding:"14px 16px"}}>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:11,color:T.ice,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,background:T.accentGlow,padding:"2px 8px",borderRadius:5,border:`1px solid ${T.border}`}}>{d.code||d.id}</span><span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:T.accentGlow,color:T.ice,fontWeight:600}}>{d.lab}</span></div>
    <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif",marginBottom:2}}>{d.carat} ct {d.shape}</div>
    <div style={{fontSize:12,color:T.textSecondary,marginBottom:12}}>{d.color} · {d.clarity} · {d.cut}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div><div style={{fontSize:22,fontWeight:700,color:T.text}}>{fmtPrice(d.price)}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}><span style={{color:T.textSecondary}}>{fmtPrice(d.pricePerCt)}{t.perCt}</span>{d.discount!==0?<span style={{marginLeft:6,color:T.danger,fontWeight:600}}>{d.discount}%</span>:<span style={{marginLeft:6,color:T.warning,fontWeight:600}}>+10%</span>}</div></div>
    </div>
  </div></div>;};

// ─── Detail Modal ───────────────────────────────────────────────────────
const Detail=({d,onClose,onFav,isFav,usr,onNeedAuth})=>{const{T,t,fmtPrice}=useApp();const[copied,setCopied]=useState(false);if(!d)return null;
  const sp=[[t.shape,d.shape],[t.carat,d.carat],[t.color,d.color],[t.clarity,d.clarity],[t.cut,d.cut],[t.polish,d.polish],[t.symmetry,d.symmetry],[t.fluorescence,d.fluorescence],[t.lab,d.lab],[t.certNum,d.certNumber],[t.depth,d.depth+"%"],[t.table,d.table+"%"],[t.measurements,d.measurements],[t.listed,d.daysListed+" "+t.daysAgo]].filter(([,v])=>v!==undefined&&v!==null&&v!=="");
  const doShare=async()=>{const url=`${window.location.origin}?d=${d.code||d.id}`;const txt=`${d.carat}ct ${d.shape} | ${d.color} ${d.clarity} | $${d.price.toLocaleString()} — DIAMCO`;if(navigator.share){try{await navigator.share({title:`DIAMCO — ${d.carat}ct ${d.shape}`,text:txt,url});}catch(e){}}else{navigator.clipboard?.writeText(url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});}};
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.bgModal,borderRadius:24,padding:"28px 32px",maxWidth:640,width:"100%",border:`1px solid ${T.border}`,maxHeight:"90vh",overflowY:"auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}><div><div style={{fontSize:26,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{d.carat} ct {d.shape}</div><div style={{fontSize:13,color:T.textMuted,marginTop:4}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:T.ice,background:T.accentGlow,padding:"2px 8px",borderRadius:5,border:`1px solid ${T.border}`,fontSize:12}}>{d.code||d.id}</span><span style={{marginLeft:8,color:T.textMuted}}>{d.lab} #{d.certNumber}</span></div></div><button onClick={onClose} style={{background:T.accentGlow,border:"none",color:T.ice,width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.x}</button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24,background:T.accentGlow,borderRadius:16,padding:20,border:`1px solid ${T.border}`}}>{sp.map(([l,v])=><div key={l}><div style={{fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:".12em",marginBottom:2}}>{l}</div><div style={{fontSize:13,color:T.text,fontWeight:600}}>{v}</div></div>)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:`linear-gradient(135deg,${T.accentGlow},transparent)`,borderRadius:16,padding:24,marginBottom:20,border:`1px solid ${T.border}`}}><div><div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",marginBottom:4}}>{t.totalPrice}</div><div style={{fontSize:36,fontWeight:700,color:T.text}}>{fmtPrice(d.price)}</div><div style={{fontSize:13,color:T.textSecondary}}>{fmtPrice(d.pricePerCt)}{t.perCt}{d.discount!==0?<span style={{marginLeft:8,color:T.danger,fontWeight:600}}>{d.discount}%</span>:<span style={{marginLeft:8,color:T.warning,fontWeight:600}}>+10%</span>}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:12,color:T.textSecondary}}>{d.dealer}</div><div style={{fontSize:11,color:T.textMuted,marginTop:4}}>{d.city}</div></div></div>
    <div style={{display:"flex",gap:10}}><Btn primary style={{flex:1,justifyContent:"center",padding:"14px"}}>{t.contactDealer}</Btn>
      <Btn onClick={()=>onFav(d.id)}>{I.heart(isFav)} {isFav?t.saved:t.save}</Btn>
      <Btn onClick={doShare}>{I.ext} {copied?"Copied!":t.share}</Btn>
    </div>
    {!usr&&<div style={{marginTop:12,padding:"10px 14px",borderRadius:10,background:`${T.warning}18`,border:`1px solid ${T.warning}40`,fontSize:12,color:T.textSecondary,textAlign:"center"}}>
      {t.haveAccount?t.haveAccount:"Sign in"} <button onClick={onNeedAuth} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",fontWeight:600,fontSize:12,textDecoration:"underline"}}>Sign in / Register</button> {" to save & get alerts"}
    </div>}
  </div></div>;};

// ─── Calculator ─────────────────────────────────────────────────────────
const Calc=()=>{const{T,t}=useApp();const[sh,setSh]=useState("Round"),[ct,setCt]=useState("1.00"),[co,setCo]=useState("G"),[cl,setCl]=useState("VS2"),[cu,setCu]=useState("Excellent"),[fl,setFl]=useState("None");
  const pr=useMemo(()=>calcPrice(sh,parseFloat(ct)||1,co,cl,cu,fl),[sh,ct,co,cl,cu,fl]);const ppc=Math.round(pr/(parseFloat(ct)||1));
  const cmps=useMemo(()=>{const c=parseFloat(ct)||1,ci=COLORS_LIST.indexOf(co),cli=CLARITIES.indexOf(cl);return[{l:t.colorM1,v:calcPrice(sh,c,COLORS_LIST[Math.min(ci+1,9)],cl,cu,fl)},{l:t.clarityM1,v:calcPrice(sh,c,co,CLARITIES[Math.min(cli+1,9)],cu,fl)},{l:t.medFluor,v:calcPrice(sh,c,co,cl,cu,"Medium")},{l:t.vgCut,v:calcPrice(sh,c,co,cl,"Very Good",fl)}];},[sh,ct,co,cl,cu,fl,t]);
  const Sel=({label,opts,value,onChange})=><div><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:6}}>{label}</div><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>;
  return<div style={{maxWidth:960,margin:"0 auto"}}><div style={{marginBottom:28}}><h2 style={{fontSize:28,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif",margin:0}}>{t.calcTitle}</h2><p style={{color:T.textSecondary,fontSize:13,marginTop:6}}>{t.calcDesc}</p></div>
    <div className="calc-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:28}}><div style={{background:T.bgCard,borderRadius:20,padding:28,border:`1px solid ${T.border}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Sel label={t.shape} opts={SHAPES} value={sh} onChange={setSh}/><div><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:6}}>{t.carat}</div><input type="number" step=".01" min=".1" max="20" value={ct} onChange={e=>setCt(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:13,boxSizing:"border-box"}}/></div><Sel label={t.color} opts={COLORS_LIST} value={co} onChange={setCo}/><Sel label={t.clarity} opts={CLARITIES} value={cl} onChange={setCl}/><Sel label={t.cut} opts={CUTS} value={cu} onChange={setCu}/><Sel label={t.fluorescence} opts={FLUORESCENCE} value={fl} onChange={setFl}/></div></div>
      <div><div style={{background:`linear-gradient(135deg,${T.accentGlow},transparent)`,borderRadius:20,padding:28,border:`1px solid ${T.borderHover}`,textAlign:"center",marginBottom:14}}><div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",marginBottom:8}}>{t.estimatedPrice}</div><div style={{fontSize:52,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>${pr.toLocaleString()}</div><div style={{fontSize:14,color:T.textSecondary,marginTop:4}}>${ppc.toLocaleString()} {t.perCarat}</div></div>
        <div style={{background:T.bgCard,borderRadius:16,padding:18,border:`1px solid ${T.border}`}}><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:10}}>{t.whatIf}</div>{cmps.map((c,i)=>{const df=c.v-pr,pc=((df/pr)*100).toFixed(1);return<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:12,color:T.textSecondary}}>{c.l}</span><span style={{fontSize:12,color:df<0?T.success:T.danger,fontWeight:600}}>{df<0?t.saveMoney:t.plus} ${Math.abs(df).toLocaleString()} ({pc}%)</span></div>;})}
          {(()=>{const totalSave=cmps.reduce((s,c)=>s+(c.v<pr?pr-c.v:0),0);return totalSave>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 2px",marginTop:2}}><span style={{fontSize:12,fontWeight:700,color:T.text}}>Макс. экономия (все)</span><span style={{fontSize:13,fontWeight:700,color:T.success}}>до −${totalSave.toLocaleString()}</span></div>;})()} </div></div></div>
    <div className="edu-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>{[{n:t.carat,d:t.caratEd,e:"⚖️"},{n:t.cut,d:t.cutEd,e:"✨"},{n:t.color,d:t.colorEd,e:"💠"},{n:t.clarity,d:t.clarityEd,e:"🔬"}].map(c=><div key={c.n} style={{background:T.bgCard,borderRadius:14,padding:18,border:`1px solid ${T.border}`}}><div style={{fontSize:26,marginBottom:6}}>{c.e}</div><div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>{c.n}</div><div style={{fontSize:11,color:T.textSecondary,lineHeight:1.5}}>{c.d}</div></div>)}</div>
    <div style={{marginTop:16,padding:"12px 16px",borderRadius:12,background:T.accentGlow,border:`1px solid ${T.border}`,fontSize:11,color:T.textMuted,lineHeight:1.6}}>
      ⚠️ <strong style={{color:T.textSecondary}}>Disclaimer:</strong> Estimated prices are based on Rapaport methodology and are for informational purposes only. Actual market prices may vary. DIAMCO does not guarantee any specific price. Prices are indicated in USD and are subject to change without notice.
    </div></div>;};

// ─── Analytics ──────────────────────────────────────────────────────────
const Anlt=()=>{const{T,t,ALL_D}=useApp();const[ss,setSs]=useState("Round");
  const sd=useMemo(()=>{const c={};ALL_D.forEach(d=>{c[d.shape]=(c[d.shape]||0)+1;});return Object.entries(c).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);},[ALL_D]);
  const abc=useMemo(()=>{const d={};ALL_D.filter(x=>x.shape===ss&&x.carat>=.9&&x.carat<=1.5).forEach(x=>{if(!d[x.color])d[x.color]={s:0,c:0};d[x.color].s+=x.pricePerCt;d[x.color].c++;});return COLORS_LIST.map(c=>({color:c,avg:d[c]?Math.round(d[c].s/d[c].c):0})).filter(x=>x.avg>0);},[ss,ALL_D]);
  const PC=["#7eb8d8","#a8d8ee","#4a8baa","#d0eaf5","#5b9cb8","#89c4e1","#3a7a98","#b8dff0","#6aacca","#c8e8f5"];
  const CTooltip=({active,payload,label})=>{if(!active||!payload?.length)return null;return<div style={{background:T.tooltipBg,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",boxShadow:`0 8px 32px ${T.shadow}`}}><div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:4}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:T.textSecondary,fontSize:12}}><span style={{color:p.color||T.ice,marginRight:6}}>●</span>{p.name}: <span style={{color:T.text,fontWeight:600}}>${p.value?.toLocaleString()}/ct</span></div>)}</div>;};
  const CTooltipSimple=({active,payload})=>{if(!active||!payload?.length)return null;return<div style={{background:T.tooltipBg,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",boxShadow:`0 8px 32px ${T.shadow}`}}>{payload.map((p,i)=><div key={i} style={{color:T.text,fontWeight:600,fontSize:13}}>{p.name}: <span style={{color:T.ice}}>{p.value}</span></div>)}</div>;};
  return<div style={{maxWidth:1100,margin:"0 auto"}}><div style={{marginBottom:28}}><h2 style={{fontSize:28,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif",margin:0}}>{t.analyticsTitle}</h2><p style={{color:T.textSecondary,fontSize:13,marginTop:6}}>{t.from} {SRCS.length} {t.sources} В· {ALL_D.length} {t.tracked}</p></div>
    
    <div style={{background:T.bgCard,borderRadius:20,padding:28,marginBottom:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:2}}>{t.priceTrends}</div><div style={{fontSize:12,color:T.textMuted,marginBottom:20}}>{t.avgPop}</div>
      <ResponsiveContainer width="100%" height={280}><AreaChart data={PH}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.ice} stopOpacity={.15}/><stop offset="100%" stopColor={T.ice} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="month" stroke={T.textSecondary} fontSize={11}/><YAxis stroke={T.textSecondary} fontSize={11} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/><Tooltip content={CTooltip}/><Area type="monotone" dataKey="r1" stroke={T.ice} strokeWidth={2.5} fill="url(#g1)" name="Round 1ct"/><Line type="monotone" dataKey="r2" stroke="#a8d8ee" strokeWidth={2} dot={false} name="Round 2ct"/><Line type="monotone" dataKey="o1" stroke="#4a8baa" strokeWidth={1.8} dot={false} name="Oval 1ct"/></AreaChart></ResponsiveContainer></div>
    <div className="an-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
      <div style={{background:T.bgCard,borderRadius:20,padding:28,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.shapeDist}</div><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={sd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={40} strokeWidth={0} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={{stroke:T.textDim}} fontSize={11} fill={T.text}>{sd.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip content={CTooltipSimple}/></PieChart></ResponsiveContainer></div>
      <div style={{background:T.bgCard,borderRadius:20,padding:28,border:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontSize:16,fontWeight:700,color:T.text}}>{t.avgByColor}</div><select value={ss} onChange={e=>setSs(e.target.value)} style={{padding:"4px 8px",borderRadius:8,background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,fontSize:11}}>{SHAPES.map(s=><option key={s}>{s}</option>)}</select></div><ResponsiveContainer width="100%" height={240}><BarChart data={abc}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="color" stroke={T.textSecondary} fontSize={11}/><YAxis stroke={T.textSecondary} fontSize={10} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/><Tooltip content={CTooltip}/><Bar dataKey="avg" radius={[6,6,0,0]}>{abc.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>
    </div>
    <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginTop:24}}>{[{l:t.totalListings,v:ALL_D.length,s:`${t.from} ${SRCS.length} ${t.sources}`},{l:t.avgPriceCt,v:ALL_D.length?`$${Math.round(ALL_D.reduce((s,d)=>s+d.pricePerCt,0)/ALL_D.length).toLocaleString()}`:"—",s:t.allShapes},{l:t.avgDiscount,v:ALL_D.length?`${(ALL_D.reduce((s,d)=>s+d.discount,0)/ALL_D.length).toFixed(1)}%`:"—",s:t.offRap},{l:t.activeDealers,v:new Set(ALL_D.map(d=>d.dealer)).size,s:`${t.inCities} ${new Set(ALL_D.map(d=>d.city)).size} ${t.cities}`}].map(s=><div key={s.l} style={{background:T.bgCard,borderRadius:14,padding:18,textAlign:"center",border:`1px solid ${T.border}`}}><div style={{fontSize:28,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{s.v}</div><div style={{fontSize:12,fontWeight:600,color:T.ice,marginTop:4}}>{s.l}</div><div style={{fontSize:10,color:T.textMuted,marginTop:2}}>{s.s}</div></div>)}</div></div>;};

// ─── Auth ───────────────────────────────────────────────────────────────
const Auth=({onClose,onAuth,initMode="login"})=>{const{T,t}=useApp();const[mode,setMode]=useState(initMode),[em,setEm]=useState(""),[pw,setPw]=useState(""),[nm,setNm]=useState(""),[co,setCo]=useState(""),[rl,setRl]=useState("buyer");
  const go=()=>{if(!em||!pw)return;onAuth({email:em,name:nm||em.split("@")[0],company:co,role:rl,savedSearches:[],alerts:[],favorites:[]});onClose();};
  const goGoogle=()=>{onAuth({email:"user@gmail.com",name:"Google User",company:"",role:"buyer",savedSearches:[],alerts:[],favorites:[],authProvider:"google"});onClose();};
  const inp={width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",marginBottom:12};
  const GoogleBtn=({label})=><button onClick={goGoogle} style={{width:"100%",padding:"12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:14,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:"'Outfit',sans-serif",marginBottom:16,transition:"all .2s"}} onMouseEnter={e=>e.target.style.borderColor=T.ice} onMouseLeave={e=>e.target.style.borderColor=T.border}><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>{label}</button>;
  const Divider=()=><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><div style={{flex:1,height:1,background:T.border}}/><span style={{fontSize:12,color:T.textMuted}}>{t.orEmail}</span><div style={{flex:1,height:1,background:T.border}}/></div>;
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,padding:16}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.bgModal,borderRadius:24,padding:36,maxWidth:420,width:"100%",border:`1px solid ${T.border}`}}>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:8}}><svg width={32} height={27} viewBox="0 0 100 75" fill="none"><defs><linearGradient id="adg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.iceLight||T.ice}/><stop offset="100%" stopColor={T.ice}/></linearGradient></defs><g stroke="url(#adg)" strokeWidth="2.5" strokeLinejoin="round"><path d="M50 72L5 30 18 7h64l13 23L50 72z"/><path d="M5 30h90"/><path d="M50 72L37 30M50 72L63 30"/><path d="M18 7L37 30M82 7L63 30"/><path d="M50 7v23"/><path d="M18 7l19 23h26l19-23" opacity=".35"/></g></svg><span style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",color:T.text}}>DIAMCO</span></div><p style={{fontSize:13,color:T.textSecondary}}>{mode==="login"?t.welcomeBack:t.joinMP}</p></div>
    <GoogleBtn label={mode==="login"?t.googleSignIn:t.googleSignUp}/><Divider/>
    {mode==="register"&&<><input placeholder={t.fullName} value={nm} onChange={e=>setNm(e.target.value)} style={inp}/><input placeholder={t.company} value={co} onChange={e=>setCo(e.target.value)} style={inp}/><div style={{display:"flex",gap:8,marginBottom:12}}>{[["buyer",t.buyer],["seller",t.seller],["both",t.both]].map(([v,l])=><button key={v} onClick={()=>setRl(v)} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${rl===v?T.ice:T.border}`,background:rl===v?T.chipActive:"transparent",color:rl===v?T.text:T.textMuted,fontSize:12,cursor:"pointer",fontWeight:rl===v?600:400}}>{l}</button>)}</div></>}
    <input placeholder={t.email} type="email" value={em} onChange={e=>setEm(e.target.value)} style={inp}/><input placeholder={t.password} type="password" value={pw} onChange={e=>setPw(e.target.value)} style={inp}/>
    <Btn primary onClick={go} style={{width:"100%",justifyContent:"center",padding:"14px",marginTop:4}}>{mode==="login"?t.signIn:t.register}</Btn>
    <p style={{textAlign:"center",fontSize:12,color:T.textMuted,marginTop:16}}>{mode==="login"?<>{t.noAccount} <button onClick={()=>setMode("register")} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",textDecoration:"underline",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>{t.register}</button></>:<>{t.haveAccount} <button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",textDecoration:"underline",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>{t.signIn}</button></>}</p></div></div>;};

// ─── Profile ────────────────────────────────────────────────────────────
const Prof=({user:u,setUser,onGo})=>{const{T,t,ALL_D}=useApp();const favD=ALL_D.filter(d=>u.favorites?.includes(d.id));
  return<div style={{maxWidth:1000,margin:"0 auto"}}><div style={{background:T.bgCard,borderRadius:20,padding:28,marginBottom:24,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:16}}>
    <div style={{width:56,height:56,borderRadius:"50%",background:T.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#fff"}}>{(u.name||"U")[0].toUpperCase()}</div>
    <div><div style={{fontSize:22,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{u.name}</div><div style={{fontSize:13,color:T.textSecondary}}>{u.email} В· {u.role}</div></div></div>
    <div className="prof-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
      <div style={{background:T.bgCard,borderRadius:20,padding:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.savedSearches}</div>
        {(!u.savedSearches?.length)?<div style={{textAlign:"center",padding:"28px 0"}}><div style={{fontSize:13,color:T.textSecondary,marginBottom:12}}>{t.noSaved}</div><Btn small primary onClick={()=>onGo()}>{t.startSearch}</Btn></div>
        :u.savedSearches.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<u.savedSearches.length-1?`1px solid ${T.border}`:"none"}}><div><div style={{fontSize:13,color:T.text}}>{s.name}</div><div style={{fontSize:11,color:T.textMuted}}>{s.description}</div></div><div style={{display:"flex",gap:4}}><button onClick={()=>onGo(s)} style={{background:T.accentGlow,border:"none",color:T.ice,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>{t.load}</button><button onClick={()=>setUser(p=>({...p,savedSearches:p.savedSearches.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",padding:4,display:"flex"}}>{I.del}</button></div></div>)}</div>
      <div style={{background:T.bgCard,borderRadius:20,padding:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.priceAlerts}</div>
        {(!u.alerts?.length)?<div style={{textAlign:"center",padding:"28px 0"}}><div style={{fontSize:13,color:T.textSecondary}}>{t.noAlerts}</div><div style={{fontSize:11,color:T.textMuted}}>{t.alertDesc}</div></div>
        :u.alerts.map((a,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<u.alerts.length-1?`1px solid ${T.border}`:"none"}}><div><div style={{fontSize:13,color:T.text}}>{a.description}</div><div style={{fontSize:11,color:T.textMuted}}>{t.alertWhen} ${a.targetPrice?.toLocaleString()}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:a.triggered?`${T.success}18`:`${T.warning}18`,color:a.triggered?T.success:T.warning,fontWeight:600}}>{a.triggered?t.triggered:t.watching}</span><button onClick={()=>setUser(p=>({...p,alerts:p.alerts.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",padding:4,display:"flex"}}>{I.del}</button></div></div>)}</div>
    </div>
    <div style={{background:T.bgCard,borderRadius:20,padding:24,marginTop:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.favorites} ({favD.length})</div>
      {!favD.length?<div style={{textAlign:"center",padding:"28px 0",fontSize:13,color:T.textSecondary}}>{t.noFavs}</div>
      :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>{favD.slice(0,8).map(d=><div key={d.id} style={{background:T.accentGlow,borderRadius:12,padding:14,border:`1px solid ${T.border}`}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{d.carat}ct {d.shape}</div><div style={{fontSize:11,color:T.textSecondary}}>{d.color} В· {d.clarity}</div><div style={{fontSize:16,fontWeight:700,color:T.text,marginTop:6}}>${d.price.toLocaleString()}</div></div>)}</div>}
    </div></div>;};

// ─── Settings ───────────────────────────────────────────────────────────
const Sett=({onClose,tn,setTn,ln,setLn})=>{const{T,t}=useApp();
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1200,padding:16}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.bgModal,borderRadius:24,padding:36,maxWidth:400,width:"100%",border:`1px solid ${T.border}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}><h2 style={{fontSize:22,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif",margin:0}}>{t.settingsTitle}</h2><button onClick={onClose} style={{background:T.accentGlow,border:"none",color:T.ice,width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.x}</button></div>
    <div style={{marginBottom:24}}><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:T.ice,marginBottom:10}}>{t.theme}</div><div style={{display:"flex",gap:10}}>{[["dark",t.dark,I.moon],["light",t.light,I.sun]].map(([k,lb,ic])=><button key={k} onClick={()=>setTn(k)} style={{flex:1,padding:"16px",borderRadius:14,border:`2px solid ${tn===k?T.ice:T.border}`,background:tn===k?T.chipActive:"transparent",color:tn===k?T.text:T.textMuted,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,fontFamily:"'Outfit',sans-serif"}}><div style={{color:tn===k?T.ice:T.textDim}}>{ic}</div><span style={{fontSize:13,fontWeight:tn===k?700:400}}>{lb}</span></button>)}</div></div>
    <div><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:T.ice,marginBottom:10}}>{t.language}</div><div style={{display:"flex",flexDirection:"column",gap:6}}>{Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>setLn(k)} style={{padding:"14px 16px",borderRadius:12,border:`2px solid ${ln===k?T.ice:T.border}`,background:ln===k?T.chipActive:"transparent",color:ln===k?T.text:T.textSecondary,cursor:"pointer",fontSize:14,fontWeight:ln===k?700:400,fontFamily:"'Outfit',sans-serif",textAlign:"start",display:"flex",justifyContent:"space-between",direction:v.dir}}><span>{v.label}</span>{ln===k&&<span style={{color:T.ice}}>✓</span>}</button>)}</div></div>
  </div></div>;};

// ═══════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════
export default function DIAMCO(){
  const [ALL_D,setALL_D]=useState([]);
  const[tn,setTn]=useState("dark"),[ln,setLn]=useState("en"),[cn,setCn]=useState("USD");
  const[rates,setRates]=useState({USD:1,RUB:90,AED:3.67});
  const [,_refresh]=useState(0);

  useEffect(()=>{
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(r=>r.json()).then(d=>{if(d.rates)setRates({USD:1,RUB:d.rates.RUB||90,AED:d.rates.AED||3.67});})
      .catch(()=>{});
  },[]);

  useEffect(()=>{
    if(!("serviceWorker" in navigator))return;
    const check=()=>navigator.serviceWorker.getRegistrations().then(regs=>regs.forEach(r=>r.update()));
    const id=setInterval(check,5*60*1000);
    return()=>clearInterval(id);
  },[]);

  const fmtPrice=(usd)=>{
    if(!usd&&usd!==0)return"—";
    const v=Math.round(usd*rates[cn]);
    if(cn==="RUB")return`${v.toLocaleString()} ₽`;
    if(cn==="AED")return`${v.toLocaleString()} د.إ`;
    return`$${v.toLocaleString()}`;
  };
  
  useEffect(()=>{
    // price_client calculation based on Rap discount difference
    // Supplier gives e.g. -42% from Rap → price in DB
    // We sell client at (supplier_disc - margin)% from Rap
    // Margin: ≤2ct=7%, 2–6ct=5%, 6+ct=3%  |  Fancy Color: supplier_price × 1.30
    const calcClientPrice=(d)=>{
      if(d.rap_price&&d.disc_pct!=null){
        const rapTotal=d.rap_price*d.carat;
        const discAbs=Math.abs(d.disc_pct);
        const margin=d.carat<=2?0.07:d.carat<=6?0.05:0.03;
        const clientDisc=Math.max(0,discAbs-margin);
        return Math.round(rapTotal*(1-clientDisc));
      }
      // Fancy Color or no Rap data → use stored price_client, fallback price×1.30
      return d.price_client||Math.round((d.price||0)*1.30);
    };
    supabase.from("diamonds").select("*").eq("available",true).then(({data})=>{
      if(data)setALL_D(data.map(d=>{
        const pc=calcClientPrice(d);
        return{...d,
          price:pc,
          pricePerCt:pc&&d.carat?Math.round(pc/d.carat):0,
          discount:d.disc_pct!=null?+(d.disc_pct*100).toFixed(1):0,
          lastPriceChange:0,dealer:"DIAMCO",natural:true,
          daysListed:0,source:"DIAMCO",city:d.city||"Dubai",
          certNumber:d.cert_number||d.certNumber||""};
      }));
    });
  },[]);
  const T=THEMES[tn],t=LANGS[ln],isRTL=t.dir==="rtl";
  const[splash,setSplash]=useState(true),[welcome,setWelcome]=useState(false),[splashFade,setSplashFade]=useState(false),[welcomeFade,setWelcomeFade]=useState(false);
  const[pg,setPg]=useState("search"),[usr,setUsr]=useState(null),[showAuth,setShowAuth]=useState(false),[authMode,setAuthMode]=useState("login"),[showSett,setShowSett]=useState(false),
    [favs,setFavs]=useState(new Set()),[cmpList,setCmpList]=useState([]),[showCmp,setShowCmp]=useState(false),
    [selD,setSelD]=useState(null),[sTxt,setSTxt]=useState(""),[mobMenu,setMobMenu]=useState(false),[mobFilt,setMobFilt]=useState(false);
  const[fSh,setFSh]=useState([]),[fCo,setFCo]=useState([]),[fCl,setFCl]=useState([]),[fCu,setFCu]=useState([]),
    [fCt,setFCt]=useState([.2,20]),[fPr,setFPr]=useState([0,1000000]),[fLb,setFLb]=useState([]),[fSr,setFSr]=useState([]),
    [sort,setSort]=useState("price-asc"),[showF,setShowF]=useState(true);

  const[cookieOk,setCookieOk]=useState(()=>!!localStorage.getItem("diamco_cookie"));
  const togFav=useCallback(id=>{setFavs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});if(usr)setUsr(p=>{const f=p.favorites||[];return{...p,favorites:f.includes(id)?f.filter(x=>x!==id):[...f,id]};});},[usr]);
  const safeFav=useCallback(id=>{if(!usr){setAuthMode("login");setShowAuth(true);return;}togFav(id);},[usr,togFav]);
  const togCmp=useCallback(d=>setCmpList(p=>p.find(x=>x.id===d.id)?p.filter(x=>x.id!==d.id):p.length<4?[...p,d]:p),[]);

  const filtered=useMemo(()=>{let r=ALL_D.filter(d=>{if(fSh.length&&!fSh.includes(d.shape))return false;if(fCo.length&&!fCo.includes(d.color))return false;if(fCl.length&&!fCl.includes(d.clarity))return false;if(fCu.length&&!fCu.includes(d.cut))return false;if(fLb.length&&!fLb.includes(d.lab))return false;if(d.carat<fCt[0]||d.carat>fCt[1])return false;if(d.price<fPr[0]||d.price>fPr[1])return false;if(sTxt){const q=sTxt.toLowerCase();return d.id.toLowerCase().includes(q)||(d.code||"").toLowerCase().includes(q)||d.dealer.toLowerCase().includes(q)||d.shape.toLowerCase().includes(q)||(d.city||"").toLowerCase().includes(q)||d.color.toLowerCase().includes(q)||d.clarity.toLowerCase().includes(q)||(d.certNumber||"").toLowerCase().includes(q);}return true;});const[k,dir]=sort.split("-");r.sort((a,b)=>dir==="asc"?a[k]-b[k]:b[k]-a[k]);return r;},[fSh,fCo,fCl,fCu,fLb,fCt,fPr,sort,sTxt]);

  const saveSrch=()=>{if(!usr){setShowAuth(true);return;}const desc=[fSh.length?fSh.join(","):"",fCt[0]!==.2||fCt[1]!==6?`${fCt[0]}-${fCt[1]}ct`:""].filter(Boolean).join(" В· ")||t.catalog;setUsr(p=>({...p,savedSearches:[...(p.savedSearches||[]),{name:`#${(p.savedSearches?.length||0)+1}`,description:desc,filters:{fSh,fCo,fCl,fCu,fCt,fPr,fLb,fSr},resultCount:filtered.length}]}));};
  const mkAlert=()=>{if(!usr){setShowAuth(true);return;}const desc=[fSh.length?fSh.join(","):""].filter(Boolean).join(" В· ")||t.catalog;setUsr(p=>({...p,alerts:[...(p.alerts||[]),{description:desc,targetPrice:filtered.length?Math.round(filtered.reduce((s,d)=>s+d.price,0)/filtered.length*.9):5000,triggered:Math.random()>.7}]}));};
  const loadSrch=s=>{if(s?.filters){const f=s.filters;setFSh(f.fSh||[]);setFCo(f.fCo||[]);setFCl(f.fCl||[]);setFCu(f.fCu||[]);setFCt(f.fCt||[.2,20]);setFPr(f.fPr||[0,1000000]);setFLb(f.fLb||[]);setFSr(f.fSr||[]);}setPg("search");};
  const reset=()=>{setFSh([]);setFCo([]);setFCl([]);setFCu([]);setFCt([.2,20]);setFPr([0,1000000]);setFLb([]);setFSr([]);};

  const nav=[{id:"search",lb:t.catalog,ic:I.search},{id:"calculator",lb:t.calculator,ic:I.calc},{id:"analytics",lb:t.analytics,ic:I.chart}];

  const Filt=()=><><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:15,fontWeight:700,color:T.text}}>{t.filters}</span><button onClick={reset} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif"}}>{t.resetAll}</button></div>
    <Chips label={t.shape} opts={SHAPES} sel={fSh} onChange={setFSh}/><Range label={t.carat} min={.2} max={20} step={.1} value={fCt} onChange={setFCt} fmt={v=>`${v}ct`}/>
    <Chips label={t.color} opts={COLORS_LIST} sel={fCo} onChange={setFCo} tip={t.colorTip}/><Chips label={t.clarity} opts={CLARITIES} sel={fCl} onChange={setFCl} tip={t.clarityTip}/>
    <Chips label={t.cut} opts={CUTS} sel={fCu} onChange={setFCu}/><Chips label={t.lab} opts={LABS} sel={fLb} onChange={setFLb}/>
    <Range label={t.price} min={0} max={1000000} step={5000} value={fPr} onChange={setFPr} fmt={v=>`$${(v/1000).toFixed(0)}k`}/></>;

  const enterWelcome=()=>{setSplashFade(true);setTimeout(()=>{setSplash(false);setWelcome(true);},500);};
  const enterAsGuest=()=>{setWelcomeFade(true);setTimeout(()=>setWelcome(false),500);};
  const enterWithAuth=(mode)=>{setAuthMode(mode);setShowAuth(true);setWelcomeFade(true);setTimeout(()=>setWelcome(false),500);};

  // ─── Splash Screen ───
  if(splash)return<div onClick={enterWelcome} style={{position:"fixed",inset:0,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:9999,opacity:splashFade?0:1,transition:"opacity .5s ease-out",fontFamily:"'Outfit',sans-serif"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <img src="/logo.png" alt="DIAMCO" style={{width:280,maxWidth:"60vw",animation:"pulse 3s ease-in-out infinite"}}/>
  </div>;

  // ─── Welcome Screen (Auth choices) ───
  if(welcome)return<div style={{position:"fixed",inset:0,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9998,opacity:welcomeFade?0:1,transition:"opacity .5s ease-out",fontFamily:"'Outfit',sans-serif",padding:24}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    <img src="/logo.png" alt="DIAMCO" style={{width:120,maxWidth:"30vw",marginBottom:16,animation:"fadeUp .6s ease-out both"}}/>
    <div style={{fontSize:13,color:"#8ba8bc",marginBottom:40,animation:"fadeUp .6s ease-out .2s both"}}>{ln==="ru"?"Алмазная торговая платформа":ln==="ar"?"منصة تجارة الألماس":"Diamond Market Platform"}</div>
    <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:12,animation:"fadeUp .6s ease-out .3s both"}}>
      <button onClick={()=>{enterAsGuest();setTimeout(()=>{setAuthMode("register");setShowAuth(true);},600);}} style={{width:"100%",padding:"14px 20px",borderRadius:12,border:"1px solid #e0e5ea",background:"#fff",color:"#333",fontSize:14,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontFamily:"'Outfit',sans-serif",transition:"all .2s",boxShadow:"0 1px 3px rgba(0,0,0,.08)"}} onMouseEnter={e=>{e.target.style.borderColor="#7eb8d8";e.target.style.boxShadow="0 2px 8px rgba(126,184,216,.2)";}} onMouseLeave={e=>{e.target.style.borderColor="#e0e5ea";e.target.style.boxShadow="0 1px 3px rgba(0,0,0,.08)";}}>
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#34A853" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#FBBC05" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        {ln==="ru"?"Продолжить через Google":ln==="ar"?"المتابعة عبر Google":"Continue with Google"}
      </button>
      <button onClick={()=>enterWithAuth("register")} style={{width:"100%",padding:"14px 20px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#4a8baa,#7eb8d8)",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s",boxShadow:"0 2px 8px rgba(126,184,216,.3)"}} onMouseEnter={e=>e.target.style.transform="translateY(-1px)"} onMouseLeave={e=>e.target.style.transform="translateY(0)"}>
        {ln==="ru"?"Зарегистрироваться":ln==="ar"?"إنشاء حساب":"Create Account"}
      </button>
      <button onClick={()=>enterWithAuth("login")} style={{width:"100%",padding:"14px 20px",borderRadius:12,border:"1px solid #7eb8d8",background:"transparent",color:"#4a8baa",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}} onMouseEnter={e=>{e.target.style.background="rgba(126,184,216,.08)";}} onMouseLeave={e=>{e.target.style.background="transparent";}}>
        {ln==="ru"?"Войти":ln==="ar"?"تسجيل الدخول":"Sign In"}
      </button>
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0"}}><div style={{flex:1,height:1,background:"#e0e5ea"}}/><span style={{fontSize:11,color:"#b0bec5"}}>{ln==="ru"?"или":ln==="ar"?"أو":"or"}</span><div style={{flex:1,height:1,background:"#e0e5ea"}}/></div>
      <button onClick={enterAsGuest} style={{width:"100%",padding:"12px 20px",borderRadius:12,border:"none",background:"transparent",color:"#90a4ae",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .2s"}} onMouseEnter={e=>e.target.style.color="#4a8baa"} onMouseLeave={e=>e.target.style.color="#90a4ae"}>
        {ln==="ru"?"Войти как гость →":ln==="ar"?"الدخول كضيف ←":"Continue as guest →"}
      </button>
    </div>
    <div style={{position:"absolute",bottom:24,fontSize:11,color:"#c8d5dd",animation:"fadeUp .6s ease-out .5s both"}}>В© 2025 DIAMCO</div>
  </div>;

  return<Ctx.Provider value={{T,t,isRTL,ALL_D,cn,setCn,fmtPrice}}>
  <div dir={isRTL?"rtl":"ltr"} style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Outfit',sans-serif",transition:"background .3s,color .3s"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px;}select option{background:${T.bgModal};color:${T.text};}::selection{background:rgba(126,184,216,.3);}input:focus,select:focus{outline:none;border-color:${T.ice}!important;}@media(max-width:768px){.dsk{display:none!important;}.mf{grid-template-columns:1fr!important;}.mp{padding:12px!important;}.calc-grid{grid-template-columns:1fr!important;}.stats-grid{grid-template-columns:1fr 1fr!important;}.edu-grid{grid-template-columns:1fr 1fr!important;}.an-grid{grid-template-columns:1fr!important;}.prof-grid{grid-template-columns:1fr!important;}.foot-grid{grid-template-columns:1fr!important;text-align:center;}}@media(min-width:769px){.mob{display:none!important;}}`}</style>

    <header style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`,background:T.headerBg,backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:800,gap:6,flexWrap:"nowrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0,flexShrink:0}}><button className="mob" onClick={()=>setMobMenu(!mobMenu)} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",padding:4,display:"flex"}}>{I.menu}</button>
        <button onClick={()=>{setPg("search");setMobMenu(false);}} style={{display:"flex",alignItems:"center",gap:7,background:"none",border:"none",cursor:"pointer",padding:"4px 6px",borderRadius:10,transition:"background .2s"}} onMouseEnter={e=>e.currentTarget.style.background=T.accentGlow} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <svg width={24} height={20} viewBox="0 0 100 75" fill="none"><defs><linearGradient id="hdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={T.iceLight||T.ice}/><stop offset="100%" stopColor={T.ice}/></linearGradient></defs><g stroke="url(#hdg)" strokeWidth="2.5" strokeLinejoin="round"><path d="M50 72L5 30 18 7h64l13 23L50 72z"/><path d="M5 30h90"/><path d="M50 72L37 30M50 72L63 30"/><path d="M18 7L37 30M82 7L63 30"/><path d="M50 7v23"/><path d="M18 7l19 23h26l19-23" opacity=".35"/></g></svg>
          <span style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif",color:T.text,letterSpacing:".04em"}}>DIAMCO</span>
        </button></div>
      <nav className="dsk" style={{display:"flex",gap:2}}>{nav.map(n=><button key={n.id} onClick={()=>setPg(n.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,background:pg===n.id?T.chipActive:"transparent",color:pg===n.id?T.text:T.textMuted,fontFamily:"'Outfit',sans-serif"}}>{n.ic}{n.lb}</button>)}</nav>
      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        {cmpList.length>0&&<button className="dsk" onClick={()=>setShowCmp(!showCmp)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:10,background:"rgba(52,152,219,.1)",border:"1px solid rgba(52,152,219,.2)",color:"#3498db",cursor:"pointer",fontSize:12,fontWeight:600}}>{I.cmp} {cmpList.length}</button>}
        <button className="dsk" onClick={()=>setShowSett(true)} style={{background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.gear}</button>
        <div style={{display:"flex",gap:2,background:T.accentGlow,border:`1px solid ${T.border}`,borderRadius:10,padding:3}}>{["USD","RUB","AED"].map(c=><button key={c} onClick={()=>setCn(c)} style={{padding:"4px 8px",borderRadius:7,border:"none",background:cn===c?T.gradient:"transparent",color:cn===c?"#fff":T.textMuted,cursor:"pointer",fontSize:11,fontWeight:cn===c?700:400,fontFamily:"'Outfit',sans-serif",transition:"all .2s"}}>{c}</button>)}</div>
        {usr?<button onClick={()=>setPg("profile")} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:pg==="profile"?T.chipActive:"transparent",border:`1px solid ${T.border}`,color:T.text,cursor:"pointer",fontSize:13,fontWeight:500}}><div style={{width:24,height:24,borderRadius:"50%",background:T.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{(usr.name||"U")[0].toUpperCase()}</div><span className="dsk">{usr.name}</span></button>
        :<><Btn small onClick={()=>{setAuthMode("login");setShowAuth(true);}}>{t.signIn}</Btn><Btn primary small onClick={()=>{setAuthMode("register");setShowAuth(true);}}>{t.signUp}</Btn></>}
      </div></header>

    {mobMenu&&<div className="mob" style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:T.name==="dark"?"rgba(6,6,16,.98)":"rgba(244,247,250,.98)",backdropFilter:"blur(20px)",zIndex:790,padding:"60px 24px 24px"}}>
      {nav.map(n=><button key={n.id} onClick={()=>{setPg(n.id);setMobMenu(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0",width:"100%",border:"none",borderBottom:`1px solid ${T.border}`,background:"transparent",color:pg===n.id?T.text:T.textMuted,fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{n.ic}{n.lb}</button>)}
      <button onClick={()=>{setShowSett(true);setMobMenu(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0",width:"100%",border:"none",borderBottom:`1px solid ${T.border}`,background:"transparent",color:T.textMuted,fontSize:16,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{I.gear} {t.settingsTitle}</button>
      {usr&&<button onClick={()=>{setPg("profile");setMobMenu(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0",width:"100%",border:"none",background:"transparent",color:T.text,fontSize:16,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{I.user} {t.profile}</button>}</div>}

    <main className="mp" style={{padding:24,paddingBottom:showCmp&&cmpList.length?300:24}}>
      {pg==="calculator"&&<Calc/>}{pg==="analytics"&&<Anlt/>}
      {pg==="profile"&&usr&&<Prof user={usr} setUser={setUsr} onGo={loadSrch}/>}
      {pg==="search"&&<div style={{display:"flex",gap:20,maxWidth:1400,margin:"0 auto"}}>
        {showF&&<aside className="dsk" style={{width:260,flexShrink:0,background:T.bgCard,borderRadius:20,padding:22,border:`1px solid ${T.border}`,alignSelf:"flex-start",position:"sticky",top:72,maxHeight:"calc(100vh - 96px)",overflowY:"auto"}}><Filt/></aside>}
        {mobFilt&&<div className="mob" style={{position:"fixed",inset:0,background:T.name==="dark"?"rgba(6,6,16,.95)":"rgba(244,247,250,.98)",backdropFilter:"blur(20px)",zIndex:850,padding:24,overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:18,fontWeight:700,color:T.text}}>{t.filters}</span><Btn small onClick={()=>setMobFilt(false)}>OK ({filtered.length})</Btn></div><Filt/></div>}
        <div style={{flex:1,minWidth:0}}>
        <div style={{position:"sticky",top:64,zIndex:700,background:T.bg,paddingTop:8,paddingBottom:10,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <button className="dsk" onClick={()=>setShowF(!showF)} style={{background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:4,fontFamily:"'Outfit',sans-serif"}}>{I.filter} {t.filters}</button>
              <button className="mob" onClick={()=>setMobFilt(true)} style={{background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:4,fontFamily:"'Outfit',sans-serif"}}>{I.filter} {t.filters}</button>
              <span style={{fontSize:13,color:T.textSecondary}}>{filtered.length} {t.diamonds}</span>
              <Btn small onClick={saveSrch} style={{fontSize:11}}>{I.sv} {t.saveSearch}</Btn>
              <Btn small onClick={mkAlert} style={{fontSize:11}}>{I.bell} {t.setAlert}</Btn></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{position:"relative"}}><input placeholder={t.searchPH} value={sTxt} onChange={e=>setSTxt(e.target.value)} style={{padding:`8px 12px 8px ${isRTL?"12px":"34px"}`,paddingRight:isRTL?"34px":"12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:12,width:200,fontFamily:"'Outfit',sans-serif"}}/><span style={{position:"absolute",[isRTL?"right":"left"]:10,top:"50%",transform:"translateY(-50%)",color:T.textDim}}>{I.search}</span></div>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}><option value="price-asc">{t.priceAsc}</option><option value="price-desc">{t.priceDesc}</option><option value="carat-desc">{t.caratDesc}</option><option value="carat-asc">{t.caratAsc}</option><option value="pricePerCt-asc">{t.pctAsc}</option><option value="pricePerCt-desc">{t.pctDesc}</option></select></div></div>
          <div className="mf" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {filtered.slice(0,60).map(d=><Card key={d.id} d={d} onFav={safeFav} isFav={favs.has(d.id)} onCmp={togCmp} isCmp={!!cmpList.find(x=>x.id===d.id)} onSel={setSelD}/>)}</div>
          {filtered.length>60&&<div style={{textAlign:"center",padding:"20px 0",color:T.textMuted,fontSize:12}}>{t.showing} 60 {t.of} {filtered.length}</div>}
          {!filtered.length&&<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:18,color:T.text,fontFamily:"'Playfair Display',serif"}}>{t.noMatch}</div><div style={{fontSize:13,color:T.textSecondary,marginTop:6}}>{t.adjustF} <button onClick={reset} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",textDecoration:"underline"}}>{t.resetAll}</button></div></div>}
        </div></div>}
    </main>

    {/* Footer */}
    <footer style={{borderTop:`1px solid ${T.border}`,background:T.bgCard,padding:"40px 24px 24px",marginTop:40}}>
      <div className="foot-grid" style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:32,marginBottom:28}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <svg width={22} height={19} viewBox="0 0 100 75" fill="none"><g stroke={T.ice} strokeWidth="2.5" strokeLinejoin="round"><path d="M50 72L5 30 18 7h64l13 23L50 72z"/><path d="M5 30h90"/><path d="M50 72L37 30M50 72L63 30"/><path d="M18 7L37 30M82 7L63 30"/><path d="M50 7v23"/><path d="M18 7l19 23h26l19-23" opacity=".35"/></g></svg>
            <span style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',serif",color:T.text,letterSpacing:".04em"}}>DIAMCO</span>
          </div>
          <p style={{fontSize:13,color:T.textSecondary,lineHeight:1.7,maxWidth:360}}>{t.footerAboutTxt}</p>
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:14}}>{t.footerLinks}</div>
          {nav.map(n=><div key={n.id} style={{marginBottom:8}}><button onClick={()=>setPg(n.id)} style={{background:"none",border:"none",color:T.textSecondary,cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",padding:0}} onMouseEnter={e=>e.target.style.color=T.ice} onMouseLeave={e=>e.target.style.color=T.textSecondary}>{n.lb}</button></div>)}
        </div>
        <div>
          <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:14}}>{t.footerContact}</div>
          <div style={{fontSize:13,color:T.textSecondary,marginBottom:8}}>info@diamco.ae</div>
          <div style={{fontSize:13,color:T.textSecondary,marginBottom:8}}>Dubai, UAE</div>
          <div style={{display:"flex",gap:12,marginTop:12}}>
            <a href="https://wa.me/" target="_blank" rel="noopener" style={{color:T.textMuted,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.ice} onMouseLeave={e=>e.target.style.color=T.textMuted}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
            <a href="https://t.me/" target="_blank" rel="noopener" style={{color:T.textMuted,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.ice} onMouseLeave={e=>e.target.style.color=T.textMuted}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>
            <a href="mailto:info@diamco.ae" style={{color:T.textMuted,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color=T.ice} onMouseLeave={e=>e.target.style.color=T.textMuted}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/></svg></a>
          </div>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:11,color:T.textDim}}>© 2025 DIAMCO. {t.footerRights}</span>
        <div style={{display:"flex",gap:16}}>
          <button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif"}}>{t.footerTerms}</button>
          <button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif"}}>{t.footerPrivacy}</button>
          <button style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif"}}>{t.footerSupport}</button>
        </div>
      </div>
      <div style={{marginTop:12,padding:"10px 16px",borderRadius:10,background:`${T.accentGlow}`,border:`1px solid ${T.border}`,display:"flex",flexWrap:"wrap",gap:16,justifyContent:"center"}}>
        <span style={{fontSize:10,color:T.textMuted,textAlign:"center"}}>♦ All diamonds are conflict-free and certified under the <strong style={{color:T.textSecondary}}>Kimberley Process</strong> scheme</span>
        <span style={{fontSize:10,color:T.textMuted,textAlign:"center"}}>· Prices are indicative and subject to change · For informational purposes only</span>
        <span style={{fontSize:10,color:T.textMuted,textAlign:"center"}}>· DIAMCO operates in compliance with UAE PDPL 2022 · DMCC licensed entity</span>
      </div>
    </footer>

    {showCmp&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bgModal,borderTop:`1px solid ${T.borderHover}`,zIndex:900,maxHeight:"55vh",overflowY:"auto",padding:"20px 24px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700,color:T.text}}>{t.compare} ({cmpList.length})</span><Btn small onClick={()=>setShowCmp(false)}>{t.close}</Btn></div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><th style={{textAlign:"start",padding:"6px 10px",color:T.textMuted,fontSize:10}}>{t.spec}</th>{cmpList.map(d=><th key={d.id} style={{textAlign:"center",padding:"6px 10px",color:T.text}}>{d.id}<button onClick={()=>setCmpList(p=>p.filter(x=>x.id!==d.id))} style={{marginLeft:6,background:"none",border:"none",color:T.danger,cursor:"pointer"}}>✕</button></th>)}</tr></thead>
        <tbody>{["shape","carat","color","clarity","cut","price","pricePerCt","discount","source"].map(f=><tr key={f} style={{borderTop:`1px solid ${T.border}`}}><td style={{padding:"6px 10px",color:T.textSecondary}}>{f}</td>{cmpList.map(d=><td key={d.id} style={{textAlign:"center",padding:"6px 10px",color:T.text}}>{f==="price"||f==="pricePerCt"?`$${d[f].toLocaleString()}`:f==="discount"?d[f]+"%":d[f]}</td>)}</tr>)}</tbody></table></div>}

    {selD&&<Detail d={selD} onClose={()=>setSelD(null)} onFav={safeFav} isFav={favs.has(selD?.id)} usr={usr} onNeedAuth={()=>{setAuthMode("login");setShowAuth(true);}}/>}
    {showAuth&&<Auth onClose={()=>setShowAuth(false)} onAuth={u=>{setUsr(u);setShowAuth(false);}} initMode={authMode}/>}
    {showSett&&<Sett onClose={()=>setShowSett(false)} tn={tn} setTn={setTn} ln={ln} setLn={setLn}/>}

    {/* Cookie consent */}
    {!cookieOk&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bgModal,borderTop:`1px solid ${T.border}`,zIndex:1100,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,backdropFilter:"blur(20px)"}}>
      <span style={{fontSize:12,color:T.textSecondary,maxWidth:600}}>🍪 We use cookies to improve your experience. By continuing, you agree to our <button style={{background:"none",border:"none",color:T.ice,cursor:"pointer",fontSize:12,textDecoration:"underline",padding:0}}>Privacy Policy</button> and <button style={{background:"none",border:"none",color:T.ice,cursor:"pointer",fontSize:12,textDecoration:"underline",padding:0}}>Terms of Use</button>.</span>
      <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{localStorage.setItem("diamco_cookie","accepted");setCookieOk(true);}} style={{padding:"8px 20px",borderRadius:8,background:T.gradient,border:"none",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>Accept</button>
          <button onClick={()=>{localStorage.setItem("diamco_cookie","declined");setCookieOk(true);}} style={{padding:"8px 14px",borderRadius:8,background:"transparent",border:`1px solid ${T.border}`,color:T.textMuted,cursor:"pointer",fontSize:12,fontFamily:"'Outfit',sans-serif"}}>Decline</button>
        </div>
    </div>}

    {/* DIAMCO Watermark — always visible for screenshots */}
    <div style={{position:"fixed",bottom:12,[isRTL?"left":"right"]:16,display:"flex",alignItems:"center",gap:5,opacity:.35,pointerEvents:"none",zIndex:700}}>
      <svg width={16} height={14} viewBox="0 0 100 75" fill="none"><g stroke={T.ice} strokeWidth="3" strokeLinejoin="round"><path d="M50 72L5 30 18 7h64l13 23L50 72z"/><path d="M5 30h90"/><path d="M50 72L37 30M50 72L63 30"/><path d="M18 7L37 30M82 7L63 30"/><path d="M50 7v23"/></g></svg>
      <span style={{fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',serif",color:T.ice,letterSpacing:".06em"}}>DIAMCO</span>
    </div>
  </div></Ctx.Provider>;
}





