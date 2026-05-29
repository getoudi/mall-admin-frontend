# 🛒 Mall 全栈商城系统

一个基于 **Spring Boot 微服务 + React 19** 构建的全栈电商平台，采用 Material Design 3 设计风格，提供完整的在线购物体验。

## 📸 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | React 19 + TypeScript + Vite 6 + Tailwind CSS 4 |
| **后端** | Spring Boot 3 + Spring Cloud + MyBatis Plus |
| **数据库** | MySQL 8 |
| **服务注册** | Nacos |
| **网关** | Spring Cloud Gateway |
| **容器化** | Docker Compose |

## 🏗️ 项目结构

```
mall-admin-frontend/
├── mall-qianduan/          # 前端项目
│   └── src/
│       ├── App.tsx         # 主应用组件
│       ├── api/            # API 接口模块
│       ├── components/     # 可复用组件
│       ├── constants/      # 常量定义
│       └── utils/          # 工具函数
│
├── mall-parent/            # 后端微服务
│   ├── mall-gateway/       # API 网关 (端口 9000)
│   ├── mall-user/          # 用户服务 (端口 8001)
│   ├── mall-product/       # 商品服务 (端口 8002)
│   ├── mall-cart/          # 购物车服务 (端口 8003)
│   ├── mall-order/         # 订单服务 (端口 8004)
│   ├── mall-payment/       # 支付服务 (端口 8005)
│   ├── mall-stock/         # 库存服务 (端口 8006)
│   └── mall-common/        # 公共模块
│
├── docker-compose.yml      # Docker 编排
├── start-all.cmd           # 一键启动脚本
├── stop-all.cmd            # 一键停止脚本
└── status.cmd              # 服务状态检查
```

## ✨ 功能特性

### 前端功能
- 🏠 **首页** - Banner 轮播、8 大商品分类、商品搜索与筛选
- 📦 **商品系统** - 商品列表分页、详情展示（库存/评分/销量）
- 🛒 **购物车** - 添加/删除商品、修改数量、全选/单选结算
- 📋 **订单系统** - 提交订单、支付、订单列表（状态筛选）、订单详情
- 📍 **地址管理** - 新增/编辑/删除地址、设置默认地址
- 👤 **用户系统** - 注册/登录、个人中心

### 后端架构
- **微服务架构** - 7 个独立服务，职责分离
- **API 网关** - 统一入口、路由转发、JWT 认证
- **服务发现** - Nacos 注册中心，动态服务发现
- **分布式 ID** - 雪花算法生成唯一订单号

## 🚀 快速开始

### 环境要求
- JDK 17+
- Node.js 18+
- MySQL 8.0+
- Nacos 2.x

### 1. 启动后端服务

```bash
# 方式一：使用脚本（推荐）
start-all.cmd

# 方式二：手动启动
cd mall-parent
mvn clean package -DskipTests
# 依次启动各微服务
```

### 2. 启动前端

```bash
cd mall-qianduan
npm install
npm run dev
```

访问 http://localhost:3000

### 3. Docker 部署（可选）

```bash
docker-compose up -d
```

## 📊 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| mall-gateway | 9000 | API 网关（统一入口） |
| mall-user | 8001 | 用户服务 |
| mall-product | 8002 | 商品服务 |
| mall-cart | 8003 | 购物车服务 |
| mall-order | 8004 | 订单服务 |
| mall-payment | 8005 | 支付服务 |
| mall-stock | 8006 | 库存服务 |
| Nacos | 8848 | 服务注册中心 |
| MySQL | 3306 | 数据库 |

## 🎨 设计特点

- **Material Design 3** - 采用 `surface`、`primary-container` 等语义化颜色
- **响应式布局** - 适配桌面端和移动端
- **流畅动画** - 使用 Motion 实现页面切换和交互动画
- **无路由架构** - 通过 View 状态切换实现单页应用

## 📝 开发说明

### 前端开发
```bash
cd mall-qianduan
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

### 后端开发
```bash
cd mall-parent
mvn clean install        # 编译所有模块
mvn clean package -DskipTests  # 打包（跳过测试）
```

## 🤝 贡献者

- **getoudi** - 项目开发者
- **Claude** - AI 辅助开发

## 📄 License

MIT License
