@echo off
echo.
echo  IMTO Software — lokalny serwer
echo  ================================
echo  Otworz przegladarke i wejdz na:
echo.
echo      http://localhost:8080
echo.
echo  Aby zatrzymac serwer: Ctrl+C
echo.
cd /d "%~dp0"
python -m http.server 8080
pause
