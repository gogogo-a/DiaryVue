/**
 * 主题颜色的JavaScript配置
 * 用于在JS中访问主题颜色，特别是用于页面配置
 */

// 主题类型定义
export const THEMES = {
  DEFAULT: {
    name: 'default',
    primaryColor: '#ebf0f6', // 对应CSS变量 --primary-color
    primaryButtonBackground: '#52a8dc', // 对应CSS变量 --primary-button-background
    primaryButtonText: '#ffffff', // 对应CSS变量 --primary-button-text
    primaryPitchOn: '#dfe9f3', // 对应CSS变量 --primary-pitch-on
    textColor: '#333333', // 对应CSS变量 --text-color
    backgroundColor: '#f5f7fa', // 对应CSS变量 --background-color
    navigationBarTextStyle: 'black' // 导航栏文字颜色
  },
  REMEMBER: {
    name: 'remember',
    primaryColor: '#e2b14a', // 对应CSS变量 --primary-color
    primaryButtonBackground: '#c49a3f', // 对应CSS变量 --primary-dark
    primaryButtonText: '#ffffff', // 白色文字
    primaryPitchOn: '#f0c970', // 对应CSS变量 --primary-light
    textColor: '#4a3c2d', // 对应CSS变量 --text-color
    backgroundColor: '#faf5ea', // 对应CSS变量 --background-color
    navigationBarTextStyle: 'white' // 导航栏文字颜色
  }
}

export default THEMES 