# 微信小程序 wx-cli

### 创建

&nbsp;&nbsp;有两种创建方式。appid 可选参数，为小程序 appId。

- 在目录下创建项目

  > wx create 项目名 appid

- 在项目目录里初始化项目
  > wx init appid

### 新建 page

&nbsp;&nbsp;自动在 app.json 中添加 pages 或分包路径。
&nbsp;&nbsp;第三个参数以非 pages/开头将视为分包创建

> wx new pages/demo

&nbsp;&nbsp;生成 pages/demo/index.js(scss/json/wxml)

> wx new pages/demo demo

&nbsp;&nbsp;生成 pages/demo/demo.js(scss/json/wxml)

> wx new subs/demo

&nbsp;&nbsp;生成 subs/demo/index.js(scss/json/wxml)

> wx new subs/demo demo

&nbsp;&nbsp;生成 subs/demo/demo.js(scss/json/wxml)

### 新建 component

> wx comp demo

### 更新配置

&nbsp;&nbsp;主要更新 gulp 配置，以及依赖

> wx update

### 开发

> wx serve

### 上线

> wx build
