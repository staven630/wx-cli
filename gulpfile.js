const gulp = require('gulp')
const path = require('path')
const fs = require('fs')
const rename = require('gulp-rename')
const del = require('del')

const mkdirp = require('mkdirp')
const imagemin = require('gulp-imagemin')

const through = require('through2')
const colors = require('ansi-colors')
const log = require('fancy-log')
const argv = require('minimist')(process.argv.slice(2))

const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const base64 = require('postcss-font-base64')

const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const jsonminify = require('gulp-jsonminify')
const combiner = require('stream-combiner2')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const cssnano = require('gulp-cssnano')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const filter = require('gulp-filter')
const preprocess = require('gulp-preprocess')
const modifyCssUrls = require('gulp-modify-css-urls')
const removeLog = require("gulp-remove-logging")

const devConfig = require('./config/config.dev')
const prodConfig = require('./config/config.prod')

const isBuild = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev'
const isProd = process.env.NODE_ENV === 'prod'
const envConfig = isProd ? prodConfig : devConfig;

const src = './src'
const dist = './dist'
const image_reg = 'static/images/';
const paths = {
  app_path: `${src}/app.json`,
  cloud_path: './server/cloud-functions',
  page: `${src}/pages/`,
  sub: `${src}/subPages/`,
  comp: `${src}/components/`,
  dist_path: './dist',
  src_path: `${src}/**`,
  js_path: `${src}/**/**.js`,
  json_path: `${src}/**/*.json`,
  wxml_path: `${src}/**/*.wxml`,
  wxs_path: `${src}/**/*.wxs`,
  wxss_path: `${src}/**/*.{wxss,scss}`,
  image_path: `${src}/static/images/**`,
  image_dist: `${dist}/static/images`,
  upload_path: `${src}/static/images`,
}

const uploadOSS = require('./oss.config')

const handleError = (err) => {
  console.log('\n')
  log(colors.red('Error!'))
  log('fileName: ' + colors.red(err.fileName))
  log('lineNumber: ' + colors.red(err.lineNumber))
  log('message: ' + err.message)
  log('plugin: ' + colors.yellow(err.plugin))
}

const writeJSON = function () {
  gulp
    .src(paths.json_path)
    .pipe(isBuild ? jsonminify() : through.obj())
    .pipe(gulp.dest(paths.dist_path))
};

const createWXMLWXSS = (filePath, name) => {
  fs.writeFileSync(path.resolve(filePath, name + '.wxml'), ``)
  fs.writeFileSync(path.resolve(filePath, name + '.scss'), ``)
};

const addPageJSON = (json, filePath, name) => {
  if (json['pages']) {
    json = {
      ...json,
      pages: Array.from(new Set([...json.pages, `pages/${filePath}/${name}`]))
    }
  } else {
    json['pages'] = [
      `pages/${filePath}/${name}`
    ]
  }
  return json;
}

const addSubPagesJSON = (json, filePathArr, name) => {
  let subRoot;
  let subPath;
  subRoot = filePathArr[0];
  if (filePathArr.length == 1) {
    subPath = `${name}/${name}`;
  } else {
    filePathArr.shift();
    subPath = filePathArr.join('/')
  }

  if (json['subPackages']) {
    const isExist = json['subPackages'].some(item => {
      return item.root && item.root == `subPages/${subRoot}`;
    });

    if (!isExist) {
      json['subPackages'].push({
        "root": `"subPages/${subRoot}"`,
        "pages": [
          `${subPath}`
        ]
      });
    } else {
      json['subPackages'].map(item => {
        if (item.root != `subPages/${subRoot}`) return item;
        return {
          ...item,
          "pages": Array.from(new Set([...json.pages, `${subPath}`]))
        }
      })
    }

  } else {
    json['subPackages'] = [
      {
        "root": `subPages/${subRoot}`,
        "pages": [
          `${subPath}`
        ]
      }
    ]
  }
  return json;
};

