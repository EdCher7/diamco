import { useState, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import * as recharts from "recharts";
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Area, AreaChart } = recharts;

// ═══════════════════════════════════════════════════════════════════════════
// DIAMCO v2 — Themes (Dark/Light) · Languages (EN/RU/AR) · RTL
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
    saveSearch:"Save Search", setAlert:"Set Alert", searchPH:"Search ID, dealer, city...",
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
    freeForever:"Free forever · No credit card", byReg:"By registering you agree to Terms",
    savedSearches:"Saved Searches", priceAlerts:"Price Alerts", favorites:"Favorites",
    noSaved:"No saved searches yet", startSearch:"Start Searching",
    noAlerts:"No alerts set", alertDesc:"Save a search to get notified when prices drop",
    noFavs:"Tap the heart icon on any diamond to save it here",
    load:"Load", watching:"Watching", triggered:"Triggered!",
    alertWhen:"Alert when price drops below", results:"results", notifications:"Notifications",
    spec:"Spec", showing:"Showing", of:"of", narrowF:"Narrow filters for more specific results.",
    noMatch:"No diamonds match", adjustF:"Adjust your filters or",
    settingsTitle:"Settings", theme:"Theme", dark:"Dark", light:"Light", language:"Language",
    colorTip:"D=Colorless → M=Light Yellow", clarityTip:"FL=Flawless → I2=Visible" },
  ru: { dir:"ltr", label:"Русский",
    catalog:"Каталог", calculator:"Калькулятор", analytics:"Аналитика", profile:"Кабинет",
    signUp:"Регистрация", settings:"Настройки",
    filters:"Фильтры", resetAll:"Сбросить", naturalOnly:"Только натуральные",
    shape:"Форма", carat:"Карат", color:"Цвет", clarity:"Чистота", cut:"Огранка",
    lab:"Лаборатория", price:"Цена", source:"Источник", diamonds:"бриллиантов",
    saveSearch:"Сохранить", setAlert:"Алерт", searchPH:"Поиск: ID, дилер, город...",
    priceAsc:"Цена ↑", priceDesc:"Цена ↓", caratDesc:"Карат ↓", caratAsc:"Карат ↑", pctAsc:"$/ct ↑", pctDesc:"$/ct ↓",
    perCt:"/ct", rap:"Rap", daysAgo:"дн. назад", contactDealer:"Связаться с дилером",
    save:"Сохранить", saved:"Сохранено", share:"Поделиться", compare:"Сравнить", close:"Закрыть",
    excellentDeal:"Отличная цена", fairPrice:"Хорошая цена", premium:"Премиум", value:"Оценка",
    totalPrice:"Итого", polish:"Полировка", symmetry:"Симметрия", fluorescence:"Флуоресценция",
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
    signIn:"Войти", register:"Регистрация", fullName:"Имя", company:"Компания",
    email:"Email", password:"Пароль", buyer:"🛒 Покупатель", seller:"💎 Продавец", both:"🔄 Оба",
    freeForever:"Бесплатно навсегда", byReg:"Регистрируясь, вы принимаете Условия",
    savedSearches:"Сохранённые поиски", priceAlerts:"Алерты цен", favorites:"Избранное",
    noSaved:"Нет сохранённых поисков", startSearch:"Начать поиск",
    noAlerts:"Нет алертов", alertDesc:"Сохраните поиск для уведомлений",
    noFavs:"Нажмите ♡ чтобы сохранить",
    load:"Загрузить", watching:"Отслеживаем", triggered:"Сработал!",
    alertWhen:"Алерт при снижении ниже", results:"результатов", notifications:"Уведомления",
    spec:"Параметр", showing:"Показано", of:"из", narrowF:"Сузьте фильтры.",
    noMatch:"Ничего не найдено", adjustF:"Измените фильтры или",
    settingsTitle:"Настройки", theme:"Тема", dark:"Тёмная", light:"Светлая", language:"Язык",
    colorTip:"D=Бесцветный → M=Жёлтый", clarityTip:"FL=Безупречный → I2=Видимые" },
  ar: { dir:"rtl", label:"العربية",
    catalog:"الكتالوج", calculator:"الحاسبة", analytics:"التحليلات", profile:"حسابي",
    signUp:"تسجيل مجاني", settings:"الإعدادات",
    filters:"تصفية", resetAll:"إعادة", naturalOnly:"طبيعي فقط",
    shape:"الشكل", carat:"القيراط", color:"اللون", clarity:"النقاء", cut:"القطع",
    lab:"المختبر", price:"السعر", source:"المصدر", diamonds:"ألماس",
    saveSearch:"حفظ البحث", setAlert:"تنبيه", searchPH:"بحث: المعرف، التاجر...",
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
    colorTip:"D=عديم اللون → M=أصفر", clarityTip:"FL=مثالي → I2=شوائب مرئية" },
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
const rng=a=>a[Math.floor(Math.random()*a.length)],rf=(a,b)=>+(a+Math.random()*(b-a)).toFixed(2);
const genD=i=>{const sh=rng(SHAPES),ct=rf(.2,6),co=rng(COLORS_LIST),cl=rng(CLARITIES),cu=rng(CUTS),fl=rng(FLUORESCENCE),lb=rng(LABS),src=rng(SRCS),pr=calcPrice(sh,ct,co,cl,cu,fl);
  return{id:`DM-${String(i+10001).padStart(6,"0")}`,shape:sh,carat:ct,color:co,clarity:cl,cut:cu,fluorescence:fl,lab:lb,polish:rng(["Excellent","Very Good","Good"]),symmetry:rng(["Excellent","Very Good","Good"]),price:pr,pricePerCt:Math.round(pr/ct),discount:+( -(12+Math.random()*30)).toFixed(1),dealer:rng(DLRS),city:rng(CITIES),source:src.name,depth:rf(57,66),table:rf(53,63),measurements:`${rf(3.5,11).toFixed(2)} × ${rf(3.5,11).toFixed(2)} × ${rf(2,7).toFixed(2)}`,certNumber:`${Math.floor(1e9+Math.random()*9e9)}`,daysListed:Math.floor(Math.random()*120),lastPriceChange:Math.random()>.6?-(1+Math.random()*8).toFixed(1):Math.random()>.5?+(0.5+Math.random()*3).toFixed(1):0,natural:Math.random()>.08};};
