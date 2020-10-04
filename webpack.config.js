const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    module: {
      rules: [
        {
            enforce: 'pre',
            test: /\.js$/,
            use: "source-map-loader"
        },
        {
            enforce: 'pre',
            test: /\.ts?$/,
            use: "source-map-loader"
        },
        {
            // For our normal typescript
            test: /\.ts?$/,
            use: [
                {
                    loader: 'awesome-typescript-loader',
                    options: {
                        configFileName: 'tsconfig.json'
                    }
                }
            ],
            exclude: /(?:node_modules)/,
        },
      ]
    },
    resolve: {
      modules: [
        'src',
        'node_modules'
      ],
      extensions: [
          '.js',
          '.ts'
      ]
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: "dist/"
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {from: './src/index.html', to: path.resolve(__dirname, 'dist')}
        ]
      }),
      new CopyPlugin({
        patterns: [
          {from: './src/pyodide.js', to: path.resolve(__dirname, 'dist')}
        ]
      })
    ]
  };