import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.join(__dirname, "../packages/core/language/locales");
const showcaseDir = path.join(__dirname, "../apps/showcase/src/i18n/locales");

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

const faShell = {
  appName: "داش کامپوننت",
  title: "نمایشگاه",
  nav: {
    allComponents: "همه کامپوننت‌ها",
    categories: "دسته‌بندی‌ها",
    common: "پایه",
    compound: "ترکیبی",
    home: "خانه",
  },
  home: {
    badge: "کتابخانه کامپوننت متحرک",
    browse: "مرور کامپوننت‌ها",
    description:
      "کامپوننت‌های آماده تولید را کاوش کنید. هر تعامل متحرک است و پوسته‌ها از حالت روشن و تاریک پشتیبانی می‌کنند.",
    startButtons: "شروع با دکمه‌ها",
    title: "رابط کاربری بسازید با",
    titleHighlight: "حرکت و دقت",
  },
  catalog: {
    componentLabel: "کامپوننت",
    groupComponents: "کامپوننت",
    indexDescription: "همه دسته‌های طراحی سیستم را مرور کنید.",
    indexTitle: "فهرست کامپوننت‌ها",
  },
  sidebar: {
    collapse: "جمع کردن نوار کناری",
    expand: "باز کردن نوار کناری",
  },
  categories: {
    accordion: { title: "آکاردئون", description: "بخش‌های تاشو با انیمیشن." },
    alerts: { title: "هشدارها", description: "خالی، بارگذاری، خطا و دسترسی." },
    auth: { title: "چیدمان ورود", description: "صفحه احراز هویت." },
    avatar: { title: "آواتار", description: "تصویر کاربر با حروف جایگزین." },
    badges: { title: "نشان‌ها", description: "نمایش وضعیت با رنگ و اندازه." },
    banner: { title: "بنر", description: "بنر اطلاع‌رسانی و تبلیغ." },
    buttons: { title: "دکمه‌ها", description: "عملیات، آیکن، بارگذاری و شدت رنگ." },
    cards: { title: "کارت‌ها", description: "سطح‌ها با سرصفحه و محتوا." },
    carousel: { title: "کاروسل", description: "گالری محتوای اسلایدی." },
    charts: { title: "نمودارها", description: "میله‌ای، خطی، دایره‌ای و ناحیه." },
    chips: { title: "چیپ‌ها", description: "برچسب، فیلتر و حذف." },
    collapsible: { title: "تاشو", description: "نمایش و پنهان‌سازی محتوا." },
    "context-menu": { title: "منوی زمینه", description: "منوی کلیک راست." },
    dashboard: { title: "چیدمان داشبورد", description: "پوسته با سایدبار." },
    divider: { title: "جداکننده", description: "خط جداکننده محتوا." },
    errors: { title: "خطاها", description: "نمایش حالت خطا." },
    fadeable: { title: "محو شونده", description: "ظاهر و محو شدن." },
    "file-uploader": { title: "آپلود فایل", description: "کشیدن و رها کردن فایل." },
    flex: { title: "فلکس", description: "چیدمان انعطاف‌پذیر." },
    form: { title: "فرم", description: "چیدمان فرم و فیلدها." },
    grid: { title: "گرید", description: "چیدمان شبکه‌ای." },
    "hover-card": { title: "کارت شناور", description: "محتوای غنی روی هاور." },
    inputs: { title: "ورودی‌ها", description: "متن، چک‌باکس، سوییچ، انتخاب و بیشتر." },
    list: { title: "فهرست", description: "فهرست، گرید و کارت." },
    loading: { title: "بارگذاری", description: "اسپینر و نشانگر بارگذاری." },
    "license-plate": { title: "پلاک", description: "ورودی پلاک ایران." },
    "location-picker": { title: "انتخاب مکان", description: "انتخاب روی نقشه." },
    map: { title: "نقشه", description: "نقشه تعاملی." },
    overlay: { title: "روکش", description: "دیالوگ، شیت و پاپ‌اور." },
    pagination: { title: "صفحه‌بندی", description: "کنترل صفحات." },
    paginator: { title: "صفحه‌بند", description: "رابط فشرده صفحه‌بندی." },
    "persian-date-picker": { title: "تقویم شمسی", description: "انتخاب تاریخ جلالی." },
    shapes: { title: "اشکال", description: "نشانگرها و اشکال تزئینی." },
    skeleton: { title: "اسکلت", description: "جایگزین بارگذاری." },
    slider: { title: "اسلایدر", description: "تک و بازه‌ای." },
    sonner: { title: "اعلان", description: "اعلان‌های توست." },
    steps: { title: "مراحل", description: "نوار پیشرفت مرحله‌ای." },
    table: { title: "جدول", description: "جدول داده با فیلتر." },
    tabs: { title: "تب‌ها", description: "محتوای تب‌دار با نشانگر متحرک." },
    timeline: { title: "خط زمان", description: "رویدادها در خط زمان." },
    tracker: { title: "ردیاب", description: "نقشه و رویداد ردیابی." },
    typography: { title: "تایپوگرافی", description: "متن و مارکی." },
  },
};

