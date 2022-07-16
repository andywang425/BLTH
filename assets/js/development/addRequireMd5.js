const fs = require('fs')
const Axios = require('axios')
const path = require('path')
const crypto = require('crypto');
const { exec } = require('child_process');
const iconv = require('iconv-lite');
const { setTimeout } = require('timers/promises');
const HttpsProxyAgent = require("https-proxy-agent");
// 请根据自身需求修改代理设置
const httpsAgent = new HttpsProxyAgent(`http://127.0.0.1:10809`);
const axios = Axios.create({
    proxy: false,
    httpsAgent
})

console.log("【给资源文件添加用于校验子资源完整性的md5值】");
console.log("开始获取资源文件并计算md5值，请耐心等待...\n");

// 读取挂机助手并按行分割
const BLTH_path = '../../../B站直播间挂机助手.js';
const fileName = path.resolve(__dirname, BLTH_path);
const BLTH_content = fs.readFileSync(fileName, 'utf8');
const rawMetaData = BLTH_content.match(/\/\/\s*\=\=UserScript\=\=[\s\S]*?\/\/\s*\=\=\/UserScript\=\=/)[0];
const splitIntoLines = rawMetaData.split(/\r?\n/);
// 元数据
const metaData = [];
// 请求用 headers，如果不加会被 cdn 重定向到 github
const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'cache-control': 'no-cache',
    'dnt': '1',
    'pragma': 'no-cache',
    'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/536.34 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/536.39'
};
// 获取 metaData
getMetaData();
// 主函数
(async function main() {
    for (let i = 0; i < metaData.length; i++) {
        const obj = metaData[i]
        const list = ['require', 'resource']
        if (list.includes(obj.key)) {
            const reqParams = {
                method: 'GET',
                url: getURL(obj.value),
                headers: headers,
                timeout: 5000,
            }
            const data = await reqFile(reqParams);
            if (data !== 'FAILED')
                metaData[i].newValue = getURL(metaData[i].value).concat('#md5=', getMd5(data));
            else
                metaData[i].newValue = getURL(metaData[i].value);
        }
    }
    let newRawMetaData = rawMetaData;
    for (const i of metaData) {
        const list = ['require', 'resource']
        if (list.includes(i.key)) {
            newRawMetaData = newRawMetaData.replace(i.value, i.newValue)
        }
    }
    exec('clip').stdin.end(iconv.encode(newRawMetaData, 'gbk'));
    console.log(newRawMetaData)
    console.log("\n处理完成 (已复制到剪切板)");
})();

/**
 * 请求网络文件
 * @param {*} requestParams  
 */
async function reqFile(requestParams, retry = 3) {
    return await axios(requestParams).then(res => {
        return res.data;
    }).catch(async err => {
        console.error('请求资源时出错，将再次获取', err.code, requestParams.url)
        // console.error('axios error', err)
        if (retry === 0) return 'FAILED';
        retry--;
        return await setTimeout(1000, reqFile(requestParams, retry));
        //return reqFile(requestParams, retry);
    })
}

/**
 * 计算Md5值
 * @param {*} data 
 * @returns 
 */
function getMd5(data) {
    const md5 = crypto.createHash('md5');
    md5.update(data);

    return md5.digest('hex');
}
/**
 * 获取 url
 * @param {String} url 
 * @returns 
 */
function getURL(url) {
    return url.split('#')[0]
}
/**
 * 获取 metaData
 * [{ key: ..., value: ...}, { key: ..., value: ...}, ...]
 */
function getMetaData() {
    for (let i = 1; i < splitIntoLines.length - 1; i++) {
        const line = splitIntoLines[i]
        const matchResult = line.match(/\/\/\s*@(\S+)\s+(.*)/)
        const [key, value] = [matchResult[1], matchResult[2]]
        let obj = { key: key, value: null }
        if (key === 'resource') {
            const realValue = value.split(/\s+/)[1]
            obj.value = realValue
        } else {
            obj.value = value
        }
        metaData.push(obj)
    }
}

/*
本地文件的处理方法
const splitSlash = getURL(obj.value).split('/');
const fileName = splitSlash[splitSlash.length - 1];
const splitDot = fileName.split('.');
const fileType = splitDot[splitDot.length - 1];
const filePath = path.resolve(__dirname, `../../${fileType === 'js' ? `${fileType}/library` : fileType}/${fileName}`);
console.log(filePath)
const data = fs.readFileSync(filePath, 'utf8');
obj.newValue = getURL(obj.value).concat('#md5=', getMd5(data));
*/
