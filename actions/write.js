const path = require('path')
const Utils = require('../utils/index')
const fs = require('fs')
const download = require('download-git-repo')

const writeWxJSON = type => {
  const projectName = Utils.getProjectName()
  const config = {
    clientName: 'client',
    projectName: projectName,
  }
  Utils.log(`开始写入wx.json`)
  const root = type === 1 ? `${projectName}/wx.json` : `wx.json`
  Utils.createFile(Utils.resolve(root), JSON.stringify(config, null, 2))
}

const writeGulp = (type, flag = 1) => {
  Utils.log(`开始写入gulpfile.js`)
  const root =
    type === 1 ? `${Utils.getProjectName()}/gulpfile.js` : `gulpfile.js`
  Utils.createFile(
    Utils.resolve(root),
    Utils.readFile(Utils.src('../tpls/gulpfile.js')),
    flag,
  )
}

const downFromGitHub = async (root, args, type) => {
  await download(
    'staven630/miniprogram-template',
    Utils.resolve(root),
    function(err) {
      if (err) {
        return Utils.logError('下载小程序模板失败!')
      }

      if (args.length === 0) return

      let appId = null
      if (type === 1 && args.length > 1) {
        appId = args[1]
      }

      if (type === 2 && args.length > 0) {
        appId = args[0]
      }
      Utils.writeAppId(root, appId)
    },
  )
}

const downTpl = (args, type) => {
  const dir =
    type === 1
      ? Utils.resolve(`${Utils.getProjectName()}/client`)
      : Utils.resolve(`client`)
  if (!fs.existsSync(path.resolve(dir, 'app.json'))) {
    Utils.log(`下载小程序模板`)
    Utils.pathExist(dir, () => {
      downFromGitHub(dir, args, type)
    })
  }
}

const writeScript = msg => {
  const dir = Utils.resolve('package.json')
  let pkg = Utils.readFileJSON(dir)
  pkg.scripts['serve'] = 'gulp serve'
  pkg.scripts['build'] = 'gulp build'
  Utils.createFile(dir, JSON.stringify(pkg, null, 2), 2)
  msg && Utils.log(msg)
}

/**
 *
 * @param {*} args
 * @param {*} type 1是create指令，2是init指令
 */
const init = (args, type) => {
  writeWxJSON(type)
  writeGulp(type)
  downTpl(args, type)
}

module.exports = {
  init,
  writeGulp,
  writeScript,
}
