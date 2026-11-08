@echo off
setlocal
cd /d "%~dp0"

:: Prefer scoop Node 24+ (Astro needs >= 22.23.4)
if exist "%USERPROFILE%\scoop\apps\nodejs24\current\node.exe" (
  set "PATH=%USERPROFILE%\scoop\apps\nodejs24\current;%PATH%"
) else if exist "%USERPROFILE%\scoop\apps\nodejs-lts\current\node.exe" (
  set "PATH=%USERPROFILE%\scoop\apps\nodejs-lts\current;%PATH%"
)

echo [zblog] node=% 
node -v
if not exist "node_modules\" (
  echo [zblog] npm install ...
  call npm install
)

echo [zblog] open http://127.0.0.1:4321/
start "" "http://127.0.0.1:4321/"
call npm run dev -- --host 127.0.0.1 --port 4321