const arShell = {
  appName: "مكونات داش",
  title: "العرض",
  nav: {
    allComponents: "كل المكونات",
    categories: "الفئات",
    common: "أساسي",
    compound: "مركّب",
    home: "الرئيسية",
  },
  home: {
    badge: "مكتبة مكونات متحركة",
    browse: "تصفح المكونات",
    description: "استكشف مكونات جاهزة للإنتاج. كل تفاعل متحرك وتدعم السمات الفاتحة والداكنة.",
    startButtons: "ابدأ بالأزرار",
    title: "ابنِ واجهات مع",
    titleHighlight: "حركة ودقة",
  },
  catalog: {
    componentLabel: "مكون",
    groupComponents: "مكونات",
    indexDescription: "تصفح كل فئات نظام التصميم.",
    indexTitle: "فهرس المكونات",
  },
  sidebar: {
    collapse: "طي الشريط الجانبي",
    expand: "توسيع الشريط الجانبي",
  },
  categories: {
    accordion: { title: "أكورديون", description: "أقسام قابلة للطي." },
    alerts: { title: "تنبيهات", description: "فارغ وتحميل وخطأ وصلاحيات." },
    auth: { title: "تخطيط auth", description: "صفحة المصادقة." },
    avatar: { title: "صورة رمزية", description: "صور المستخدمين." },
    badges: { title: "شارات", description: "مؤشرات الحالة بالألوان والأحجام." },
    banner: { title: "لافتة", description: "لافتات إعلامية." },
    buttons: { title: "أزرار", description: "إجراءات وأيقونات وحالات التحميل." },
    cards: { title: "بطاقات", description: "أسطح مع رؤوس ومحتوى." },
    carousel: { title: "عرض دوار", description: "معرض شرائح." },
    charts: { title: "رسوم بيانية", description: "أعمدة وخطوط ودائرية." },
    chips: { title: "شرائح", description: "وسوم وفلاتر." },
    collapsible: { title: "قابل للطي", description: "إظهار وإخفاء المحتوى." },
    "context-menu": { title: "قائمة سياق", description: "قائمة النقر الأيمن." },
    dashboard: { title: "تخطيط لوحة", description: "قشرة مع شريط جانبي." },
    divider: { title: "فاصل", description: "فواصل بصرية." },
    errors: { title: "أخطاء", description: "عرض حالات الخطأ." },
    fadeable: { title: "تلاشي", description: "ظهور واختفاء." },
    "file-uploader": { title: "رفع ملف", description: "سحب وإفلات." },
    flex: { title: "فليكس", description: "تخطيط مرن." },
    form: { title: "نموذج", description: "تخطيط النماذج." },
    grid: { title: "شبكة", description: "تخطيط شبكي." },
    "hover-card": { title: "بطاقة تحويم", description: "محتوى عند التحويم." },
    inputs: { title: "مدخلات", description: "نص ومربعات ومحولات واختيار." },
    list: { title: "قائمة", description: "قوائم وشبكات." },
    loading: { title: "تحميل", description: "مؤشرات التحميل." },
    "license-plate": { title: "لوحة", description: "إدخال لوحة إيرانية." },
    "location-picker": { title: "اختيار موقع", description: "اختيار على الخريطة." },
    map: { title: "خريطة", description: "خرائط تفاعلية." },
    overlay: { title: "طبقة", description: "حوار وورقة ونافذة." },
    pagination: { title: "ترقيم", description: "تنقل الصفحات." },
    paginator: { title: "مرقّم", description: "واجهة ترقيم مدمجة." },
    "persian-date-picker": { title: "تقويم فارسي", description: "اختيار تاريخ جلالي." },
    shapes: { title: "أشكال", description: "مؤشرات وزخرفة." },
    skeleton: { title: "هيكل", description: "عناصر تحميل." },
    slider: { title: "منزلق", description: "منزلق واحد أو نطاق." },
    sonner: { title: "إشعارات", description: "إشعارات منبثقة." },
    steps: { title: "خطوات", description: "مؤشر التقدم." },
    table: { title: "جدول", description: "جداول بيانات." },
    tabs: { title: "تبويبات", description: "محتوى بتبويبات ومؤشرات." },
    timeline: { title: "جدول زمني", description: "أحداث زمنية." },
    tracker: { title: "تتبع", description: "خريطة وأحداث." },
    typography: { title: "طباعة", description: "أنماط النص." },
  },
};

const en = JSON.parse(fs.readFileSync(path.join(showcaseDir, "en.json"), "utf8"));

for (const [lang, overlay] of [
  ["fa", faShell],
  ["ar", arShell],
]) {
  const locale = structuredClone(en);
  deepMerge(locale, overlay);
  fs.writeFileSync(path.join(showcaseDir, `${lang}.json`), `${JSON.stringify(locale, null, 2)}\n`, "utf8");
}

for (const lang of ["en", "fa", "ar"]) {
  const file = path.join(coreDir, `${lang}.json`);
  const locale = JSON.parse(fs.readFileSync(file, "utf8"));
  delete locale.showcase;
  fs.writeFileSync(file, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
}

console.log("Created showcase fa/ar locales; removed showcase from core locales");
