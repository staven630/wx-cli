const fs = require('fs')
const Write = require('../actions/write')
const shell = require('shelljs')
const Utils = require('../utils/index')

module.exports = args => {
  let projectName = Utils.getProjectName()
  if (args.length > 0) {
    projectName = args[0]
  }
  if (
    fs.existsSync(Utils.resolve(`${projectName}/gulpfile.js`)) ||
    fs.existsSync(Utils.resolve(`${projectName}/wx.json`))
  ) {
    return Utils.logExit(`项目已存在`)
  }
  Write.init(projectName, args, 1)
  Utils.log('开始安装依赖，稍等片刻~~~')
  shell.exec(
    `cd ${projectName} && npm init -y && npm install -S node-sass --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist --sass-binary-site=http://npm.taobao.org/mirrors/node-sass && npm i -S gulp gulp-sass del gulp-rename gulp-postcss postcss-font-base64`,
    () => {
      Write.writeScript(projectName, '配置成功')
    },
  )
}
