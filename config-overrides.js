const {
  override,
  addWebpackPlugin,
  addBundleVisualizer,
  addWebpackAlias,
  fixBabelImports,
  addLessLoader,
} = require('customize-cra');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

process.env.GENERATE_SOURCEMAP = 'false';

module.exports = override(
  // eslint-disable-next-line
  process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
  addWebpackPlugin(new BundleAnalyzerPlugin()),
  addWebpackAlias({
    // eslint-disable-next-line no-useless-computed-key
    ['@']: path.resolve(__dirname, 'src'),
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    sourceMap: false,
  })
);
