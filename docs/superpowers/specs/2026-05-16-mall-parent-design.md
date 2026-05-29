# Mall Parent 微服务父工程设计

## 概述

创建一个基于 Spring Boot 3.3 + Spring Cloud Alibaba 的微服务父工程，用于电商平台后端开发。

## 技术栈

| 组件 | 版本 |
|------|------|
| JDK | 21 |
| Spring Boot | 3.3.5 |
| Spring Cloud | 2023.0.3 |
| Spring Cloud Alibaba | 2023.0.3.2 |
| MyBatis-Plus | 3.5.7 |
| MySQL Connector | 8.0.33 |
| Hutool | 5.8.32 |
| JJWT | 0.12.6 |
| Redisson | 3.27.2 |

## 项目结构

```
mall-parent/
├── pom.xml                    # 父 POM（聚合 + 依赖管理）
├── mall-common/               # 公共模块（工具类、通用配置）
├── mall-gateway/              # API 网关（端口 9000）
├── mall-user/                 # 用户服务（端口 8001）
├── mall-product/              # 商品服务（端口 8002）
├── mall-cart/                 # 购物车服务（端口 8003）
├── mall-order/                # 订单服务（端口 8004）
├── mall-stock/                # 库存服务（端口 8005）
└── mall-payment/              # 支付服务（端口 9006）
```

## 模块职责

| 模块 | 职责 | 端口 |
|------|------|------|
| mall-common | 公共工具类、通用配置、统一响应 | - |
| mall-gateway | API 路由、鉴权、限流 | 9000 |
| mall-user | 用户注册、登录、信息管理 | 8001 |
| mall-product | 商品管理、分类、SKU | 8002 |
| mall-cart | 购物车增删改查 | 8003 |
| mall-order | 订单创建、状态管理 | 8004 |
| mall-stock | 库存扣减、预占 | 8005 |
| mall-payment | 支付对接、回调处理 | 9006 |

## 父 POM 依赖管理

父 POM 通过 `<dependencyManagement>` 统一管理以下依赖版本：

1. **Spring 生态**
   - spring-boot-dependencies 3.3.5
   - spring-cloud-dependencies 2023.0.3
   - spring-cloud-alibaba-dependencies 2023.0.3.2

2. **数据库**
   - mybatis-plus-spring-boot3-starter 3.5.7
   - mysql-connector-j

3. **工具**
   - lombok
   - hutool-all 5.8.32

4. **安全**
   - jjwt 0.12.6

5. **缓存**
   - spring-boot-starter-data-redis
   - redisson-spring-boot-starter 3.27.2

6. **消息队列**
   - spring-boot-starter-amqp (RabbitMQ)

7. **网关**
   - spring-cloud-starter-gateway

8. **校验**
   - spring-boot-starter-validation

## 子模块 POM

每个子模块的 POM 继承父 POM，仅声明自身需要的依赖，无需重复指定版本号。

## 实现计划

1. 创建父 `pom.xml`
2. 创建 `mall-common/pom.xml`
3. 依次创建各业务模块的 `pom.xml`
4. 验证 Maven 构建
