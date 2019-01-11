# 微信小程序 @staven/wx-cli

> npm i -g @staven/wx-cli

# 开发流程

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

# 环境变量配置

&emsp;&emsp;在项目根目录下 config.js 配置 serve(开发),build(正式)环境的变量

```
module.exports = {
  serve: {
    baseApi: 'https://test.com/api',
    source: 'https://test.com/images'
  },
  build: {
    baseApi: 'https://prod.com/api',
    source: 'https://prod.com/images'
  },
}

```

### js 文件中使用环境变量

```
onLoad() {
  const api = `/* @echo baseApi */getCityList`;
}
```

wx build 编译后

```
onLoad: function onLoad() {
  var api = "https://prod.com/api/getCityList";
}
```

### wxml 文件中使用环境变量

```
<image mode="widthFix" src="<!-- @echo source -->/banner.png"></image>
```

wx build 编译后

```
onLoad: function onLoad() {
  var image = "https://prod.com/images/banner.png";
}
```
