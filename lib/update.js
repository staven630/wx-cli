const fs = require('fs')
const shell = require('shelljs')
const Utils = require('../utils/index')
const Write = require('../actions/write')

module.exports = args => {
  if (
    !fs.existsSync(Utils.resolve('gulpfile.js')) ||
    !fs.existsSync(Utils.resolve('wx.json'))
  ) {
    return Utils.logExit(`不是wx-cli项目`)
  }
  Utils.log(`开始更新gulpfile.js`)
  Write.writeGulp(2, 2)
  shell.exec(
    `npm init -y && npm install -S node-sass --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass && npm i -S gulp gulp-sass gulp-rename gulp-postcss postcss-font-base64`,
    () => {
      Write.writeScript('更新成功')
    },
  )
}