const createPageTpl = (page, filePath, name = 'index', title = '') => {
  const pageRoot = path.resolve(paths[page], filePath);
  let json = JSON.parse(fs.readFileSync(paths.app_path));
  const filePathArr = filePath.split('/');
  if (filePathArr.length < 1) return log(colors.red('文件已存在'));
  if (fs.existsSync(pageRoot)) return log(colors.red('文件已存在'));

  mkdirp.sync(pageRoot)

  const isComp = page === 'comp'
  const source = isComp ? `./template/component` : `./template/page`
  createWXMLWXSS(pageRoot, name)
  const jsTpl = require(`${source}/js.js`)
  const jsPath = path.resolve(pageRoot, name + '.js')
  fs.writeFileSync(jsPath, jsTpl)
  const jsonTpl = require(`${source}/json.js`);
  const jsonPath = path.resolve(pageRoot, name + '.json')
  fs.writeFileSync(jsonPath, typeof jsonTpl === 'function' ? jsonTpl(title) : jsonTpl)

  if (page === 'page') {
    json = addPageJSON(json, filePath, name)
  }

  if (page === 'sub') {
    json = addSubPagesJSON(json, filePathArr, name)
  }

  fs.writeFileSync(paths.app_path, JSON.stringify(json, null, 2), 'utf8', (err) => {
    if (err) throw err;
  });

  writeJSON();
}

const createPage = (page, options) => {
  createPageTpl(page, options[page], options.name, options.title);
};

gulp.task('new', () => {
  if (argv.page) return createPage('page', argv)
  if (argv.sub) return createPage('sub', argv)
  if (argv.comp) return createPage('comp', argv)
})

gulp.task('oss', () => {
  let ossConfig = envConfig.OSS_CONFIG;
  if (!ossConfig || !ossConfig.accessKeyId || !ossConfig.accessKeySecret ||
    !ossConfig.bucket || !ossConfig.region) return;
  ossConfig['dir'] = paths.upload_path;
  argv.delete = argv.delete ? argv.delete : false
  uploadOSS(ossConfig, argv.delete);
})


gulp.task('json', () => {
  writeJSON();
})

gulp.task('wxml', () => {
  return gulp
    .src(paths.wxml_path)
    .pipe(
      isBuild ? htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        keepClosingSlash: true
      }) : through.obj()
    )
    .pipe(preprocess({
      context: envConfig
    }))
    .pipe(gulp.dest(paths.dist_path))
})

gulp.task('wxs', () => {
  return gulp
    .src(paths.wxs_path)
    .pipe(gulp.dest(paths.dist_path))
})


gulp.task('wxss', () => {
  const combined = combiner.obj([
    gulp.src(paths.wxss_path),
    sass().on('error', sass.logError),
    postcss([pxtorpx(), base64()]),
    isBuild ? cssnano({
      autoprefixer: false,
      discardComments: { removeAll: true }
    }) : through.obj(),
    rename((path) => (path.extname = '.wxss')),
    envConfig.IMAGE_URL ? modifyCssUrls({
      modify: (url, filePath) => {
        console.log(url, filePath)
        return url.substring(url.indexOf(image_reg) + image_reg.length);
      },
      prepend: envConfig.IMAGE_URL
    }) : through.obj(),
    gulp.dest(paths.dist_path)
  ])
  combined.on('error', handleError)
})

gulp.task('images', () => {  
  return gulp
    .src(paths.image_path)
    .pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
    .pipe(gulp.dest(paths.image_dist))
})

gulp.task('js', () => {
  const f = filter((file) => !/(mock|bluebird)/.test(file.path));
  gulp
    .src(paths.js_path)
    .pipe(isBuild ? f : through.obj())
    .pipe(isProd ? through.obj() : sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(
      isProd
        ? uglify({
          compress: true
        })
        : through.obj()
    )
    .pipe(isProd ? removeLog() : sourcemaps.write('./'))
    .pipe(preprocess({
      context: envConfig
    }))
    .pipe(gulp.dest(paths.dist_path))
})

gulp.task('watch', () => {
  ;['wxml', 'wxss', 'js', 'json', 'wxs'].forEach((v) => {
    gulp.watch(`${paths.src_path}/*.${v}`, [v])
  })
  gulp.watch(paths.image_path, ['images'])
  gulp.watch(paths.wxss_path, ['wxss'])
})

gulp.task('clean', () => {
  return del([`${paths.dist_path}/**`])
})

gulp.task('dev', ['clean'], () => {
  runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'oss', 'watch')
})

gulp.task('build', ['clean'], () => {
  runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'oss')  
})


