const path = require('path');
const CheapPlugin = require('@libmedia/cheap/build/webpack/CheapPlugin');

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
      ]
    },
    devtool: +env.release ? false : 'source-map',
    mode: +env.release ? 'production' : 'development',
    optimization: {
      sideEffects: true,
      usedExports: true
    },
    target: 'web',
    entry: {
      'producer-consumer': './src/producer-consumer/main.ts',
      'js-wasm-interoperate': './src/js-wasm-interoperate/main.ts',
      'asm-simd': './src/asm-simd/main.ts'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './dist'),
      libraryTarget: 'umd'
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
        env: 'browser',
        projectPath: __dirname,
        exclude: /__test__/
      })
    ]
  };
  return config;
};
