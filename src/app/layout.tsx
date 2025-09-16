import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { AuthProvider } from "../components/AuthProvider";
import { CartProvider } from "../contexts/CartContext";
import { CartSidebar } from "../components/CartSidebar";
import { ToastProvider } from "../contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxe Jewelry - Mücevher Dünyası",
  description: "En güzel mücevherleri keşfedin. Yüzükler, kolyeler, küpeler ve daha fazlası...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Örnek kullanıcı verisi - gerçek uygulamada session'dan gelecek
  const sampleUser = {
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    avatar: "", // Boş bırakınca varsayılan ikon gösterilir
    membershipLevel: "Premium Üye",
    isLoggedIn: true // Bu değeri false yaparsanız login olmamış görünüm gelir
  }

  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <div className="min-h-screen bg-white">
                <Header isAdmin={true} user={sampleUser} />
                <main>
                  {children}
                </main>
                <CartSidebar />
              </div>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
