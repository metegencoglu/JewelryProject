# Luxe Jewelry - Modern Mücevher Sitesi

Bu proje, Modern Jewelry Website Design'dan Next.js'e başarıyla entegre edilmiş bir mücevher e-ticaret sitesidir.

## Özellikler

- ✨ Modern ve responsive tasarım
- 🎨 Tailwind CSS ile şık arayüz
- 🔧 Radix UI bileşenleri
- ⚡ Next.js 15 ile hızlı performans
- 🌈 Motion/React ile animasyonlar
- 📱 Mobil uyumlu tasarım
- 🎭 TypeScript desteği

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
src/
├── app/                # Next.js App Router
│   ├── layout.tsx     # Ana layout
│   ├── page.tsx       # Ana sayfa
│   └── globals.css    # Global stiller
├── components/        # React bileşenleri
│   ├── ui/           # UI bileşenleri
│   ├── Header.tsx    # Site başlığı
│   └── Hero.tsx      # Hero section
├── lib/              # Utility fonksiyonları
├── types/            # TypeScript type tanımları
└── public/           # Static dosyalar
```

## Entegre Edilen Bileşenler

- Header: Navigasyon ve arama
- Hero: Ana banner ve CTA butonları
- Button: Özelleştirilebilir buton bileşeni
- Card: İçerik kartları
- Sheet: Mobil menü için yan panel
- UI Components: Radix UI tabanlı bileşenler

## Teknolojiler

- **Next.js 15** - React framework
- **React 19** - UI kütüphanesi
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Headless UI components
- **Motion/React** - Animasyonlar
- **Lucide React** - İkonlar

## Geliştirme

```bash
# Geliştirme modunda çalıştır
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Lint kontrolü
npm run lint
```

## Lisans

MIT License
