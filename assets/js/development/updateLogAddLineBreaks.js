/**
 * 插入换行符
 */
const { exec } = require('child_process');
const iconv = require('iconv-lite');
let str = "";
process.stdout.write('【插入换行符】\n请输入update-log中的更新内容字符串（1.xxx。2.xxx。3.xxx。）:\n');
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if (chunk !== null) {
    str = String(chunk);
    str = str.replace(/。/g, "。\n");
    exec('clip').stdin.end(iconv.encode(str, 'gbk'));
    process.stdout.write("\n处理完成 (已复制到剪切板): \n\n" + str);
  }
});