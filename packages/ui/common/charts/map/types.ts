export type MapData = {
  name: MapDataName | string;
  value: number;
  total?: number;
};

export type MapDataName =
  | "Alborz"
  | "Ardebil"
  | "East Azarbaijan"
  | "West Azarbaijan"
  | "Bushehr"
  | "Chahar Mahall and Bakhtiari"
  | "Fars"
  | "Gilan"
  | "Golestan"
  | "Hamadan"
  | "Hormozgan"
  | "Ilam"
  | "Esfahan"
  | "Kerman"
  | "Kermanshah"
  | "Khuzestan"
  | "Kohgiluyeh and Buyer Ahmad"
  | "Kordestan"
  | "Lorestan"
  | "Markazi"
  | "Mazandaran"
  | "North Khorasan"
  | "Qazvin"
  | "Qom"
  | "Razavi Khorasan"
  | "Semnan"
  | "Sistan and Baluchestan"
  | "South Khorasan"
  | "Tehran"
  | "Yazd"
  | "Zanjan"
  | "Caspian Sea"
  | "Persian Gulf"
  | "Gulf of Oman";
export const mapFaName: Record<MapDataName, string> = {
  Alborz: "البرز",
  Ardebil: "اردبیل",
  "East Azarbaijan": "آذربایجان شرقی",
  "West Azarbaijan": "آذربایجان غربی",
  Bushehr: "بوشهر",
  "Chahar Mahall and Bakhtiari": "چهارمحال و بختیاری",
  Fars: "فارس",
  Gilan: "گیلان",
  Golestan: "گلستان",
  Hamadan: "همدان",
  Hormozgan: "هرمزگان",
  Ilam: "ایلام",
  Esfahan: "اصفهان",
  Kerman: "کرمان",
  Kermanshah: "کرمانشاه",
  Khuzestan: "خوزستان",
  "Kohgiluyeh and Buyer Ahmad": "کهگیلویه و بویراحمد",
  Kordestan: "کردستان",
  Lorestan: "لرستان",
  Markazi: "مرکزی",
  Mazandaran: "مازندران",
  "North Khorasan": "خراسان شمالی",
  Qazvin: "قزوین",
  Qom: "قم",
  "Razavi Khorasan": "خراسان رضوی",
  Semnan: "سمنان",
  "Sistan and Baluchestan": "سیستان و بلوچستان",
  "South Khorasan": "خراسان جنوبی",
  Tehran: "تهران",
  Yazd: "یزد",
  Zanjan: "زنجان",
  "Caspian Sea": "دریای خزر",
  "Persian Gulf": "خلیج فارس",
  "Gulf of Oman": "دریای عمان",
};

export const mapFaNameToEnName: Record<string, MapDataName> = {
  البرز: "Alborz",
  اردبیل: "Ardebil",
  "آذربایجان شرقی": "East Azarbaijan",
  "آذربایجان غربی": "West Azarbaijan",
  بوشهر: "Bushehr",
  "چهارمحال و بختیاری": "Chahar Mahall and Bakhtiari",
  فارس: "Fars",
  گیلان: "Gilan",
  گلستان: "Golestan",
  همدان: "Hamadan",
  هرمزگان: "Hormozgan",
  ایلام: "Ilam",
  اصفهان: "Esfahan",
  کرمان: "Kerman",
  کرمانشاه: "Kermanshah",
  خوزستان: "Khuzestan",
  "کهگیلویه و بویراحمد": "Kohgiluyeh and Buyer Ahmad",
  کردستان: "Kordestan",
  لرستان: "Lorestan",
  مرکزی: "Markazi",
  مازندران: "Mazandaran",
  "خراسان شمالی": "North Khorasan",
  قزوین: "Qazvin",
  قم: "Qom",
  "خراسان رضوی": "Razavi Khorasan",
  سمنان: "Semnan",
  "سیستان و بلوچستان": "Sistan and Baluchestan",
  "خراسان جنوبی": "South Khorasan",
  تهران: "Tehran",
  یزد: "Yazd",
  زنجان: "Zanjan",
  "دریای خزر": "Caspian Sea",
  "خلیج فارس": "Persian Gulf",
  "دریای عمان": "Gulf of Oman",
};
// this numbers is from ids from server stats list

// const mapIdToEnNameProvince = {
//   97000000: 'گلستان',
//   95000000: 'بوشهر',
//   14000000: 'قم',
//   75000000: 'همدان',
//   91000000: 'اردبیل',
//   26000000: 'آذربایجان شرقی',
//   62000000: 'ایرانشهر',
//   45000000: 'کرمان',
//   31000000: 'خراسان رضوی',
//   64000000: 'هرمزگان',
//   21000000: 'اصفهان',
//   93000000: 'یزد',
//   33000000: 'خراسان جنوبی',
//   51000000: 'مرکزی',
//   81000000: 'لرستان',
//   45000001: 'کرمان جنوب',
//   41000000: 'فارس',
//   67000000: 'زنجان',
//   18000000: 'البرز',
//   77000000: 'چهارمحال وبختیاری',
//   15000000: 'قزوین',
//   32000000: 'خراسان شمالي',
//   36000000: 'خوزستان',
//   61000000: 'سیستان وبلوچستان',
//   87000000: 'سمنان',
//   54000000: 'گیلان',
//   85000000: 'کهگیلویه وبویراحمد',
//   16000000: 'مازندران',
//   57000000: 'آذربایجان غربی',
//   73000000: 'کردستان',
//   83000000: 'ایلام',
//   71000000: 'كرمانشاه',
//   11000000: 'تهران',
// }

