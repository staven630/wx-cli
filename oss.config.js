const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');
const colors = require('ansi-colors')
const log = require('fancy-log')

const greenLog = (message) => {
  log(colors.green(message));
};

const redLog = (message) => {
  log(colors.green(message));
};

const files = [];

const readDirSync = function (config, dir) {
  const cur_dir = fs.readdirSync(dir);
  cur_dir.forEach(path => {
    const cur_path = `${dir}/${path}`;
    const cur_file = fs.statSync(cur_path);
    if (cur_file.isDirectory()) {
      readDirSync(cur_path)
    } else if (!config.exclude || !config.exclude.test(cur_path)) {
      files.push(cur_path);
    }
  })
};

async function deleteAll(config, store) {
  try {
    let result = await store.list({
      prefix: config.prefix
    });
    if (result.objects) {
      result = result.objects.map(file => file.name);
    }
    await store.deleteMulti(result, {
      quiet: true
    });
    greenLog('删除完成！');
  } catch (e) {
    redLog('删除失败！')
  }
}


async function uploadFiles(config, store, files, root) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i == 0) {
      greenLog('***开始上传***')
    }
    try {
      await store.put(`${config.prefix}${file.replace(`${root}/`, '')}`, file);
      if (i == files.length - 1) {
        greenLog('***上传完成***')
      } else {
        greenLog(`${file}上传成功!`);
      }
    } catch (e) {
      greenLog(`${file}上传失败!`);
    }

  }
}

module.exports = function(options, deleteAll = false) {
  const { dir, accessKeyId, accessKeySecret, bucket, region, prefix } = options;
  const root = path.resolve(__dirname, options.dir);
  // OSS配置
  const config = {
    auth: {
      accessKeyId,
      accessKeySecret,
      bucket,
      region
    },
    prefix,
    exclude: /.*\.html$/,
    enableLog: true,
    ignoreError: false,
    removeMode: true,
    deleteAll: deleteAll || options.deleteAll
  };
  //构建OSS对象
  const store = OSS(config.auth);
  config.deleteAll && deleteAll(config, store);
  readDirSync(config, root);
  uploadFiles(config, store, files, root);
};