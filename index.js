const program = require('commander')
const shell = require('shelljs')
const pkg = require('./package.json')

program
  .version(pkg.version, '-v, --version0')
  .option('c, create', '')
  .option('i, init', '')
  .option('n, new', '')
  .option('p, comp', '')
  .option('u, update', 'update wx-cli')
  .option('s, serve', '')
  .option('b, build', '')
  .parse(process.argv)

const libs = ['init', 'create', 'new', 'comp', 'update', 'serve', 'build']

libs.forEach(key => {
  if (program[key]) {
    require(`./lib/${key}`)(program.args)
  }
})
