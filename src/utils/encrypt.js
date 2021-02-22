import JSEncrypt from 'jsencrypt/bin/jsencrypt'

/**
 * @description 密钥对生成 http://web.chacuo.net/netrsakeypair
 * */
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbXFTjZyK7aoYso4FiCuw7AepLL2jja1HEpskjLU7TsqE4xg0KcsQwg5mrmiuwJ569SuIr7qUEpDEkO1Ykvr9NdnwfFHu1vfzQjyOCBUtT3gmXytL6Xg2uA7Hz24I599W8F5bnLvpahzNKM0Efb+egcZZk3Jf+tn/kgMG+J+rG6wIDAQAB';

/**
 * @description 加密
 * */
export const encrypt = txt => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
};
