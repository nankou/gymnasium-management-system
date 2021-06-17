import JSEncrypt from 'jsencrypt/bin/jsencrypt'

/**
 * @description 密钥对生成 http://web.chacuo.net/netrsakeypair
 * */
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHKL92NL39fsXMT8x4wJlvQ33R0EFNRgYBSGIfnyz1G4cNhCpQK2aE+72HnntsVtdEn0NGFdBwAMcwvb/OEtt492KctqZBrLAPU2p+4i3vQU2CYIZd7XgjHpe4jMZdJ9PQF2XWgxIk367mbhEAf/DUS7Q3t0SBX0Hstuuztt8c6wIDAQAB';

/**
 * @description 加密
 * */
export const encrypt = txt => {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
};
