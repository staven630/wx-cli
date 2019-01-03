const path = require('path')
const Utils = require('../utils/index')
const fs = require('fs')
const download = require('download-git-repo')

const writeWxJSON = (projectName, type) => {
  const config = {
    clientName: 'client',
    projectName: projectName,
  }
  Utils.log(`开始写入wx.json`)
  const root = type === 1 ? `${projectName}/wx.json` : `wx.json`
  Utils.createFile(Utils.resolve(root), JSON.stringify(config, null, 2))
}

const writeGulp = (projectName, str, type, flag = 1) => {
  Utils.log(`开始写入${str}`)
  const root = type === 1 ? `${projectName}/${str}` : `${str}`
  Utils.createFile(
    Utils.resolve(root),
    Utils.readFile(Utils.src(`../tpls/${str}`)),
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

const downTpl = (projectName, args, type) => {
  const dir =
    type === 1
      ? Utils.resolve(`${projectName}/client`)
      : Utils.resolve(`client`)
  if (!fs.existsSync(path.resolve(dir, 'app.json'))) {
    Utils.log(`下载小程序模板`)
    Utils.pathExist(dir, () => {
      downFromGitHub(dir, args, type)
    })
  }
}

const writeScript = (root, msg) => {
  const dir = Utils.resolve(root ? `${root}/package.json` : `package.json`)
  let pkg = Utils.readFileJSON(dir)
  pkg.scripts['serve'] = 'cross-env NODE_ENV=serve gulp serve'
  pkg.scripts['build'] = 'cross-env NODE_ENV=build gulp build'
  Utils.createFile(dir, JSON.stringify(pkg, null, 2), 2)
  msg && Utils.log(msg)
}

/**
 *
 * @param {*} args
 * @param {*} type 1是create指令，2是init指令
 */
const init = (projectName, args, type) => {
  writeWxJSON(projectName, type)
  writeGulp(projectName, 'gulpfile.js', type)
  writeGulp(projectName, 'config.js', type)
  downTpl(projectName, args, type)
}

module.exports = {
  init,
  writeGulp,
  writeScript,
}
