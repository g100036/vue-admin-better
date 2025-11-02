/**
 * @description Vue Admin Better 项目配置
 */

const webpackBarName = 'vue-admin-better'
const webpackBanner = (time) => 
`vue-admin-better
GitHub: www.baidu.com
Gitee: https://gitee.com/chu1204505056/vue-admin-better

版权所有 (c) 2025 vue-admin-better
本项目使用 MIT 许可证
构建时间: ${time}`

/**
 * @description 在控制台打印项目信息
 */
function donationConsole() {}

module.exports = {
  webpackBarName,
  webpackBanner,
  donationConsole,
}