const ALL_D=Array.from({length:500},(_,i)=>genD(i));SRCS.forEach(s=>{s.count=ALL_D.filter(d=>d.source===s.name).length;});
const MONTHS=["Mar'25","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan'26","Feb"];
const PH=MONTHS.map((m,i)=>({month:m,r1:Math.round(6200-i*25+Math.sin(i)*80+(i>8?150:0)),r2:Math.round(14800-i*50+Math.sin(i)*120+(i>8?300:0)),o1:Math.round(5100-i*20+Math.cos(i)*60+(i>9?100:0)),c1:Math.round(4800-i*18+Math.sin(i+1)*55+(i>8?90:0))}));

// ─── Icons ──────────────────────────────────────────────────────────────
const Ic=({d,sz=18,f="none",s="currentColor",w=1.8})=><svg width={sz} height={sz} viewBox="0 0 24 24" fill={f} stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const I={
  diamond:<Ic d={<><path d="M2.7 10.3l9.3 11.7 9.3-11.7-4.3-8.3h-10z"/><path d="M2.7 10.3h18.6"/><path d="M12 22l3-11.7M12 22l-3-11.7"/><path d="M7.7 2l1.3 8.3M16.3 2l-1.3 8.3"/></>} sz={24}/>,
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
const Range=({label,min,max,value:v,onChange,step=.1,fmt=x=>x})=>{const{T}=useApp();return<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice}}>{label}</span><span style={{fontSize:11,color:T.text,fontWeight:500}}>{fmt(v[0])} — {fmt(v[1])}</span></div><div style={{display:"flex",gap:8}}><input type="range" min={min} max={max} step={step} value={v[0]} onChange={e=>onChange([Math.min(+e.target.value,v[1]),v[1]])} style={{flex:1,accentColor:T.ice}}/><input type="range" min={min} max={max} step={step} value={v[1]} onChange={e=>onChange([v[0],Math.max(+e.target.value,v[0])])} style={{flex:1,accentColor:T.ice}}/></div></div>;};
const VS=({d})=>{const{T,t}=useApp();const ci=COLORS_LIST.indexOf(d.color),cli=CLARITIES.indexOf(d.clarity),cui=CUTS.indexOf(d.cut);const sc=Math.max(1,Math.min(10,Math.round(10-(ci*.3+cli*.3+cui*.8)+(d.discount<-25?2:0))));const col=sc>=7?T.success:sc>=4?T.warning:T.danger;return<Tip text={`${t.value} ${sc}/10 — ${sc>=7?t.excellentDeal:sc>=4?t.fairPrice:t.premium}`}><span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:16,background:`${col}18`,color:col,fontSize:11,fontWeight:700}}>{I.star(true)} {sc}/10</span></Tip>;};

