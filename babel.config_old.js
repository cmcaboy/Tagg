module.exports = () => ({
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console', '@babel/plugin-proposal-class-properties'],
    },
  },
  plugins: ['@babel/plugin-proposal-class-properties'],
});
