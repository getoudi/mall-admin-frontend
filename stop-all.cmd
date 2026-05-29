@echo off
chcp 65001 >nul 2>&1

echo.
echo ========================================
echo       Mall 项目一键停止
echo ========================================
echo.

echo [1] 停止前端...
taskkill /FI "WINDOWTITLE eq Frontend*" /F >nul 2>&1
echo     前端已停止

echo.
echo [2] 停止后端微服务...

:: 使用 netstat 找到各端口的进程并停止
for %%p in (9000 8001 8002 8003 8004 8005 8006) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p " ^| findstr "LISTENING"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)
echo     后端服务已停止

echo.
echo ========================================
echo       所有服务已停止！
echo ========================================
echo.
echo   按任意键关闭此窗口...
pause >nul
