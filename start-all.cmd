@echo off
chcp 65001 >nul 2>&1

echo.
echo ========================================
echo       Mall 项目一键启动
echo ========================================
echo.

set "PROJECT_DIR=C:\Users\欧浩\Desktop\mall-admin-frontend"
set "JAVA=C:\Intel\jdk-21.0.2\bin\java.exe"

:: 1. 启动 MySQL
echo [1] 启动 MySQL 数据库...
net start MySQL80 >nul 2>&1
if %errorlevel%==0 (
    echo     MySQL 启动成功
) else (
    echo     MySQL 已在运行或启动失败
)

:: 2. 启动 Docker (Nacos + Redis)
echo.
echo [2] 启动 Docker 容器...
docker start mall-nacos 2>nul
docker start mall-redis 2>nul
echo     Docker 容器已启动
echo     等待 Nacos 初始化...
timeout /t 8 /nobreak >nul

:: 3. 启动网关 (必须最先启动)
echo.
echo [3] 启动网关服务...
start "Gateway" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-gateway && "%JAVA%" -jar target\mall-gateway-1.0.0.jar"
timeout /t 5 /nobreak >nul

:: 4. 启动用户服务
echo [4] 启动用户服务...
start "User" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-user && "%JAVA%" -jar target\mall-user-1.0.0.jar"
timeout /t 3 /nobreak >nul

:: 5. 启动商品服务
echo [5] 启动商品服务...
start "Product" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-product && "%JAVA%" -jar target\mall-product-1.0.0.jar"
timeout /t 3 /nobreak >nul

:: 6. 启动购物车服务
echo [6] 启动购物车服务...
start "Cart" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-cart && "%JAVA%" -jar target\mall-cart-1.0.0.jar"
timeout /t 3 /nobreak >nul

:: 7. 启动订单服务
echo [7] 启动订单服务...
start "Order" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-order && "%JAVA%" -jar target\mall-order-1.0.0.jar"
timeout /t 3 /nobreak >nul

:: 8. 启动库存服务
echo [8] 启动库存服务...
start "Stock" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-stock && "%JAVA%" -jar target\mall-stock-1.0.0.jar"
timeout /t 3 /nobreak >nul

:: 9. 启动支付服务
echo [9] 启动支付服务...
start "Payment" /min cmd /c "cd /d %PROJECT_DIR%\mall-parent\mall-payment && "%JAVA%" -jar target\mall-payment-1.0.0.jar"
timeout /t 5 /nobreak >nul

:: 10. 启动前端
echo.
echo [10] 启动前端服务...
start "Frontend" /min cmd /c "cd /d %PROJECT_DIR%\mall-qianduan && D:\develop\npm.cmd run dev"

echo.
echo ========================================
echo       所有服务启动完成！
echo ========================================
echo.
echo   前端:   http://localhost:3000
echo   网关:   http://localhost:9000
echo   Nacos:  http://localhost:8848/nacos
echo.
echo   按任意键关闭此窗口...
pause >nul
