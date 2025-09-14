# Header renk güncellemeleri
cd "c:\Users\mlkog\Desktop\Projeler\jewelry_site\src\components"

(Get-Content Header.tsx) `
  -replace 'text-teal-600', 'text-yellow-600' `
  -replace 'hover:text-teal-600', 'hover:text-yellow-600' `
  -replace 'hover:bg-teal-50', 'hover:bg-yellow-50' `
  -replace 'bg-gradient-to-r from-teal-600 to-rose-600', 'bg-yellow-600' `
  -replace 'from-teal-600 to-purple-600', 'from-yellow-600 to-amber-600' `
  | Set-Content Header.tsx

Write-Host "Header colors updated successfully!"