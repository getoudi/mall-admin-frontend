@echo off
chcp 65001 >nul 2>&1

echo.
echo ========================================
echo       Mall 项目服务状态
echo ========================================
echo.

echo [数据库 MySQL]
sc query MySQL80 2>nul | findstr "RUNNING" >nul
if %errorlevel%==0 (
    echo   MySQL80: 运行中
) else (
    echo   MySQL80: 未运行
)

echo.
echo [Docker 容器]
docker ps --format "  {{.Names}} - {{.Status}}" 2>nul | findstr "mall"
if %errorlevel% neq 0 echo   没有运行的容器

echo.
echo [后端服务]
echo   9000 - 网关 Gateway
echo   8001 - 用户 User
echo   8002 - 商品 Product
echo   8003 - 购物车 Cart
echo   8004 - 订单 Order
echo   8005 - 库存 Stock
echo   8006 - 支付 Payment
echo   3000 - 前端 Frontend
echo.

echo [端口检测]
for %%p in (3306 6379 8848 9000 8001 8002 8003 8004 8005 8006 3000) do (
    netstat -ano | findstr ":%%p " | findstr "LISTENING" >nul 2>&1
    if !errorlevel!==0 (
        echo   端口 %%p: 运行中
    ) else (
        echo   端口 %%p: 未运行
    )
)

echo.
echo ========================================
echo   按任意键关闭此窗口...
pause >nul
