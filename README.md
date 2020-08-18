# umi-boilerplate

> 

这是一个基于 [UMI](https://umijs.org) 的项目模板。

## 索引
- [功能](#features)
- [脚本](#scripts)
- [目录](#dirctory)

<a name="features"></a>
## 功能

- [x] antd按需加载配置  
- [x] sass配置  
- [x] eslint规范配置  
- [x] babel配置,提供装饰器写法  
- [x] docker、k8s部署配置  
- [x] ie10兼容  
- [x] husky配置,git提交检测  
- [x] prettier代码格式化配置  
- [x] webpack dll加速  
- [ ] 路由模块  
  - [x] 权限路由  
  - [x] 菜单  
  - [x] 面包屑  
  - [x] code splitting  
  - [ ] 路由配置优化、性能优化  
- [x] 重构接口请求  
  - [x] 动态处理返回数据格式(json、blob)  
  - [x] 是否抛异常  
  - [x] 设置拦截器及是否启用  
  - [x] 超时设置  
  - [x] 请求语法糖(request.post)  
  - [x] token异常处理(与router、redux协调)  
  - [x] ie禁用缓存  
  - [x] 错误统一处理(状态码、网络、业务错误)  
  - [ ] 支持fetch、xhr切换(方便处理文件上传、切片及断点上传)  
  - [ ] 剥离业务逻辑、沉淀基础请求工具，支持业务逻辑、错误处理可配置  
- [x] Mock  
  - [x] Yapi  
  - [x] 本地  
- [ ] 基础组件  
  - [x] IconFont  
  - [x] Loading  
  - [x] CustomTable
  - [ ] Description   
- [ ] 业务组件  
- [ ] 预设hooks  
  - [x] setInterval  

<a name="scripts"></a>
## NPM脚本命令

In the project directory, you can run:

### `npm start`

开发环境启动项目  
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

### `npm run build`

打包构建生产环境的项目命令

### `npm run lint`

eslint检测代码

### `npm run lint-fix`

eslint检测代码+修复

### `npm run prettier`

prettier格式化代码

### `npm run docker:build`

使用docker打包项目镜像

<a name="dirctory"></a>
## 目录及文件介绍

- .vscode 使用vscode进行项目代码调试
- config umi配置
- docker 容器脚本及nginx配置
- mock 本地数据模拟
- public 静态资源目录
- scripts git相关脚本
- src 项目源代码
  - assets 静态资源
  - common 常量管理
  - components 组件
  - hooks react hooks
  - layout 布局组件
  - models 状态管理
  - pages 页面
  - services 接口
  - utils 工具
  - App.js umi配置文件
  - global.scss 全局样式
  - variable.scss 变量样式
- .dockerignore docker文件忽略配置
- .editorconfig 编辑器格式配置
- .env umi环境变量
- .eslintignore eslint文件忽略配置
- .eslintrc.js eslint配置
- .gitignore git文件忽略配置
- .prettierignore prettier文件忽略配置
- .prettierrc.js perttier配置
- deployment.yaml kubernetes配置
- Dockerfile docker配置
- jsconfig.json js文件配置
- package-lock.json npm版本锁定
- package.json npm配置
- README.md 模板指南
