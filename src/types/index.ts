export type Page = 'home' | 'admin' | 'login' | 'product' | 'category'
export type Category = 
  // Eski İngilizce kategoriler (backward compatibility)
  | 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'collections'
  // Yeni Türkçe kategoriler
  | 'yuzukler' | 'kolyeler' | 'kupeler' | 'bilezikler' | 'alyanslar' 
  | 'altin-takilar' | 'gumus-takilar' | 'pirmanta-takilar' | 'koleksiyonlar'