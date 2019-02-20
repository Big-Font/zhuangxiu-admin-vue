/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
// const baseUrl = 'https://qingruiserver.wangshen.top'
let baseUrl;
let routerMode = ''
let baseImgPath = ''

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://127.0.0.1:5000/admin';
    // baseUrl = 'https://qingruiserver.wangshen.top/admin';
    baseImgPath = '';
} else {
    baseUrl = 'https://qingruiserver.wangshen.top/admin';
    baseImgPath = '';
}

export {
  baseUrl,
  routerMode,
  baseImgPath
}
