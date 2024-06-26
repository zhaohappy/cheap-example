const path = require('path');
const CheapPlugin = require('./src/cheap/build/webpack/plugin/CheapPlugin');

module.exports = (env) => {
  const config = {
    stats: {
      assets: false,
      builtAt: true,
      source: false,
      chunks: false,
      timings: false,
      errors: true,
      warnings: true,
      children: true
    },
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: /node_modules|output/
    },
    resolve: {
      extensions: ['.js', '.ts', '.json'],
      modules: [
        'node_modules'
      ],
      alias: {
        cheap: path.resolve(__dirname, 'src/cheap/'),
        common: path.resolve(__dirname, 'src/common/')
      }
    },
    externals: {
      typescript: 'typescript',
      os: 'os',
      fs: 'fs'
    },
    devtool: +env.release ? false : 'source-map',
    mode: +env.release ? 'production' : 'development',
    optimization: {
      sideEffects: true,
      usedExports: true
    },
    target: env.node ? 'node' : 'web',
    entry: {
      'producer-consumer': './src/producer-consumer/main.ts',
      'js-wasm-interoperate': './src/js-wasm-interoperate/main.ts',
      'asm-simd': './src/asm-simd/main.ts'
    },
    output: {
      filename: env.node ? '[name]_node.js' : '[name].js',
      path: path.resolve(__dirname, './dist'),
      libraryTarget: env.node ? 'commonjs2' : 'umd'
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, './tsconfig.json')
              }
            }
          ]
        },
        {
          test: /\.wasm$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new CheapPlugin({
        env: env.node ? 'node' : 'web',
        projectPath: __dirname,
        exclude: /__test__/
      })
    ]
  };
  return config;
};
