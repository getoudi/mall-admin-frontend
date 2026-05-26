# Mall 前端商城系统

一个基于 React 19 + TypeScript + Vite 构建的现代化电商平台前端，采用 Material Design 3 设计风格，提供完整的在线购物体验。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 6 |
| 样式方案 | Tailwind CSS 4 |
| 动画库 | Motion (Framer Motion) |
| 图标库 | Lucide React |
| HTTP 客户端 | Axios |
| 字体 | Inter (Google Fonts) |

## 功能模块

### 用户系统
- 用户注册 / 登录
- 个人资料编辑
- 退出登录

### 商品系统
- 首页 Banner 轮播
- 8 大商品分类浏览
- 商品搜索 + 分类筛选
- 商品列表分页展示
- 商品详情（库存、评分、销量）

### 购物车系统
- 添加商品到购物车
- 修改商品数量
- 全选 / 单选商品
- 删除购物车商品
- 购物车结算

### 订单系统
- 提交订单（选择收货地址）
- 订单支付
- 订单列表（按状态筛选）
- 订单详情查看
- 取消订单 / 确认收货 / 删除订单

### 收货地址管理
- 地址列表展示
- 新增 / 编辑 / 删除地址
- 设置默认地址

## 项目结构

```
mall-qianduan/
├── src/
│   ├── App.tsx              # 主应用组件（包含所有页面视图）
│   ├── main.tsx             # 应用入口
│   ├── types.ts             # TypeScript 类型定义
│   ├── index.css            # 全局样式 + Tailwind 配置
│   └── api/                 # API 接口模块
│       ├── config.ts        # Axios 基础配置
│       ├── user.ts          # 用户相关接口
│       ├── product.ts       # 商品相关接口
│       ├── cart.ts          # 购物车接口
│       ├── order.ts         # 订单相关接口
│       ├── payment.ts       # 支付接口
│       ├── address.ts       # 收货地址接口
│       └── stock.ts         # 库存查询接口
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 页面视图

| 视图 | 说明 |
|------|------|
| `home` | 首页 - Banner、分类、商品列表 |
| `product` | 商品详情页 |
| `cart` | 购物车 |
| `checkout` | 结算页 - 确认订单信息 |
| `payment` | 支付页 - 选择支付方式 |
| `orders` | 我的订单列表 |
| `orderDetail` | 订单详情 |
| `address` | 收货地址管理 |
| `profile` | 个人中心 |
| `login` | 登录页 |
| `register` | 注册页 |

## 快速开始

### 环境要求
- Node.js >= 18
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 后端依赖

本项目需要配合后端微服务使用：

| 服务 | 端口 | 说明 |
|------|------|------|
| mall-gateway | 9000 | API 网关 |
| mall-user | 8001 | 用户服务 |
| mall-product | 8002 | 商品服务 |
| mall-cart | 8003 | 购物车服务 |
| mall-order | 8004 | 订单服务 |
| mall-payment | 8005 | 支付服务 |
| mall-stock | 8006 | 库存服务 |
| Nacos | 8848 | 服务注册中心 |

## 设计特点

- **Material Design 3** 风格，采用 `surface`、`primary-container` 等语义化颜色
- **响应式布局**，适配桌面端和移动端
- **流畅动画**，使用 Motion 实现页面切换和交互动画
- **无路由架构**，通过 View 状态切换实现单页应用
