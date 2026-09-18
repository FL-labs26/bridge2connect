@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js ontbreekt. Installeer Node.js 22.12 of nieuwer.
  echo Open daarna dit bestand opnieuw.
  pause
  exit /b 1
)
echo Bridge2Connect wordt opgebouwd en in Chrome of Edge geopend.
echo Laat dit venster open. Stoppen kan met Ctrl+C.
node scripts\serve.mjs --watch --open
if errorlevel 1 pause
