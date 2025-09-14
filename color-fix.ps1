# Color conversion script
cd "c:\Users\mlkog\Desktop\Projeler\jewelry_site\src\components"

# Footer.tsx
(Get-Content Footer.tsx) -replace 'hover:bg-gradient-to-r hover:from-teal-600 hover:to-rose-600', 'hover:bg-yellow-600' | Set-Content Footer.tsx

# AdminDashboard.tsx
(Get-Content AdminDashboard.tsx) -replace 'from-teal-600 to-rose-600', 'yellow-600' -replace 'hover:from-rose-600 hover:to-teal-600', 'hover:bg-yellow-700' | Set-Content AdminDashboard.tsx

# RegisterForm.tsx
(Get-Content RegisterForm.tsx) -replace 'from-teal-600 to-rose-600', 'yellow-600' -replace 'hover:from-rose-600 hover:to-teal-600', 'hover:bg-yellow-700' | Set-Content RegisterForm.tsx

Write-Host "Color conversion completed successfully!"