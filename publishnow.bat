@echo off
chcp 65001 >nul
cd /d "C:\Users\GrzegorzPalmer\Documents\Claude\Projects\Strona IMTO Software"
del /q cleanup.bat cleanup_done.txt gitdiag.bat gitdiag.txt 2>nul
if exist ".git\index.lock" del /f /q ".git\index.lock"
del /f /q "script (# Name clash 2026-07-08 qzl5eiC #).js" 2>nul
git add -A
git reset -- publishnow.bat publish_result.txt
git commit -m "Chatbot ChatLab + RODO consent; usuniecie pakietu START (PL/DE/EN); porzadki menu i stopek"
git push
(
echo === LOG ===
git log --oneline -3
echo === STATUS ===
git status -s
) > publish_result.txt 2>&1
