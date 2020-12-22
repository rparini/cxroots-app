const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: './src/index.tsx',
    target: "web",
    mode: "development",  
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    module: {
      rules: [
        {
            enforce: 'pre',
            test: /\.(js|ts)$/,
            use: "source-map-loader"
        },
        {
          test: /\.css$/,
          loader: "css-loader",
        },  
        {
            // For our normal typescript
            test: /\.(ts|tsx)$/,
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
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: "dist/"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
      // new MiniCssExtractPlugin({
      //   filename: "./src/yourfile.css",
      // }),
      // new CopyPlugin({
      //   patterns: [
      //     {from: './public/index.html', to: path.resolve(__dirname, 'dist')}
      //   ]
      // }),
      new CopyPlugin({
        patterns: [
          {from: './src/pyodide.js', to: path.resolve(__dirname, 'dist')}
        ]
      })
    ]
  };