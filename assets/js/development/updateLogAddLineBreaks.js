/**
 * 插入换行符
 */
let str = "";
process.stdout.write('【插入换行符】\n请输入README中的更新内容字符串（1.xxx。2.xxx。3.xxx。）:\n');
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
      txt += list[i];
      if (i !== list.length - 1) txt += "\n";
    }
    process.stdout.write("\n处理完成: \n\n" + txt + "\n");
  }
});