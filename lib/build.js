const shell = require('shelljs')

module.exports = args => {
  shell.exec(`npm run build`)
}
