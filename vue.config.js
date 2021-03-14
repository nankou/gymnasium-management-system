const settings = require("./src/settings");
const resolve = dir => require("path").join(__dirname, dir);
const Analyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const isOpenAnalyzer = false;
module.exports = {
  publicPath: settings.isHistory ? "/" : "./",
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack: config => {
    const plugins = [];
    if (isOpenAnalyzer && process.env.NODE_ENV === "development")
      plugins.push(new Analyzer({analyzerPort: 9999}));
    config.plugins = [...config.plugins, ...plugins];
    config.name = settings.title;
  },
  chainWebpack: config => {
    config.resolve.symlinks(true);
    config.resolve.alias.set("@", resolve("src"));
    // 图标
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({symbolId: "icon-[name]"})
      .end();
    // 预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // 分模块打包
    config
      .when(process.env.NODE_ENV === 'production',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial'
              },
              tinymce: {
                name: 'chunk-tinymce',
                priority: 15,
                test: /[\\/]node_modules[\\/]_?tinymce(.*)/
              },
              elementUI: {
                name: 'chunk-elementUI',
                priority: 20,
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'),
                minChunks: 3,
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/styles/index.scss";'
      }
    }
  },
  devServer: {
    open: false,
    port: 8088,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        // target: "http://localhost:8002",
        target: "http://180.76.164.146:8080",
        // target: "http://192.168.1.100:8089",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
