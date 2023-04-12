import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
// 密钥对生成 http://web.chacuo.net/netrsakeypair
// 公钥
const publicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJK6Ew+mHIOWPjgz473Coy7wUGnPTLOR
tGJu2+Rxwkybc2ff3y26gjCaxZqO+yBLH/2rpJ9/WFd5tAQioCxEbUcCAwEAAQ==`

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}