export const mapIdToEnNameProvince = {
  // 62000000: 'Sistan and Baluchestan', // ایرانشهر زیرمجموعه سیستان و بلوچستان است
  // 45000001: 'Kerman', // "کرمان جنوب" معادل رسمی ندارد، به "Kerman" نگه داشته شد
  97000000: "Golestan",
  95000000: "Bushehr",
  14000000: "Qom",
  75000000: "Hamadan",
  91000000: "Ardebil",
  26000000: "East Azarbaijan",
  45000000: "Kerman",
  31000000: "Razavi Khorasan",
  64000000: "Hormozgan",
  21000000: "Esfahan",
  93000000: "Yazd",
  33000000: "South Khorasan",
  51000000: "Markazi",
  81000000: "Lorestan",
  41000000: "Fars",
  67000000: "Zanjan",
  18000000: "Alborz",
  77000000: "Chahar Mahall and Bakhtiari",
  15000000: "Qazvin",
  32000000: "North Khorasan",
  36000000: "Khuzestan",
  61000000: "Sistan and Baluchestan",
  87000000: "Semnan",
  54000000: "Gilan",
  85000000: "Kohgiluyeh and Buyer Ahmad",
  16000000: "Mazandaran",
  57000000: "West Azarbaijan",
  73000000: "Kordestan",
  83000000: "Ilam",
  71000000: "Kermanshah",
  11000000: "Tehran",
};

const provinces = [
  { value: 97000000, label: "گلستان" },
  { value: 95000000, label: "بوشهر" },
  { value: 14000000, label: "قم" },
  { value: 75000000, label: "همدان" },
  { value: 91000000, label: "اردبیل" },
  { value: 26000000, label: "آذربایجان شرقی" },
  { value: 62000000, label: "ایرانشهر" },
  { value: 45000000, label: "کرمان" },
  { value: 31000000, label: "خراسان رضوی" },
  { value: 64000000, label: "هرمزگان" },
  { value: 21000000, label: "اصفهان" },
  { value: 93000000, label: "یزد" },
  { value: 33000000, label: "خراسان جنوبی" },
  { value: 51000000, label: "مرکزی" },
  { value: 81000000, label: "لرستان" },
  { value: 45000001, label: "کرمان جنوب" },
  { value: 41000000, label: "فارس" },
  { value: 67000000, label: "زنجان" },
  { value: 18000000, label: "البرز" },
  { value: 77000000, label: "چهارمحال و بختیاری" },
  { value: 15000000, label: "قزوین" },
  { value: 32000000, label: "خراسان شمالی" },
  { value: 36000000, label: "خوزستان" },
  { value: 61000000, label: "سیستان و بلوچستان" },
  { value: 87000000, label: "سمنان" },
  { value: 54000000, label: "گیلان" },
  { value: 85000000, label: "کهگیلویه و بویراحمد" },
  { value: 16000000, label: "مازندران" },
  { value: 57000000, label: "آذربایجان غربی" },
  { value: 73000000, label: "کردستان" },
  { value: 83000000, label: "ایلام" },
  { value: 71000000, label: "کرمانشاه" },
  { value: 11000000, label: "تهران" },
];

export const initialProvinces = provinces
  .map((x) => ({ ...x, name: mapFaNameToEnName[x.label] }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const allProvinces: MapDataName[] = [
  "Alborz",
  "Ardebil",
  "East Azarbaijan",
  "West Azarbaijan",
  "Bushehr",
  "Chahar Mahall and Bakhtiari",
  "Fars",
  "Gilan",
  "Golestan",
  "Hamadan",
  "Hormozgan",
  "Ilam",
  "Esfahan",
  "Kerman",
  "Kermanshah",
  "Khuzestan",
  "Kohgiluyeh and Buyer Ahmad",
  "Kordestan",
  "Lorestan",
  "Markazi",
  "Mazandaran",
  "North Khorasan",
  "Qazvin",
  "Qom",
  "Razavi Khorasan",
  "Semnan",
  "Sistan and Baluchestan",
  "South Khorasan",
  "Tehran",
  "Yazd",
  "Zanjan",
  "Caspian Sea",
  "Persian Gulf",
  "Gulf of Oman",
];

export type MapAreaClickParams = {
  name: MapDataName;
  data: {
    name: MapDataName;
    value: number;
    count?: number;
    index?: number;
  };
  dataIndex: number;
  seriesIndex?: number;
  seriesType?: string;
  componentType?: string;
  value: number | number[];
  color?: string;
};

export const noneIntractableProvinces: string[] = [
  "Caspian Sea",
  "Persian Gulf",
  "Gulf of Oman",
];

export const mapInitialData: Array<{
  name: MapDataName;
  label: string;
  value: number;
}> = allProvinces.map((province) => ({
  name: province as MapDataName,
  label: mapFaName[province],
  value: 0,
}));
