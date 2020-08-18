// ref: https://umijs.org/config/
import routes from './router.config'
import theme from './theme'
import path from 'path'

const isDEV = process.env.NODE_ENV === 'development'

const plugins = [
  // ref: https://umijs.org/plugin/umi-plugin-react.html
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        immer: true,
        hmr: true
      },
      dynamicImport: true,
      dll: false,
      hardSource: false,
      chunks: ['react', 'antd', 'umi']
    }
  ]
]

// const proxyTarget = 'http://192.168.8.108:8019' // xqw
// const proxyTarget = 'http://192.168.8.109:8018' // deping
const proxyTarget = 'http://161.189.190.171:8018'
// const proxyTarget = 'http://192.168.8.103:8018' // yr

const config = {
  plugins,
  // history: 'hash',
  hash: true,
  targets: {
    ie: 11
  },
  devtool: isDEV ? 'eval-cheap-module-source-map' : false,
  // 路由配置
  routes,
  // Theme for antd
  theme,
  treeShaking: true,
  mock: {
    exclude: ['mock/**/_*.js', 'mock/_*/**/*.js'],
  },
  alias: {
    '@': path.resolve(__dirname, '../src'),
    'api': path.resolve(__dirname, '../src/services'),
    'table': path.resolve(__dirname, '../src/components/Table'),
    'img': path.resolve(__dirname, '../src/assets/image'),
    'mon': path.resolve(__dirname, '../src/assets/monitor'),
  },
  proxy: {
    '/v1': {
      target: proxyTarget,
      pathRewrite: { '^/v1': '/' },
    },
  },
  uglifyJSOptions(opts) {
    opts.uglifyOptions.compress['drop_console'] = true
    return opts
  },
  chainWebpack(config) {
    // config.module
    //   .rule('eslint')
    //   .use('eslint-loader')
    //   .options({
    //     eslintPath: require.resolve('eslint')
    //   })

    config.module
      .rule('varloader')
      .test(/\.less$/)
      .use('style-resources-loader')
      .loader('style-resources-loader')
      .options({
        patterns: path.resolve(__dirname, '../src/variable.less'),
        injector: 'append'
      })

    // antd moment -> dayjs
    config.plugin('moment2dayjs').use('antd-dayjs-webpack-plugin')

    // optimize chunks
    config.output.chunkFilename('[name].[contenthash:8].chunk.js')
    config.optimization.runtimeChunk(false).splitChunks({
      chunks: 'all',
      minSize: 30000,
      maxInitialRequests: Infinity,
      automaticNameDelimiter: '.',
      cacheGroups: {
        antd: {
          name: 'antd',
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          priority: 10
        },
        react: {
          name: 'react',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          priority: 10
        },
        // 异步加载、2个以上的chunk使用
        vendors: {
          chunks: 'async',
          name: 'vendors',
          minChunks: 2,
          test: /[\\/]node_modules[\\/](?!xlsx)/,
          priority: -10
        }
      }
    })
  }
}

export default config
