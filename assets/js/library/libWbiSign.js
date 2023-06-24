// https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/sign/wbi.md
const mixinKeyEncTab = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52
]

// 对 imgKey 和 subKey 进行字符顺序打乱编码
function getMixinKey(orig) {
  let temp = ''
  mixinKeyEncTab.forEach((n) => {
    temp += orig[n]
  })
  return temp.slice(0, 32)
}

// 为请求参数进行 wbi 签名
function encWbi(params, img_key, sub_key) {
  const mixin_key = getMixinKey(img_key + sub_key),
    curr_time = Math.round(Date.now() / 1000),
    chr_filter = /[!'\(\)*]/g
  let query = []
  params = Object.assign(params, {wts: curr_time})    // 添加 wts 字段
  // 按照 key 重排参数
  Object.keys(params).sort().forEach((key) => {
    query.push(
      encodeURIComponent(key) +
      '=' +
      // 过滤 value 中的 "!'()*" 字符
      encodeURIComponent(('' + params[key]).replace(chr_filter, ''))
    )
  })
  query = query.join('&')
  const wbi_sign = CryptoJS.MD5(query + mixin_key).toString() // 计算 w_rid
  return query + '&w_rid=' + wbi_sign
}
