/**
 * 转换为数组字符串格式
 */
const { exec } = require('child_process');
const iconv = require('iconv-lite');

let str = "";
process.stdout.write('【转换为数组字符串格式】\n请输入update-log中的更新内容字符串（1.xxx。2.xxx。3.xxx。）:\n');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if (chunk !== null) {
    str = chunk
    let list = str.split(/\d+\./);
    // console.log("list", list)
    let txt = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].length === 0) continue;
      list[i] = list[i].replace(/[\r\n]/g, "");
      txt += `"` + list[i] + `"`;
      if (i !== list.length - 1) txt += ",\n";
    }
    exec('clip').stdin.end(iconv.encode(txt, 'gbk'));
    process.stdout.write("\n处理完成 (已复制到剪切板): \n\n" + txt + "\n");
  }
});

