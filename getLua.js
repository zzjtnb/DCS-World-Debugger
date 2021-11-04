const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const StreamZip = require('node-stream-zip');

changeSuffix = (filePath, suffix) => {
  glob(filePath, (err, files) => {
    if (err) return console.error(err);
    if (files.length == 0) return;
    const regex = new RegExp(path.extname(filePath) + '$', 'g');
    files.forEach((item) => {
      fs.rename(item, item.replace(regex, suffix), (err) => {
        if (err) return console.error(err);
        console.log('重命名完成!');
      });
    });
  });
};

getLua = (file) => {
  glob(file, (err, files) => {
    if (err) return console.error(err);
    if (files.length == 0) return;

    files.forEach(async (item) => {
      const filePath = item.substring(0, item.lastIndexOf('.'));
      await fs.remove(filePath);
      fs.mkdirsSync(filePath);
      console.log('创建文件夹完成!');

      const zip = new StreamZip({ file: item, storeEntries: true });
      zip.on('ready', () => {
        console.log('已读条目: ' + zip.entriesCount);
        // for (const entry of Object.values(zip.entries())) {
        //   console.log(entry.name);
        // }
      });
      let data = '';
      zip.on('entry', (entry) => {
        if (entry.name == 'mission') {
          zip.stream(entry.name, (err, stm) => {
            // stm.pipe(process.stdout);
            stm.setEncoding('utf8');
            stm.pipe(fs.createWriteStream(`${filePath}/${entry.name}.lua`));
            stm.on('end', () => {
              console.log('文件写入完成');
              zip.close();
            });
            stm.on('data', (chunk) => {
              data += chunk;
            });
            stm.on('end', () => {
              // console.log(data);
            });
          });
        }
      });
    });
  });
};
changeSuffix('./test/Missions/*.miz', '.zip');
getLua('./test/Missions/*.zip');
