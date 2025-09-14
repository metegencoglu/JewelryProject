# Son kalan renkleri güncelle
cd "c:\Users\mlkog\Desktop\Projeler\jewelry_site\src\components"

# ProductDetail son güncellemeleri
(Get-Content ProductDetail.tsx) `
  -replace 'text-rose-600 border-rose-600 bg-rose-50', 'text-yellow-600 border-yellow-600 bg-yellow-50' `
  -replace 'hover:border-rose-400 hover:text-rose-600', 'hover:border-yellow-400 hover:text-yellow-600' `
  -replace 'hover:border-teal-400 hover:text-teal-600', 'hover:border-yellow-400 hover:text-yellow-600' `
  -replace 'bg-teal-600', 'bg-yellow-600' `
  -replace 'text-teal-600', 'text-yellow-600' `
  | Set-Content ProductDetail.tsx

Write-Host "ProductDetail colors updated!"