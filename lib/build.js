const shell = require('shelljs')

module.exports = args => {
  shell.exec(`gulp build`)
}
