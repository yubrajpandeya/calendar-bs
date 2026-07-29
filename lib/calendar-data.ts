import { bsKey, type BsDate } from "./calendar-engine";

export type EventType = "public" | "festival" | "regional" | "observance";

export type CalendarEvent = {
  id: string;
  date: BsDate;
  titleNe: string;
  titleEn: string;
  type: EventType;
  scope: string;
  note?: string;
};

const event = (
  date: BsDate,
  titleNe: string,
  titleEn: string,
  type: EventType,
  scope: string,
  note?: string,
): CalendarEvent => ({
  id: `${bsKey(date)}-${titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  date,
  titleNe,
  titleEn,
  type,
  scope,
  note,
});

export const CALENDAR_EVENTS_2083: CalendarEvent[] = [
  event({ year: 2083, month: 1, day: 1 }, "नेपाली नयाँ वर्ष", "Nepali New Year", "public", "देशभर"),
  event({ year: 2083, month: 1, day: 18 }, "मजदुर दिवस तथा बुद्ध जयन्ती", "Labour Day and Buddha Jayanti", "public", "देशभर"),
  event({ year: 2083, month: 2, day: 15 }, "गणतन्त्र दिवस", "Republic Day", "public", "देशभर"),
  event({ year: 2083, month: 3, day: 15 }, "राष्ट्रिय धान दिवस", "National Paddy Day", "observance", "देशभर"),
  event({ year: 2083, month: 3, day: 29 }, "भानु जयन्ती", "Bhanu Jayanti", "observance", "देशभर"),
  event({ year: 2083, month: 4, day: 1 }, "साउने सङ्क्रान्ति", "Saune Sankranti", "festival", "देशभर"),
  event({ year: 2083, month: 4, day: 2 }, "मुक्त कमैया दिवस", "Mukta Kamaiya Day", "observance", "देशभर"),
  event({ year: 2083, month: 4, day: 9 }, "हरिशयनी एकादशी", "Harishayani Ekadashi", "festival", "देशभर"),
  event({ year: 2083, month: 4, day: 13 }, "गुरु पूर्णिमा", "Guru Purnima", "festival", "देशभर"),
  event({ year: 2083, month: 4, day: 15 }, "खीर खाने दिन", "Khir Khane Din", "festival", "देशभर"),
  event({ year: 2083, month: 4, day: 24 }, "कामिका एकादशी", "Kamika Ekadashi", "festival", "देशभर"),
  event({ year: 2083, month: 4, day: 26 }, "घण्टाकर्ण चतुर्दशी", "Ghantakarna Chaturdashi", "festival", "समुदायगत"),
  event({ year: 2083, month: 4, day: 28 }, "गुँला पर्व आरम्भ", "Gunla Dharma Begins", "festival", "समुदायगत"),
  event({ year: 2083, month: 5, day: 1 }, "नाग पञ्चमी", "Nag Panchami", "festival", "देशभर"),
  event({ year: 2083, month: 5, day: 12 }, "जनै पूर्णिमा तथा रक्षाबन्धन", "Janai Purnima and Raksha Bandhan", "public", "देशभर"),
  event({ year: 2083, month: 5, day: 13 }, "गाईजात्रा", "Gai Jatra", "regional", "काठमाडौँ उपत्यका तथा सम्बन्धित समुदाय"),
  event({ year: 2083, month: 5, day: 19 }, "श्रीकृष्ण जन्माष्टमी तथा गौरा पर्व", "Krishna Janmashtami and Gaura Parva", "public", "देशभर तथा सुदूरपश्चिम"),
  event({ year: 2083, month: 5, day: 26 }, "कुशे औँसी तथा बुबाको मुख हेर्ने दिन", "Kushe Aunsi and Father's Day", "festival", "देशभर"),
  event({ year: 2083, month: 5, day: 29 }, "हरितालिका तीज", "Haritalika Teej", "regional", "महिला कर्मचारी"),
  event({ year: 2083, month: 6, day: 3 }, "संविधान दिवस", "Constitution Day", "public", "देशभर"),
  event({ year: 2083, month: 6, day: 9 }, "इन्द्रजात्रा", "Indra Jatra", "regional", "काठमाडौँ उपत्यका"),
  event({ year: 2083, month: 6, day: 18 }, "जितिया पर्व", "Jitiya Parva", "regional", "सम्बन्धित महिला"),
  event({ year: 2083, month: 6, day: 25 }, "घटस्थापना", "Ghatasthapana", "public", "देशभर"),
  event({ year: 2083, month: 6, day: 31 }, "फूलपाती", "Fulpati", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 1 }, "महाअष्टमी", "Maha Ashtami", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 2 }, "दशैँ बिदा", "Dashain Holiday", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 3 }, "महानवमी", "Maha Navami", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 4 }, "विजया दशमी", "Vijaya Dashami", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 5 }, "एकादशी", "Dashain Ekadashi", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 6 }, "द्वादशी", "Dashain Dwadashi", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 8 }, "कोजाग्रत पूर्णिमा", "Kojagrat Purnima", "festival", "देशभर"),
  event({ year: 2083, month: 7, day: 21 }, "काग तिहार", "Kag Tihar", "festival", "देशभर"),
  event({ year: 2083, month: 7, day: 22 }, "कुकुर तिहार तथा लक्ष्मी पूजा", "Kukur Tihar and Laxmi Puja", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 23 }, "गाई तिहार", "Gai Tihar", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 24 }, "म्हः पूजा, नेपाल संवत् र गोवर्धन पूजा", "Mha Puja, Nepal Sambat and Govardhan Puja", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 25 }, "भाइटीका", "Bhai Tika", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 26 }, "तिहार बिदा", "Tihar Holiday", "public", "देशभर"),
  event({ year: 2083, month: 7, day: 29 }, "छठ पर्व", "Chhath Parva", "public", "देशभर"),
  event({ year: 2083, month: 8, day: 8 }, "गुरु नानक जयन्ती", "Guru Nanak Jayanti", "regional", "सिख धर्मावलम्बी"),
  event({ year: 2083, month: 8, day: 21 }, "बालाचतुर्दशी", "Bala Chaturdashi", "festival", "देशभर"),
  event({ year: 2083, month: 9, day: 9 }, "योमरी पुन्ही तथा ज्यापु दिवस", "Yomari Punhi and Jyapu Day", "festival", "समुदायगत"),
  event({ year: 2083, month: 9, day: 10 }, "क्रिसमस दिवस", "Christmas Day", "public", "देशभर"),
  event({ year: 2083, month: 9, day: 15 }, "तमु ल्होसार", "Tamu Lhosar", "public", "देशभर"),
  event({ year: 2083, month: 9, day: 27 }, "पृथ्वी जयन्ती", "Prithvi Jayanti", "public", "देशभर"),
  event({ year: 2083, month: 10, day: 1 }, "माघे सङ्क्रान्ति", "Maghe Sankranti", "public", "देशभर"),
  event({ year: 2083, month: 10, day: 16 }, "शहीद दिवस", "Martyrs' Day", "public", "देशभर"),
  event({ year: 2083, month: 10, day: 24 }, "सोनाम ल्होसार", "Sonam Lhosar", "public", "देशभर"),
  event({ year: 2083, month: 10, day: 28 }, "सरस्वती पूजा", "Saraswati Puja", "regional", "शैक्षिक संस्था"),
  event({ year: 2083, month: 11, day: 7 }, "प्रजातन्त्र दिवस", "Democracy Day", "public", "देशभर"),
  event({ year: 2083, month: 11, day: 22 }, "महाशिवरात्रि", "Maha Shivaratri", "public", "देशभर"),
  event({ year: 2083, month: 11, day: 24 }, "अन्तर्राष्ट्रिय महिला दिवस", "International Women's Day", "public", "देशभर"),
  event({ year: 2083, month: 11, day: 25 }, "ग्याल्पो ल्होसार", "Gyalpo Lhosar", "public", "देशभर"),
  event({ year: 2083, month: 12, day: 7 }, "फागु पूर्णिमा, पहाड", "Fagu Purnima, Hills", "public", "पहाडी जिल्ला"),
  event({ year: 2083, month: 12, day: 8 }, "फागु पूर्णिमा, तराई", "Fagu Purnima, Terai", "public", "तराई जिल्ला"),
  event({ year: 2083, month: 12, day: 23 }, "घोडेजात्रा", "Ghode Jatra", "regional", "काठमाडौँ उपत्यका"),
];

export const EVENTS_BY_DATE = CALENDAR_EVENTS_2083.reduce<
  Record<string, CalendarEvent[]>
>((lookup, item) => {
  const key = bsKey(item.date);
  lookup[key] = [...(lookup[key] ?? []), item];
  return lookup;
}, {});

export const DATA_SOURCES = [
  {
    label: "गृह मन्त्रालय: २०८३ का सरकारी तथा सार्वजनिक बिदा",
    url: "https://moha.gov.np/en/page/government-and-public-holidays-in-2083",
  },
  {
    label: "नेपाल पञ्चाङ्गमा आधारित २०८३ पात्रो सन्दर्भ",
    url: "https://www.ashesh.com.np/nepali-calendar/?month=Shrawan&year=2083",
  },
];
