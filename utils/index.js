const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const ora = require('ora')
const spinner = ora('wx-cli***')

const resolve = dir => path.resolve(process.cwd(), dir)

const src = dir => path.resolve(__dirname, dir)

const getProjectName = () => {
  const cwd = process.cwd()
  return path.parse(cwd).base
}

const log = msg => {
  spinner.succeed(chalk.green(msg))
}

const logError = msg => {
  spinner.fail(chalk.red(msg))
}

const logExit = msg => {
  spinner.fail(chalk.red(msg))
  process.exit()
}

const pathExist = (dir, callback, errorCallback) => {
  if (!fs.existsSync(dir)) {
    mkdirp(dir, err => {
      if (err) return errorCallback && errorCallback()
      callback && callback()
    })
  } else {
    return callback && callback()
  }
}

const readFile = file => {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

const readFileJSON = file => {
  if (!fs.existsSync(file)) {
    logExit(`${file}不存在`)
    return null
  }
  return JSON.parse(fs.readFileSync(file))
}

const writeFile = (dir, data = '') => {
  try {
    fs.writeFileSync(dir, data, 'utf8')
    log(`${dir}创建成功!`)
  } catch (error) {
    logExit(`创建${src}失败,请检查上级目录权限!`)
  }
}

// flag为1不允许覆盖
const createFile = (file, data = '', flag = 1) => {
  if (fs.existsSync(file) && flag === 1) return logError(`${file}已存在`)
  const parentDir = path.dirname(file)
  pathExist(
    parentDir,
    () => {
      writeFile(file, data)
    },
    () => {
      logExit(`创建${parentDir}失败,请检查上级目录权限!`)
    },
  )
}

const writeAppId = async (root, appId) => {
  const projectJSONPATH = path.resolve(root, 'project.config.json')
  let projectJSON = JSON.parse(fs.readFileSync(projectJSONPATH))
  projectJSON.appid = appId
  await writeFile(projectJSONPATH, JSON.stringify(projectJSON, null, 2))
}

module.exports = {
  resolve,
  src,
  getProjectName,
  logError,
  logExit,
  log,
  readFile,
  readFileJSON,
  createFile,
  writeAppId,
  pathExist,
}
