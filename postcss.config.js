export default  {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 37.5, // 假设设计稿宽度为375px，1rem = 37.5px
        propList: ['*'], // 可以指定转换的 CSS 属性，'*' 表示对所有属性生效
        selectorBlackList: ['chart'], // 指定不转换的类名
        replace: true, // 替换包含REM的规则，而不是添加回退
        mediaQuery: false, // 允许在媒体查询中转换px
        minPixelValue: 2 // 设置要替换的最小像素值 (3 = 3px)
      }
    }
  };
  