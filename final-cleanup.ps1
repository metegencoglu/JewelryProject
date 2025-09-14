# Son gradient ve renk temizliği
cd "c:\Users\mlkog\Desktop\Projeler\jewelry_site\src\components"

# Genel gradient ve renk güncellemeleri
(Get-Content AdminDashboard.tsx) `
  -replace 'bg-gradient-to-r yellow-600', 'bg-yellow-600' `
  -replace 'hover:bg-teal-50 hover:text-teal-600', 'hover:bg-yellow-50 hover:text-yellow-600' `
  -replace 'hover:bg-teal-50 hover:border-teal-300', 'hover:bg-yellow-50 hover:border-yellow-300' `
  -replace 'text-teal-600', 'text-yellow-600' `
  -replace 'text-rose-600', 'text-yellow-600' `
  -replace 'bg-gradient-to-r from-gray-50 to-gray-100', 'bg-gray-50' `
  | Set-Content AdminDashboard.tsx

(Get-Content Hero.tsx) `
  -replace 'to-teal-900/40', 'to-yellow-900/40' `
  -replace 'text-teal-400/30', 'text-yellow-400/30' `
  -replace 'text-rose-400/30', 'text-yellow-400/30' `
  -replace 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-500 bg-clip-text', 'text-yellow-600' `
  | Set-Content Hero.tsx

(Get-Content Header.tsx) `
  -replace 'bg-teal-50', 'bg-yellow-50' `
  -replace 'hover:bg-rose-50 hover:text-rose-600', 'hover:bg-yellow-50 hover:text-yellow-600' `
  -replace 'bg-rose-500', 'bg-yellow-500' `
  -replace 'border-teal-100', 'border-yellow-100' `
  -replace 'focus:ring-teal-500', 'focus:ring-yellow-500' `
  | Set-Content Header.tsx

(Get-Content ProductCard.tsx) `
  -replace 'bg-gradient-to-r from-teal-600 to-teal-700', 'bg-yellow-600' `
  -replace 'bg-gradient-to-r from-rose-600 to-rose-700', 'bg-yellow-700' `
  -replace 'hover:text-teal-600', 'hover:text-yellow-600' `
  -replace 'fill-rose-500 text-rose-500', 'fill-yellow-500 text-yellow-500' `
  -replace 'linear-gradient\(135deg, rgba\(20, 184, 166, 0\.1\), rgba\(244, 63, 94, 0\.1\)\)', 'rgba(234, 179, 8, 0.1)' `
  | Set-Content ProductCard.tsx

(Get-Content FeaturedProducts.tsx) `
  -replace 'bg-gradient-to-br from-gray-50 via-white to-teal-50/30', 'bg-gray-50' `
  -replace 'border-teal-100', 'border-yellow-100' `
  -replace 'text-teal-600', 'text-yellow-600' `
  -replace 'text-teal-400/20', 'text-yellow-400/20' `
  -replace 'text-rose-400/20', 'text-yellow-400/20' `
  | Set-Content FeaturedProducts.tsx

(Get-Content CategoryPage.tsx) `
  -replace 'hover:bg-teal-50', 'hover:bg-yellow-50' `
  -replace 'bg-teal-600', 'bg-yellow-600' `
  | Set-Content CategoryPage.tsx

(Get-Content Footer.tsx) `
  -replace 'hover:text-teal-400', 'hover:text-yellow-400' `
  -replace 'hover:text-rose-400', 'hover:text-yellow-400' `
  -replace 'text-teal-400', 'text-yellow-400' `
  -replace 'focus:ring-teal-500', 'focus:ring-yellow-500' `
  -replace 'group-hover:text-rose-400', 'group-hover:text-amber-400' `
  | Set-Content Footer.tsx

(Get-Content RegisterForm.tsx) `
  -replace 'text-teal-600 hover:text-teal-700', 'text-yellow-600 hover:text-yellow-700' `
  -replace 'bg-gradient-to-r yellow-600', 'bg-yellow-600' `
  | Set-Content RegisterForm.tsx

(Get-Content ProductDetail.tsx) `
  -replace 'bg-gradient-to-t from-black/20', 'bg-black/20' `
  -replace 'border-teal-600', 'border-yellow-600' `
  -replace 'bg-teal-100 text-teal-800 hover:bg-teal-200', 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' `
  -replace 'bg-rose-100 text-rose-800 hover:bg-rose-200', 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' `
  -replace 'text-rose-600 bg-rose-100', 'text-yellow-600 bg-yellow-100' `
  -replace 'bg-gradient-to-r from-teal-600 to-rose-600 hover:from-rose-600 hover:to-teal-600', 'bg-yellow-600 hover:bg-yellow-700' `
  | Set-Content ProductDetail.tsx

Write-Host "Final color cleanup completed successfully!"