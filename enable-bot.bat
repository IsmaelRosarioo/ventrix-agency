@echo off
REM Turn the live AI receptionist back ON.
REM Flips DEMO_LIVE to true in app/api/agent/route.ts and pushes to main.
REM Vercel auto-deploys (~60s) and the bot goes live.
setlocal
cd /d "%~dp0"
echo Enabling the live AI receptionist (DEMO_LIVE = true)...

powershell -NoProfile -Command "$f='app\api\agent\route.ts'; $c=[IO.File]::ReadAllText($f); if ($c -match 'DEMO_LIVE\s*=\s*false') { $c = $c -replace 'DEMO_LIVE\s*=\s*false','DEMO_LIVE = true'; [IO.File]::WriteAllText($f,$c); exit 0 } else { exit 1 }"
if errorlevel 1 (
    echo.
    echo DEMO_LIVE is already true - nothing to change or deploy.
    exit /b 0
)

git add app\api\agent\route.ts
git commit -m "chore: enable live demo (DEMO_LIVE=true) via enable-bot.bat"
git push
if errorlevel 1 (
    echo.
    echo Push failed. Check git output above.
    exit /b 1
)
echo.
echo Done. Pushed to main - Vercel is deploying.
echo Bot goes live in ~60s at https://www.ventrixagency.com/demo
endlocal