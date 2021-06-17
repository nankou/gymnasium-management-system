module.exports = {
  /**
   * @description 网站设置
   * */
  // 网站标题
  title: "GMS-ADMIN",
  // 菜单标题
  menuTitle: "GMS - 后台管理",
  // 底部文字
  footerTxt: "© 2020 Wang YePeng GMS.All rights reserved",
  // 备案号
  caseNumber: "粤ICP备23001351号",

  /**
   * @description 系统设置
   * */
  // store's key前缀
  prefix: "ADMIN",
  // 是否开启验证码
  hasCode: true,
  // 记住密码时token的存储时间(天)
  tokenCookieExpires: 7,
  // 请求超时时间(s)
  timeout: 60 * 1000,
  // 是否启用history
  isHistory: false,
  // 分页条数设置
  pagingSize: 10,
  // 上传图片大小限制(MB)
  imageLimit: 2,
  // 上传文档大小限制(MB)
  documentLimit: 10,
  // 上传音频大小限制(MB)
  audioLimit: 10,
  // 上传视频大小限制(MB)
  videoLimit: 40,

  /**
   * @description 样式设置
   * */
  // 是否固定头部
  isFixHeader: true,
  // 是否显示logo
  isShowLogo: true,
  // 是否显示标签
  isShowTag: true,
  // 是否显示面包屑
  isShowBreadcrumb: true,
  // 是否显示设置的底部信息
  isShowFooter: true,
  // 菜单是否夜晚模式
  isNight: true,
  // 菜单是否垂直
  isVertical: true,
  // 是否只保持一个子菜单的展开
  isUniqueOpened: true,
  // 组件大小设置
  layoutSize: "small"
};
