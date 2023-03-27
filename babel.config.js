module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
//    ['transform-remove-console'],
    [
      'module-resolver',
      {
        alias: {
          '~': './src',
          '@components': './src/components',
          '@screens': './src/screens'
        },
      },
    ],
//    'react-native-reanimated/plugin',
  ],
}
