@echo off
REM Take the live AI receptionist OFFLINE.
REM Flips DEMO_LIVE to false in app/api/agent/route.ts and pushes to main.
REM Vercel auto-deploys (~60s); /api/agent returns a friendly 503 and the
REM model is never called (no credit burn).
setlocal
cd /d "%~dp0"
echo Pausing the live AI receptionist (DEMO_LIVE = false)...

powershell -NoProfile -Command "$f='app\api\agent\route.ts'; $c=[IO.File]::ReadAllText($f); if ($c -match 'DEMO_LIVE\s*=\s*true') { $c = $c -replace 'DEMO_LIVE\s*=\s*true','DEMO_LIVE = false'; [IO.File]::WriteAllText($f,$c); exit 0 } else { exit 1 }"
if errorlevel 1 (
    echo.
    echo DEMO_LIVE is already false - nothing to change or deploy.
    exit /b 0
)

git add app\api\agent\route.ts
git commit -m "chore: pause live demo (DEMO_LIVE=false) via disable-bot.bat"
git push
if errorlevel 1 (
    echo.
    echo Push failed. Check git output above.
    exit /b 1
)
echo.
echo Done. Pushed to main - Vercel is deploying.
echo Bot goes offline in ~60s. /api/agent will return a friendly 503.
endlocal