# wx-cli
&emsp;&emsp;小程序脚手架，可使用scss, 字体base64化， 配置多环境变量，正式环境去console

### 配置
##### config配置项
> 配置不同环境下的变量

| 选项名 | 类型 | 是否必填 | 描述 |
| :---  | :--- | :--- | :--- |
| NODE_ENV | String | false |  不同环境的标识 |
| APPID | String | true |  不同环境的appid |
| IMAGE_URL | String | false | 图片路径， 只有配置此变量才会替代wxml,css中图片路径 |
| accessKeyId | String | false | 阿里oss accessKeyId |
| accessKeySecret | String | false | 阿里oss accessKeySecret |
| region | String | false | 阿里oss region |
| bucket | String | false | 阿里oss bucket |
| prefix | String | false | 文件上传至阿里oss的目录, 应与IMAGE_URL结束路径一致 |

##### gulpfile.js配置项

| 选项名 | 类型 | 是否必填 | 默认 |  描述 |
| :---  | :--- | :--- | :--- | :--- |
| src | String | true |  './src' | 开发目录 |
| dist | String | true |  './dist' |打包后的目录 |
| image_reg | String | false | 'static/images/' | 配置了config中IMAGE_URL，则要配置。开发目录下图片路径前缀 |
| sub_prefix | String | true |  'subPages' | 分包根目录 |

#####  gulpfile.js配置
| 选项名 | 描述 |
| :---  | :--- |
| app_path |  app.json目录 |
| page |  page目录 |
| sub |  分包目录 |
| comp |  components目录 |
| src_path |  开发目录 |
| js_path |  js目录 |
| json_path |  json目录 |
| wxml_path |  wxml目录 |
| wxs_path |  wxs目录 |
| wxss_path |  wxss目录 |
| image_path |  图片目录 |
| upload_path |  图片上传目录 |


# 新建文件
### 新建page: --page
> gulp new --page staven

&emsp;&emsp;将在pages目录下新建staven目录，以及index.js，index.json，index.wxml，index.scss，并将路径"pages/staven/index"自动添加到app.json

> gulp new --page staven/login

&emsp;&emsp;将在pages目录下新建staven/login目录，以及index.js，index.json，index.wxml，index.scss

### 新建分包: --sub
> gulp new --sub staven

&emsp;&emsp;将在subPages目录下新建staven/index目录，以及index.js，index.json，index.wxml，index.scss

> gulp new --sub staven/hello

&emsp;&emsp;将在subPages目录下新建staven/hello目录，以及index.js，index.json，index.wxml，index.scss

### 新建component: --comp
> gulp new --comp staven

&emsp;&emsp;将在components目录下新建staven目录，以及index.js，index.json，index.wxml，index.scss

### 自定义文件名: --name
> gulp new --page staven --name demo

&emsp;&emsp;将在pages目录下新建staven目录，以及demo.js，demo.json，demo.wxml，demo.scss，并将路径"pages/staven/demo"自动添加到app.json

### 自定义page页面标题: --title
> gulp new --page staven --title 你好啊

&emsp;&emsp;新建的json文件中，"navigationBarTitleText": "你好啊"

# 多环境变量
### 配置config
&emsp;&emsp;config文件下的测试环境config.dev.js和正式环境config.prod.js
```
module.exports = {
  IMAGE_URL: 'https://test.cn/miniprogram_test/images/'
}
```

2、js文件
```
onLoad() {
  const image = `/* @echo IMAGE_URL */`;
}
```
npm run dev编译后
```
onLoad: function onLoad() {
  var image = "https://test.cn/miniprogram_test/images/";
}
```

3、wxml文件
```
<image mode="widthFix" src="<!-- @echo IMAGE_URL -->banner.png"></image>
```
npm run dev编译后
```
<image mode="widthFix" src="https://test.cn/miniprogram_test/images/banner.png"></image>
```

4、scss文件
&emsp;&emsp;config文件中配置了oss所有变量，将自动替换
```
view {
  background: url("../../static//images/send-question-new.svg");
}
```
npm run dev编译后
```
View {
  background: url("https://test.cn/miniprogram_test/images/send-question-new.svg");
}
```

# 命令
> npm run dev 测试环境编译

> npm run build 正式环境编译

# 运行
&emsp;&emsp;微信开发者工具打开dist目录运行