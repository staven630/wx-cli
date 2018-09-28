module.exports = {
  ENV: 'prod',  // 环境
  IMAGE_URL: 'https://prod.com/miniprogram_prod/images/', // 图片路径，会替代wxml,css中图片路径
  BASE_API: 'https://prod.com', // 接口
  OSS_CONFIG: { // 不配置将不上传图片至阿里oss
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: '',
    prefix: 'miniprogram_prod/images/'    // 上传至oss的目录
  }
}