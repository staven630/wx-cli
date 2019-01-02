const fs = require('fs')
const Write = require('../actions/write')
const shell = require('shelljs')
const Utils = require('../utils')

module.exports = args => {
  if (
    fs.existsSync(Utils.resolve('gulpfile.js')) ||
    fs.existsSync(Utils.resolve('wx.json'))
  ) {
    return Utils.logExit(`项目已存在`)
  }
  let projectName = Utils.getProjectName()

  Write.init(projectName, args, 2)
  Utils.log('开始安装依赖，稍等片刻~~~')
  shell.exec(
    `npm init -y && npm install -S node-sass --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass && npm i -S gulp gulp-sass  del gulp-rename gulp-postcss postcss-font-base64`,
    () => {
      Write.writeScript('', '配置成功')
    },
  )
}
