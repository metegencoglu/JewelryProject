// Kategori mapping sistemi
// Türkçe URL slug'ları ile database kategori değerleri arasında mapping

export const CATEGORY_MAPPING = {
  // URL slug -> Database category value
  'yuzukler': 'ring',
  'kolyeler': 'necklace', 
  'kupeler': 'earring',
  'bilezikler': 'bracelet',
  'alyanslar': 'wedding-ring',
  'altin-takilar': 'gold',
  'gumus-takilar': 'silver',
  'pirmanta-takilar': 'diamond',
  'koleksiyonlar': 'all'
} as const

// Reverse mapping: Database category -> URL slug
export const REVERSE_CATEGORY_MAPPING = {
  'ring': 'yuzukler',
  'necklace': 'kolyeler',
  'earring': 'kupeler', 
  'bracelet': 'bilezikler',
  'wedding-ring': 'alyanslar',
  'gold': 'altin-takilar',
  'silver': 'gumus-takilar',
  'diamond': 'pirmanta-takilar',
  'all': 'koleksiyonlar'
} as const

// Kategori bilgileri
export const CATEGORY_INFO = {
  'yuzukler': {
    name: 'Yüzükler',
    description: 'Özel anlarınız için muhteşem yüzük koleksiyonumuz',
    dbCategory: 'ring',
    image: 'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGVsZWdhbnQlMjBtb2Rlcm58ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'kolyeler': {
    name: 'Kolyeler',
    description: 'Zarafet ve şıklığın simgesi kolye koleksiyonumuz',
    dbCategory: 'necklace',
    image: 'https://images.unsplash.com/photo-1728119884904-98bc3caf518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwamV3ZWxyeSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'kupeler': {
    name: 'Küpeler',
    description: 'Her tarza uygun küpe modelleri',
    dbCategory: 'earring',
    image: 'https://images.unsplash.com/photo-1739664664545-5ea43f486f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBkaXNwbGF5JTIwZWxlZ2FudHxlbnwxfHx8fDE3NTc4NTk2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'bilezikler': {
    name: 'Bilezikler',
    description: 'Şık ve modern bilezik koleksiyonumuz',
    dbCategory: 'bracelet',
    image: 'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3MlMjBuZWNrbGFjZXxlbnwxfHx8fDE3NTc4NTk2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'alyanslar': {
    name: 'Alyanslar',
    description: 'Hayatınızın en özel gününe yakışan alyans modelleri',
    dbCategory: 'wedding-ring',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3N8ZW58MXx8fHwxNzM3NzA0NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'altin-takilar': {
    name: 'Altın Takılar',
    description: 'Saf altından üretilmiş özel takı koleksiyonumuz',
    dbCategory: 'gold',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeXxlbnwxfHx8fDE3Mzc3MDQ3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'gumus-takilar': {
    name: 'Gümüş Takılar',
    description: 'Zarif ve uygun fiyatlı gümüş takı seçenekleri',
    dbCategory: 'silver',
    image: 'https://images.unsplash.com/photo-1506629905607-d5ffdd8ba375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBqZXdlbHJ5fGVufDF8fHx8MTczNzcwNDczMnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'pirmanta-takilar': {
    name: 'Pırlanta Takılar',
    description: 'Lüks ve prestijin simgesi pırlanta takılarımız',
    dbCategory: 'diamond',
    image: 'https://images.unsplash.com/photo-1728119884904-98bc3caf518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwamV3ZWxyeXxlbnwxfHx8fDE3Mzc3MDQ3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  'koleksiyonlar': {
    name: 'Tüm Koleksiyonlar',
    description: 'En özel tasarımlarımızı keşfedin',
    dbCategory: 'all',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBkaXNwbGF5fGVufDF8fHx8MTczNzcwNDczMnww&ixlib=rb-4.1.0&q=80&w=1080'
  }
} as const

// Type definitions
export type CategorySlug = keyof typeof CATEGORY_MAPPING
export type CategoryDB = typeof CATEGORY_MAPPING[CategorySlug]

// Helper functions
export function getDbCategoryFromSlug(slug: string): CategoryDB | null {
  return CATEGORY_MAPPING[slug as CategorySlug] || null
}

export function getSlugFromDbCategory(dbCategory: string): CategorySlug | null {
  return REVERSE_CATEGORY_MAPPING[dbCategory as CategoryDB] || null
}

export function getCategoryInfo(slug: string) {
  return CATEGORY_INFO[slug as CategorySlug] || null
}