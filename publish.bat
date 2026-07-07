@echo off
chcp 65001 >nul
cd /d "C:\Users\GrzegorzPalmer\Documents\Claude\Projects\Strona IMTO Software"
echo === Naprawa indeksu git ===
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\index" del /f /q ".git\index"
git reset
echo.
echo === Publikacja ===
git add -A
git commit -m "Redesign uslug: uslugi-ai (scalony START), menu, wyrownanie kafelka"
git push
echo.
echo ============================================
echo  GOTOWE. Sprawdz komunikaty powyzej.
echo  GitHub Pages wdrozy strone w 1-2 minuty.
echo ============================================
pause
