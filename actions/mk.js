const path = require('path')
const fs = require('fs')
const Utils = require('../utils/index')

const copyTpl = (args, src) => {
  if (args.length === 0) return Utils.logExit('请输入正确路径')
  const name = args.length === 1 ? 'index' : args[1]
  const wxJSON = Utils.readFileJSON(Utils.resolve('wx.json'))
  if (!wxJSON) return
  const projectPATH = Utils.resolve(wxJSON.clientName)
  const basePATH = path.resolve(projectPATH, args[0])
  const jsPath = path.resolve(basePATH, `${name}.js`)
  if (!fs.existsSync(jsPath)) {
    Utils.pathExist(
      basePATH,
      () => {
        initTpl(basePATH, name, src)
        if (src === 'page') {
          writeAppJSON(projectPATH, args[0], name)
        }
      },
      () => {
        return Utils.logExit(`创建目录${dir}失败`)
      },
    )
  } else {
    Utils.logError(`${args[0]}/${name}已存在`)
  }
}

const initTpl = (basePATH, name, src) => {
  const jsTpl = require(`../tpls/${src}/js.js`)
  fs.writeFileSync(path.resolve(basePATH, `${name}.js`), jsTpl, 'utf8')
  const jsonTpl = require(`../tpls/page/json.js`)
  fs.writeFileSync(path.resolve(basePATH, `${name}.json`), jsonTpl, 'utf8')
  fs.writeFileSync(path.resolve(basePATH, `${name}.scss`), '', 'utf8')
  fs.writeFileSync(path.resolve(basePATH, `${name}.wxml`), '', 'utf8')
}

const writeAppJSON = (projectPATH, base, name) => {
  const appJSONPATH = path.resolve(projectPATH, 'app.json')
  const appJSON = Utils.readFileJSON(appJSONPATH)
  if (!appJSON) return
  let pages = base.split('/')
  pages = pages.filter(key => !!key)
  if (pages[0] === 'pages') {
    if (!appJSON.pages) {
      appJSON.pages = [`${pages.join('/')}/${name}`]
    } else {
      appJSON.pages = [
        ...new Set([...appJSON.pages, `${pages.join('/')}/${name}`]),
      ]
    }
  } else {
    const rootName = pages.shift()
    const currentName = `${pages.join('/')}/${name}`
    if (!appJSON.subpackages) {
      appJSON.subpackages = [
        {
          root: rootName,
          name: rootName,
          pages: [currentName],
        },
      ]
    } else {
      let idx = null
      appJSON.subpackages.forEach((item, index) => {
        if (item.root == rootName) {
          appJSON.subpackages[index].pages = [
            ...new Set([...item.pages, currentName]),
          ]
          idx = index
        }
      })
      if (idx === null) {
        appJSON.subpackages.push({
          root: rootName,
          name: rootName,
          pages: [currentName],
        })
      }
    }
  }
  fs.writeFileSync(appJSONPATH, JSON.stringify(appJSON, null, 2), 'utf8')
  Utils.log(`创建成功!`)
}

const makePage = args => {
  copyTpl(args, 'page')
}

const makeComp = args => {
  let pages = args[0].split('/')
  pages = pages.filter(key => !!key)
  if (pages.length === 0) {
    return Utils.logExit('请输入插件名')
  }
  const componentPath = Utils.resolve(`client/components/${pages[0]}`)
  const file = path.resolve(componentPath, 'index.js')
  if (fs.existsSync(file)) {
    return Utils.logExit('插件已存在')
  } else {
    Utils.pathExist(componentPath, () => {
      initTpl(componentPath, 'index', 'component')
      Utils.log(`创建成功!`)
    })
  }
}

module.exports = {
  makePage,
  makeComp,
}