// ─── Card ───────────────────────────────────────────────────────────────
const Card=({d,onFav,isFav,onCmp,isCmp,onSel})=>{const[h,setH]=useState(false);const{T,t}=useApp();return<div onClick={()=>onSel(d)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:h?T.bgHover:T.bgCard,borderRadius:16,padding:"18px 20px",cursor:"pointer",border:`1px solid ${h?T.borderHover:T.border}`,transition:"all .25s",transform:h?"translateY(-3px)":"none",backdropFilter:"blur(12px)",boxShadow:h?`0 12px 40px ${T.shadow}`:"none"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
    <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span><span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:T.accentGlow,color:T.ice,fontWeight:600}}>{d.lab}</span><span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"rgba(155,89,182,0.12)",color:"#b39ddb",fontWeight:500}}>{d.source}</span></div>
    <div style={{display:"flex",gap:4}}><button onClick={e=>{e.stopPropagation();onCmp(d);}} style={{background:isCmp?"rgba(52,152,219,0.15)":"transparent",border:"none",cursor:"pointer",color:isCmp?"#3498db":T.textDim,padding:4,borderRadius:6,display:"flex"}}>{I.cmp}</button><button onClick={e=>{e.stopPropagation();onFav(d.id);}} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,padding:4,display:"flex"}}>{I.heart(isFav)}</button></div>
  </div>
  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
    <div style={{width:52,height:52,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${T.accentGlow},transparent)`,border:`1px solid ${T.border}`,color:T.ice}}><svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2.7 10.3l9.3 11.7 9.3-11.7-4.3-8.3h-10z"/><path d="M2.7 10.3h18.6"/></svg></div>
    <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{d.carat} ct {d.shape}</div><div style={{fontSize:12,color:T.textSecondary,marginTop:2}}>{d.color} · {d.clarity} · {d.cut}</div></div>
  </div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
    <div><div style={{fontSize:22,fontWeight:700,color:T.text}}>${d.price.toLocaleString()}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>${d.pricePerCt.toLocaleString()}{t.perCt} · <span style={{color:d.discount<-25?T.success:T.warning}}>{d.discount}%</span>{d.lastPriceChange!==0&&<span style={{marginLeft:6,color:d.lastPriceChange<0?T.success:T.danger}}>{d.lastPriceChange>0?"+":""}{d.lastPriceChange}%</span>}</div></div>
    <VS d={d}/>
  </div></div>;};

// ─── Detail Modal ───────────────────────────────────────────────────────
const Detail=({d,onClose,onFav,isFav})=>{const{T,t}=useApp();if(!d)return null;
  const sp=[[t.shape,d.shape],[t.carat,d.carat],[t.color,d.color],[t.clarity,d.clarity],[t.cut,d.cut],[t.polish,d.polish],[t.symmetry,d.symmetry],[t.fluorescence,d.fluorescence],[t.lab,d.lab],[t.certNum,d.certNumber],[t.depth,d.depth+"%"],[t.table,d.table+"%"],[t.measurements,d.measurements],[t.source,d.source],[t.listed,d.daysListed+" "+t.daysAgo]];
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.bgModal,borderRadius:24,padding:"28px 32px",maxWidth:640,width:"100%",border:`1px solid ${T.border}`,maxHeight:"90vh",overflowY:"auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}><div><div style={{fontSize:26,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{d.carat} ct {d.shape}</div><div style={{fontSize:13,color:T.textMuted,marginTop:4}}>{d.id} · {d.lab} #{d.certNumber}</div></div><button onClick={onClose} style={{background:T.accentGlow,border:"none",color:T.ice,width:36,height:36,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.x}</button></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:24,background:T.accentGlow,borderRadius:16,padding:20,border:`1px solid ${T.border}`}}>{sp.map(([l,v])=><div key={l}><div style={{fontSize:9,color:T.textMuted,textTransform:"uppercase",letterSpacing:".12em",marginBottom:2}}>{l}</div><div style={{fontSize:13,color:T.text,fontWeight:600}}>{v}</div></div>)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:`linear-gradient(135deg,${T.accentGlow},transparent)`,borderRadius:16,padding:24,marginBottom:20,border:`1px solid ${T.border}`}}><div><div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",marginBottom:4}}>{t.totalPrice}</div><div style={{fontSize:36,fontWeight:700,color:T.text}}>${d.price.toLocaleString()}</div><div style={{fontSize:13,color:T.textSecondary}}>${d.pricePerCt.toLocaleString()}{t.perCt}</div></div><div style={{textAlign:"right"}}><VS d={d}/><div style={{fontSize:12,color:T.textSecondary,marginTop:8}}>{d.dealer}</div><div style={{fontSize:11,color:T.textMuted}}>{d.city}</div></div></div>
    <div style={{display:"flex",gap:10}}><Btn primary style={{flex:1,justifyContent:"center",padding:"14px"}}>{t.contactDealer}</Btn><Btn onClick={()=>onFav(d.id)}>{I.heart(isFav)} {isFav?t.saved:t.save}</Btn><Btn>{I.ext} {t.share}</Btn></div>
  </div></div>;};

// ─── Calculator ─────────────────────────────────────────────────────────
const Calc=()=>{const{T,t}=useApp();const[sh,setSh]=useState("Round"),[ct,setCt]=useState("1.00"),[co,setCo]=useState("G"),[cl,setCl]=useState("VS2"),[cu,setCu]=useState("Excellent"),[fl,setFl]=useState("None");
  const pr=useMemo(()=>calcPrice(sh,parseFloat(ct)||1,co,cl,cu,fl),[sh,ct,co,cl,cu,fl]);const ppc=Math.round(pr/(parseFloat(ct)||1));
  const cmps=useMemo(()=>{const c=parseFloat(ct)||1,ci=COLORS_LIST.indexOf(co),cli=CLARITIES.indexOf(cl);return[{l:t.colorM1,v:calcPrice(sh,c,COLORS_LIST[Math.min(ci+1,9)],cl,cu,fl)},{l:t.clarityM1,v:calcPrice(sh,c,co,CLARITIES[Math.min(cli+1,9)],cu,fl)},{l:t.medFluor,v:calcPrice(sh,c,co,cl,cu,"Medium")},{l:t.vgCut,v:calcPrice(sh,c,co,cl,"Very Good",fl)}];},[sh,ct,co,cl,cu,fl,t]);
  const Sel=({label,opts,value,onChange})=><div><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:6}}>{label}</div><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",cursor:"pointer"}}>{opts.map(o=><option key={o}>{o}</option>)}</select></div>;
  return<div style={{maxWidth:960,margin:"0 auto"}}><div style={{marginBottom:28}}><h2 style={{fontSize:28,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif",margin:0}}>{t.calcTitle}</h2><p style={{color:T.textSecondary,fontSize:13,marginTop:6}}>{t.calcDesc}</p></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:28}}><div style={{background:T.bgCard,borderRadius:20,padding:28,border:`1px solid ${T.border}`}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Sel label={t.shape} opts={SHAPES} value={sh} onChange={setSh}/><div><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:6}}>{t.carat}</div><input type="number" step=".01" min=".1" max="20" value={ct} onChange={e=>setCt(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:13,boxSizing:"border-box"}}/></div><Sel label={t.color} opts={COLORS_LIST} value={co} onChange={setCo}/><Sel label={t.clarity} opts={CLARITIES} value={cl} onChange={setCl}/><Sel label={t.cut} opts={CUTS} value={cu} onChange={setCu}/><Sel label={t.fluorescence} opts={FLUORESCENCE} value={fl} onChange={setFl}/></div></div>
      <div><div style={{background:`linear-gradient(135deg,${T.accentGlow},transparent)`,borderRadius:20,padding:28,border:`1px solid ${T.borderHover}`,textAlign:"center",marginBottom:14}}><div style={{fontSize:10,color:T.textMuted,textTransform:"uppercase",marginBottom:8}}>{t.estimatedPrice}</div><div style={{fontSize:52,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>${pr.toLocaleString()}</div><div style={{fontSize:14,color:T.textSecondary,marginTop:4}}>${ppc.toLocaleString()} {t.perCarat}</div></div>
        <div style={{background:T.bgCard,borderRadius:16,padding:18,border:`1px solid ${T.border}`}}><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:T.ice,marginBottom:10}}>{t.whatIf}</div>{cmps.map((c,i)=>{const df=c.v-pr,pc=((df/pr)*100).toFixed(1);return<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}><span style={{fontSize:12,color:T.textSecondary}}>{c.l}</span><span style={{fontSize:12,color:df<0?T.success:T.danger,fontWeight:600}}>{df<0?t.saveMoney:t.plus} ${Math.abs(df).toLocaleString()} ({pc}%)</span></div>;})}</div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>{[{n:t.carat,d:t.caratEd,e:"⚖️"},{n:t.cut,d:t.cutEd,e:"✨"},{n:t.color,d:t.colorEd,e:"💠"},{n:t.clarity,d:t.clarityEd,e:"🔬"}].map(c=><div key={c.n} style={{background:T.bgCard,borderRadius:14,padding:18,border:`1px solid ${T.border}`}}><div style={{fontSize:26,marginBottom:6}}>{c.e}</div><div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>{c.n}</div><div style={{fontSize:11,color:T.textSecondary,lineHeight:1.5}}>{c.d}</div></div>)}</div></div>;};

// ─── Analytics ──────────────────────────────────────────────────────────
const Anlt=()=>{const{T,t}=useApp();const[ss,setSs]=useState("Round");
  const sd=useMemo(()=>{const c={};ALL_D.forEach(d=>{c[d.shape]=(c[d.shape]||0)+1;});return Object.entries(c).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);},[]);
  const abc=useMemo(()=>{const d={};ALL_D.filter(x=>x.shape===ss&&x.carat>=.9&&x.carat<=1.5).forEach(x=>{if(!d[x.color])d[x.color]={s:0,c:0};d[x.color].s+=x.pricePerCt;d[x.color].c++;});return COLORS_LIST.map(c=>({color:c,avg:d[c]?Math.round(d[c].s/d[c].c):0})).filter(x=>x.avg>0);},[ss]);
  const PC=["#7eb8d8","#a8d8ee","#4a8baa","#d0eaf5","#5b9cb8","#89c4e1","#3a7a98","#b8dff0","#6aacca","#c8e8f5"];
  const CTooltip=({active,payload,label})=>{if(!active||!payload?.length)return null;return<div style={{background:T.tooltipBg,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",boxShadow:`0 8px 32px ${T.shadow}`}}><div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:4}}>{label}</div>{payload.map((p,i)=><div key={i} style={{color:T.textSecondary,fontSize:12}}><span style={{color:p.color||T.ice,marginRight:6}}>●</span>{p.name}: <span style={{color:T.text,fontWeight:600}}>${p.value?.toLocaleString()}/ct</span></div>)}</div>;};
  const CTooltipSimple=({active,payload})=>{if(!active||!payload?.length)return null;return<div style={{background:T.tooltipBg,border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 14px",boxShadow:`0 8px 32px ${T.shadow}`}}>{payload.map((p,i)=><div key={i} style={{color:T.text,fontWeight:600,fontSize:13}}>{p.name}: <span style={{color:T.ice}}>{p.value}</span></div>)}</div>;};
  return<div style={{maxWidth:1100,margin:"0 auto"}}><div style={{marginBottom:28}}><h2 style={{fontSize:28,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif",margin:0}}>{t.analyticsTitle}</h2><p style={{color:T.textSecondary,fontSize:13,marginTop:6}}>{t.from} {SRCS.length} {t.sources} · {ALL_D.length} {t.tracked}</p></div>
    <div style={{display:"flex",gap:10,marginBottom:24,overflowX:"auto",paddingBottom:4}}>{SRCS.map(s=><div key={s.name} style={{background:T.bgCard,borderRadius:12,padding:"12px 18px",border:`1px solid ${T.border}`,minWidth:140,flex:"0 0 auto"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{width:8,height:8,borderRadius:"50%",background:s.c}}/><span style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</span></div><div style={{fontSize:11,color:T.textSecondary}}>{s.count} {t.diamonds}</div></div>)}</div>
    <div style={{background:T.bgCard,borderRadius:20,padding:28,marginBottom:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:2}}>{t.priceTrends}</div><div style={{fontSize:12,color:T.textMuted,marginBottom:20}}>{t.avgPop}</div>
      <ResponsiveContainer width="100%" height={280}><AreaChart data={PH}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.ice} stopOpacity={.15}/><stop offset="100%" stopColor={T.ice} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="month" stroke={T.textSecondary} fontSize={11}/><YAxis stroke={T.textSecondary} fontSize={11} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/><Tooltip content={CTooltip}/><Area type="monotone" dataKey="r1" stroke={T.ice} strokeWidth={2.5} fill="url(#g1)" name="Round 1ct"/><Line type="monotone" dataKey="r2" stroke="#a8d8ee" strokeWidth={2} dot={false} name="Round 2ct"/><Line type="monotone" dataKey="o1" stroke="#4a8baa" strokeWidth={1.8} dot={false} name="Oval 1ct"/></AreaChart></ResponsiveContainer></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
      <div style={{background:T.bgCard,borderRadius:20,padding:28,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.shapeDist}</div><ResponsiveContainer width="100%" height={240}><PieChart><Pie data={sd} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={40} strokeWidth={0} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={{stroke:T.textDim}} fontSize={11} fill={T.text}>{sd.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Pie><Tooltip content={CTooltipSimple}/></PieChart></ResponsiveContainer></div>
      <div style={{background:T.bgCard,borderRadius:20,padding:28,border:`1px solid ${T.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontSize:16,fontWeight:700,color:T.text}}>{t.avgByColor}</div><select value={ss} onChange={e=>setSs(e.target.value)} style={{padding:"4px 8px",borderRadius:8,background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,fontSize:11}}>{SHAPES.map(s=><option key={s}>{s}</option>)}</select></div><ResponsiveContainer width="100%" height={240}><BarChart data={abc}><CartesianGrid strokeDasharray="3 3" stroke={T.border}/><XAxis dataKey="color" stroke={T.textSecondary} fontSize={11}/><YAxis stroke={T.textSecondary} fontSize={10} tickFormatter={v=>`$${(v/1000).toFixed(1)}k`}/><Tooltip content={CTooltip}/><Bar dataKey="avg" radius={[6,6,0,0]}>{abc.map((_,i)=><Cell key={i} fill={PC[i%PC.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginTop:24}}>{[{l:t.totalListings,v:ALL_D.length,s:`${t.from} ${SRCS.length} ${t.sources}`},{l:t.avgPriceCt,v:`$${Math.round(ALL_D.reduce((s,d)=>s+d.pricePerCt,0)/ALL_D.length).toLocaleString()}`,s:t.allShapes},{l:t.avgDiscount,v:`${(ALL_D.reduce((s,d)=>s+d.discount,0)/ALL_D.length).toFixed(1)}%`,s:t.offRap},{l:t.activeDealers,v:new Set(ALL_D.map(d=>d.dealer)).size,s:`${t.inCities} ${new Set(ALL_D.map(d=>d.city)).size} ${t.cities}`}].map(s=><div key={s.l} style={{background:T.bgCard,borderRadius:14,padding:18,textAlign:"center",border:`1px solid ${T.border}`}}><div style={{fontSize:28,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{s.v}</div><div style={{fontSize:12,fontWeight:600,color:T.ice,marginTop:4}}>{s.l}</div><div style={{fontSize:10,color:T.textMuted,marginTop:2}}>{s.s}</div></div>)}</div></div>;};

// ─── Auth ───────────────────────────────────────────────────────────────
const Auth=({onClose,onAuth})=>{const{T,t}=useApp();const[mode,setMode]=useState("login"),[em,setEm]=useState(""),[pw,setPw]=useState(""),[nm,setNm]=useState(""),[co,setCo]=useState(""),[rl,setRl]=useState("buyer");
  const go=()=>{if(!em||!pw)return;onAuth({email:em,name:nm||em.split("@")[0],company:co,role:rl,savedSearches:[],alerts:[],favorites:[]});onClose();};
  const inp={width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:14,fontFamily:"'Outfit',sans-serif",boxSizing:"border-box",marginBottom:12};
  return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,padding:16}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:T.bgModal,borderRadius:24,padding:36,maxWidth:420,width:"100%",border:`1px solid ${T.border}`}}>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:8}}><svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={T.ice} strokeWidth="1.3"><path d="M2.7 10.3l9.3 11.7 9.3-11.7-4.3-8.3h-10z"/><path d="M2.7 10.3h18.6"/></svg><span style={{fontSize:26,fontWeight:700,fontFamily:"'Playfair Display',serif",color:T.text}}>DIAMCO</span></div><p style={{fontSize:13,color:T.textSecondary}}>{mode==="login"?t.welcomeBack:t.joinMP}</p></div>
    <div style={{display:"flex",marginBottom:20,borderRadius:10,background:T.accentGlow,padding:3}}>{["login","register"].map(m=><button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif",background:mode===m?T.chipActive:"transparent",color:mode===m?T.text:T.textDim}}>{m==="login"?t.signIn:t.register}</button>)}</div>
    {mode==="register"&&<><input placeholder={t.fullName} value={nm} onChange={e=>setNm(e.target.value)} style={inp}/><input placeholder={t.company} value={co} onChange={e=>setCo(e.target.value)} style={inp}/><div style={{display:"flex",gap:8,marginBottom:12}}>{[["buyer",t.buyer],["seller",t.seller],["both",t.both]].map(([v,l])=><button key={v} onClick={()=>setRl(v)} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${rl===v?T.ice:T.border}`,background:rl===v?T.chipActive:"transparent",color:rl===v?T.text:T.textMuted,fontSize:12,cursor:"pointer",fontWeight:rl===v?600:400}}>{l}</button>)}</div></>}
    <input placeholder={t.email} type="email" value={em} onChange={e=>setEm(e.target.value)} style={inp}/><input placeholder={t.password} type="password" value={pw} onChange={e=>setPw(e.target.value)} style={inp}/>
    <Btn primary onClick={go} style={{width:"100%",justifyContent:"center",padding:"14px",marginTop:4}}>{mode==="login"?t.signIn:t.register}</Btn>
    <p style={{textAlign:"center",fontSize:12,color:T.textMuted,marginTop:16}}>{mode==="login"?t.freeForever:t.byReg}</p></div></div>;};

// ─── Profile ────────────────────────────────────────────────────────────
const Prof=({user:u,setUser,onGo})=>{const{T,t}=useApp();const favD=ALL_D.filter(d=>u.favorites?.includes(d.id));
  return<div style={{maxWidth:1000,margin:"0 auto"}}><div style={{background:T.bgCard,borderRadius:20,padding:28,marginBottom:24,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:16}}>
    <div style={{width:56,height:56,borderRadius:"50%",background:T.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#fff"}}>{(u.name||"U")[0].toUpperCase()}</div>
    <div><div style={{fontSize:22,fontWeight:700,color:T.text,fontFamily:"'Playfair Display',serif"}}>{u.name}</div><div style={{fontSize:13,color:T.textSecondary}}>{u.email} · {u.role}</div></div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
      <div style={{background:T.bgCard,borderRadius:20,padding:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.savedSearches}</div>
        {(!u.savedSearches?.length)?<div style={{textAlign:"center",padding:"28px 0"}}><div style={{fontSize:13,color:T.textSecondary,marginBottom:12}}>{t.noSaved}</div><Btn small primary onClick={()=>onGo()}>{t.startSearch}</Btn></div>
        :u.savedSearches.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<u.savedSearches.length-1?`1px solid ${T.border}`:"none"}}><div><div style={{fontSize:13,color:T.text}}>{s.name}</div><div style={{fontSize:11,color:T.textMuted}}>{s.description}</div></div><div style={{display:"flex",gap:4}}><button onClick={()=>onGo(s)} style={{background:T.accentGlow,border:"none",color:T.ice,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>{t.load}</button><button onClick={()=>setUser(p=>({...p,savedSearches:p.savedSearches.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",padding:4,display:"flex"}}>{I.del}</button></div></div>)}</div>
      <div style={{background:T.bgCard,borderRadius:20,padding:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.priceAlerts}</div>
        {(!u.alerts?.length)?<div style={{textAlign:"center",padding:"28px 0"}}><div style={{fontSize:13,color:T.textSecondary}}>{t.noAlerts}</div><div style={{fontSize:11,color:T.textMuted}}>{t.alertDesc}</div></div>
        :u.alerts.map((a,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<u.alerts.length-1?`1px solid ${T.border}`:"none"}}><div><div style={{fontSize:13,color:T.text}}>{a.description}</div><div style={{fontSize:11,color:T.textMuted}}>{t.alertWhen} ${a.targetPrice?.toLocaleString()}</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,padding:"3px 8px",borderRadius:10,background:a.triggered?`${T.success}18`:`${T.warning}18`,color:a.triggered?T.success:T.warning,fontWeight:600}}>{a.triggered?t.triggered:t.watching}</span><button onClick={()=>setUser(p=>({...p,alerts:p.alerts.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:T.danger,cursor:"pointer",padding:4,display:"flex"}}>{I.del}</button></div></div>)}</div>
    </div>
    <div style={{background:T.bgCard,borderRadius:20,padding:24,marginTop:24,border:`1px solid ${T.border}`}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:16}}>{t.favorites} ({favD.length})</div>
      {!favD.length?<div style={{textAlign:"center",padding:"28px 0",fontSize:13,color:T.textSecondary}}>{t.noFavs}</div>
      :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>{favD.slice(0,8).map(d=><div key={d.id} style={{background:T.accentGlow,borderRadius:12,padding:14,border:`1px solid ${T.border}`}}><div style={{fontSize:14,fontWeight:600,color:T.text}}>{d.carat}ct {d.shape}</div><div style={{fontSize:11,color:T.textSecondary}}>{d.color} · {d.clarity}</div><div style={{fontSize:16,fontWeight:700,color:T.text,marginTop:6}}>${d.price.toLocaleString()}</div></div>)}</div>}
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
  const[tn,setTn]=useState("dark"),[ln,setLn]=useState("en");
  const T=THEMES[tn],t=LANGS[ln],isRTL=t.dir==="rtl";
  const[pg,setPg]=useState("search"),[usr,setUsr]=useState(null),[showAuth,setShowAuth]=useState(false),[showSett,setShowSett]=useState(false),
    [favs,setFavs]=useState(new Set()),[cmpList,setCmpList]=useState([]),[showCmp,setShowCmp]=useState(false),
    [selD,setSelD]=useState(null),[sTxt,setSTxt]=useState(""),[mobMenu,setMobMenu]=useState(false),[mobFilt,setMobFilt]=useState(false);
  const[fSh,setFSh]=useState([]),[fCo,setFCo]=useState([]),[fCl,setFCl]=useState([]),[fCu,setFCu]=useState([]),
    [fCt,setFCt]=useState([.2,6]),[fPr,setFPr]=useState([0,150000]),[fLb,setFLb]=useState([]),[fSr,setFSr]=useState([]),
    [sort,setSort]=useState("price-asc"),[showF,setShowF]=useState(true),[natOnly,setNatOnly]=useState(true);

  const togFav=useCallback(id=>{setFavs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});if(usr)setUsr(p=>{const f=p.favorites||[];return{...p,favorites:f.includes(id)?f.filter(x=>x!==id):[...f,id]};});},[usr]);
  const togCmp=useCallback(d=>setCmpList(p=>p.find(x=>x.id===d.id)?p.filter(x=>x.id!==d.id):p.length<4?[...p,d]:p),[]);

  const filtered=useMemo(()=>{let r=ALL_D.filter(d=>{if(natOnly&&!d.natural)return false;if(fSh.length&&!fSh.includes(d.shape))return false;if(fCo.length&&!fCo.includes(d.color))return false;if(fCl.length&&!fCl.includes(d.clarity))return false;if(fCu.length&&!fCu.includes(d.cut))return false;if(fLb.length&&!fLb.includes(d.lab))return false;if(fSr.length&&!fSr.includes(d.source))return false;if(d.carat<fCt[0]||d.carat>fCt[1])return false;if(d.price<fPr[0]||d.price>fPr[1])return false;if(sTxt){const q=sTxt.toLowerCase();return d.id.toLowerCase().includes(q)||d.dealer.toLowerCase().includes(q)||d.shape.toLowerCase().includes(q)||d.city.toLowerCase().includes(q);}return true;});const[k,dir]=sort.split("-");r.sort((a,b)=>dir==="asc"?a[k]-b[k]:b[k]-a[k]);return r;},[fSh,fCo,fCl,fCu,fLb,fSr,fCt,fPr,sort,sTxt,natOnly]);

  const saveSrch=()=>{if(!usr){setShowAuth(true);return;}const desc=[fSh.length?fSh.join(","):"",fCt[0]!==.2||fCt[1]!==6?`${fCt[0]}-${fCt[1]}ct`:""].filter(Boolean).join(" · ")||t.catalog;setUsr(p=>({...p,savedSearches:[...(p.savedSearches||[]),{name:`#${(p.savedSearches?.length||0)+1}`,description:desc,filters:{fSh,fCo,fCl,fCu,fCt,fPr,fLb,fSr},resultCount:filtered.length}]}));};
  const mkAlert=()=>{if(!usr){setShowAuth(true);return;}const desc=[fSh.length?fSh.join(","):""].filter(Boolean).join(" · ")||t.catalog;setUsr(p=>({...p,alerts:[...(p.alerts||[]),{description:desc,targetPrice:filtered.length?Math.round(filtered.reduce((s,d)=>s+d.price,0)/filtered.length*.9):5000,triggered:Math.random()>.7}]}));};
  const loadSrch=s=>{if(s?.filters){const f=s.filters;setFSh(f.fSh||[]);setFCo(f.fCo||[]);setFCl(f.fCl||[]);setFCu(f.fCu||[]);setFCt(f.fCt||[.2,6]);setFPr(f.fPr||[0,150000]);setFLb(f.fLb||[]);setFSr(f.fSr||[]);}setPg("search");};
  const reset=()=>{setFSh([]);setFCo([]);setFCl([]);setFCu([]);setFCt([.2,6]);setFPr([0,150000]);setFLb([]);setFSr([]);};

  const nav=[{id:"search",lb:t.catalog,ic:I.search},{id:"calculator",lb:t.calculator,ic:I.calc},{id:"analytics",lb:t.analytics,ic:I.chart}];

  const Filt=()=><><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:15,fontWeight:700,color:T.text}}>{t.filters}</span><button onClick={reset} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:11,fontFamily:"'Outfit',sans-serif"}}>{t.resetAll}</button></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,padding:"8px 12px",borderRadius:10,background:natOnly?T.chipActive:"transparent",border:`1px solid ${natOnly?T.ice:T.border}`,cursor:"pointer"}} onClick={()=>setNatOnly(!natOnly)}><span style={{fontSize:12,color:natOnly?T.text:T.textMuted,fontWeight:500}}>{t.naturalOnly}</span><div style={{width:36,height:20,borderRadius:10,background:natOnly?T.ice:`${T.ice}30`,position:"relative"}}><div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,[isRTL?"right":"left"]:natOnly?18:2,transition:"all .2s"}}/></div></div>
    <Chips label={t.shape} opts={SHAPES} sel={fSh} onChange={setFSh}/><Range label={t.carat} min={.2} max={6} step={.1} value={fCt} onChange={setFCt} fmt={v=>`${v}ct`}/>
    <Chips label={t.color} opts={COLORS_LIST} sel={fCo} onChange={setFCo} tip={t.colorTip}/><Chips label={t.clarity} opts={CLARITIES} sel={fCl} onChange={setFCl} tip={t.clarityTip}/>
    <Chips label={t.cut} opts={CUTS} sel={fCu} onChange={setFCu}/><Chips label={t.lab} opts={LABS} sel={fLb} onChange={setFLb}/>
    <Range label={t.price} min={0} max={150000} step={500} value={fPr} onChange={setFPr} fmt={v=>`$${(v/1000).toFixed(0)}k`}/>
    <Chips label={t.source} opts={SRCS.map(s=>s.name)} sel={fSr} onChange={setFSr}/></>;

  return<Ctx.Provider value={{T,t,isRTL}}>
  <div dir={isRTL?"rtl":"ltr"} style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Outfit',sans-serif",transition:"background .3s,color .3s"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px;}select option{background:${T.bgModal};color:${T.text};}::selection{background:rgba(126,184,216,.3);}input:focus,select:focus{outline:none;border-color:${T.ice}!important;}@media(max-width:768px){.dsk{display:none!important;}.mf{grid-template-columns:1fr!important;}.mp{padding:16px!important;}}@media(min-width:769px){.mob{display:none!important;}}`}</style>

    <header style={{padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`,background:T.headerBg,backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:800}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><button className="mob" onClick={()=>setMobMenu(!mobMenu)} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",padding:4,display:"flex"}}>{I.menu}</button>
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={T.ice} strokeWidth="1.3"><path d="M2.7 10.3l9.3 11.7 9.3-11.7-4.3-8.3h-10z"/><path d="M2.7 10.3h18.6"/><path d="M12 22l3-11.7M12 22l-3-11.7"/><path d="M7.7 2l1.3 8.3M16.3 2l-1.3 8.3"/></svg>
        <span style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif",color:T.text,letterSpacing:".04em"}}>DIAMCO</span></div>
      <nav className="dsk" style={{display:"flex",gap:2}}>{nav.map(n=><button key={n.id} onClick={()=>setPg(n.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,background:pg===n.id?T.chipActive:"transparent",color:pg===n.id?T.text:T.textMuted,fontFamily:"'Outfit',sans-serif"}}>{n.ic}{n.lb}</button>)}</nav>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {cmpList.length>0&&<button className="dsk" onClick={()=>setShowCmp(!showCmp)} style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:10,background:"rgba(52,152,219,.1)",border:"1px solid rgba(52,152,219,.2)",color:"#3498db",cursor:"pointer",fontSize:12,fontWeight:600}}>{I.cmp} {cmpList.length}</button>}
        <button onClick={()=>setShowSett(true)} style={{background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,width:36,height:36,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{I.gear}</button>
        {usr?<button onClick={()=>setPg("profile")} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:pg==="profile"?T.chipActive:"transparent",border:`1px solid ${T.border}`,color:T.text,cursor:"pointer",fontSize:13,fontWeight:500}}><div style={{width:24,height:24,borderRadius:"50%",background:T.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{(usr.name||"U")[0].toUpperCase()}</div><span className="dsk">{usr.name}</span></button>
        :<Btn primary small onClick={()=>setShowAuth(true)}>{t.signUp}</Btn>}
      </div></header>

    {mobMenu&&<div className="mob" style={{position:"fixed",top:52,inset:0,background:T.name==="dark"?"rgba(6,6,16,.95)":"rgba(244,247,250,.95)",backdropFilter:"blur(20px)",zIndex:790,padding:24,paddingTop:0}}>
      {nav.map(n=><button key={n.id} onClick={()=>{setPg(n.id);setMobMenu(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0",width:"100%",border:"none",borderBottom:`1px solid ${T.border}`,background:"transparent",color:pg===n.id?T.text:T.textMuted,fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{n.ic}{n.lb}</button>)}
      {usr&&<button onClick={()=>{setPg("profile");setMobMenu(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"14px 0",width:"100%",border:"none",background:"transparent",color:T.text,fontSize:16,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>{I.user} {t.profile}</button>}</div>}

    <main className="mp" style={{padding:24,paddingBottom:showCmp&&cmpList.length?300:24}}>
      {pg==="calculator"&&<Calc/>}{pg==="analytics"&&<Anlt/>}
      {pg==="profile"&&usr&&<Prof user={usr} setUser={setUsr} onGo={loadSrch}/>}
      {pg==="search"&&<div style={{display:"flex",gap:20,maxWidth:1400,margin:"0 auto"}}>
        {showF&&<aside className="dsk" style={{width:260,flexShrink:0,background:T.bgCard,borderRadius:20,padding:22,border:`1px solid ${T.border}`,alignSelf:"flex-start",position:"sticky",top:72,maxHeight:"calc(100vh - 96px)",overflowY:"auto"}}><Filt/></aside>}
        {mobFilt&&<div className="mob" style={{position:"fixed",inset:0,background:T.name==="dark"?"rgba(6,6,16,.95)":"rgba(244,247,250,.98)",backdropFilter:"blur(20px)",zIndex:850,padding:24,overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:18,fontWeight:700,color:T.text}}>{t.filters}</span><Btn small onClick={()=>setMobFilt(false)}>OK ({filtered.length})</Btn></div><Filt/></div>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <button className="dsk" onClick={()=>setShowF(!showF)} style={{background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:4,fontFamily:"'Outfit',sans-serif"}}>{I.filter} {t.filters}</button>
              <button className="mob" onClick={()=>setMobFilt(true)} style={{background:T.accentGlow,border:`1px solid ${T.border}`,color:T.ice,padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",gap:4,fontFamily:"'Outfit',sans-serif"}}>{I.filter} {t.filters}</button>
              <span style={{fontSize:13,color:T.textSecondary}}>{filtered.length} {t.diamonds}</span>
              <Btn small onClick={saveSrch} style={{fontSize:11}}>{I.sv} {t.saveSearch}</Btn>
              <Btn small onClick={mkAlert} style={{fontSize:11}}>{I.bell} {t.setAlert}</Btn></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{position:"relative"}}><input placeholder={t.searchPH} value={sTxt} onChange={e=>setSTxt(e.target.value)} style={{padding:`8px 12px 8px ${isRTL?"12px":"34px"}`,paddingRight:isRTL?"34px":"12px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:12,width:200,fontFamily:"'Outfit',sans-serif"}}/><span style={{position:"absolute",[isRTL?"right":"left"]:10,top:"50%",transform:"translateY(-50%)",color:T.textDim}}>{I.search}</span></div>
              <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${T.border}`,background:T.bgInput,color:T.text,fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}><option value="price-asc">{t.priceAsc}</option><option value="price-desc">{t.priceDesc}</option><option value="carat-desc">{t.caratDesc}</option><option value="carat-asc">{t.caratAsc}</option><option value="pricePerCt-asc">{t.pctAsc}</option><option value="pricePerCt-desc">{t.pctDesc}</option></select></div></div>
          <div className="mf" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
            {filtered.slice(0,60).map(d=><Card key={d.id} d={d} onFav={togFav} isFav={favs.has(d.id)} onCmp={togCmp} isCmp={!!cmpList.find(x=>x.id===d.id)} onSel={setSelD}/>)}</div>
          {filtered.length>60&&<div style={{textAlign:"center",padding:"20px 0",color:T.textMuted,fontSize:12}}>{t.showing} 60 {t.of} {filtered.length}</div>}
          {!filtered.length&&<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:18,color:T.text,fontFamily:"'Playfair Display',serif"}}>{t.noMatch}</div><div style={{fontSize:13,color:T.textSecondary,marginTop:6}}>{t.adjustF} <button onClick={reset} style={{background:"none",border:"none",color:T.ice,cursor:"pointer",textDecoration:"underline"}}>{t.resetAll}</button></div></div>}
        </div></div>}
    </main>

    {showCmp&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bgModal,borderTop:`1px solid ${T.borderHover}`,zIndex:900,maxHeight:"55vh",overflowY:"auto",padding:"20px 24px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:16,fontWeight:700,color:T.text}}>{t.compare} ({cmpList.length})</span><Btn small onClick={()=>setShowCmp(false)}>{t.close}</Btn></div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr><th style={{textAlign:"start",padding:"6px 10px",color:T.textMuted,fontSize:10}}>{t.spec}</th>{cmpList.map(d=><th key={d.id} style={{textAlign:"center",padding:"6px 10px",color:T.text}}>{d.id}<button onClick={()=>setCmpList(p=>p.filter(x=>x.id!==d.id))} style={{marginLeft:6,background:"none",border:"none",color:T.danger,cursor:"pointer"}}>✕</button></th>)}</tr></thead>
        <tbody>{["shape","carat","color","clarity","cut","price","pricePerCt","discount","source"].map(f=><tr key={f} style={{borderTop:`1px solid ${T.border}`}}><td style={{padding:"6px 10px",color:T.textSecondary}}>{f}</td>{cmpList.map(d=><td key={d.id} style={{textAlign:"center",padding:"6px 10px",color:T.text}}>{f==="price"||f==="pricePerCt"?`$${d[f].toLocaleString()}`:f==="discount"?d[f]+"%":d[f]}</td>)}</tr>)}</tbody></table></div>}

    {selD&&<Detail d={selD} onClose={()=>setSelD(null)} onFav={togFav} isFav={favs.has(selD?.id)}/>}
    {showAuth&&<Auth onClose={()=>setShowAuth(false)} onAuth={u=>{setUsr(u);setShowAuth(false);}}/>}
    {showSett&&<Sett onClose={()=>setShowSett(false)} tn={tn} setTn={setTn} ln={ln} setLn={setLn}/>}
  </div></Ctx.Provider>;
}
