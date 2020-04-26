//>30 базовая настройка
//>40 настройка двух точек входв и имени по хешу
//>50 установка плагина html и clean-webpack-plugin настройка script в pachage.json
//>60 context для того чтобы не пропис полный путь и подкл css loader
//>1.10 import json and image
//>1.40 - process.env.NODE_ENV
// const path = require('path');
// const html = require('html-webpack-plugin');
// const css = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); 
const smp = new SpeedMeasurePlugin();
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const path = require('path');
const html = require('html-webpack-plugin');
const css = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;
console.log("isProd ="+ isProd)

const optimization = () => {
  const config = {
    splitChunks:{
      chunks:"all"
    }
  }
  if(isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  }
  return config
}

module.exports = {
    entry: "./src/script.js", 
    output: {
      path: __dirname + '@dist', 
      filename: 'bundle.js', 
      //publicPath:'/dist'
    },
    resolve: {
      extensions: ['.wasm', '.csv', '.js', '.json'],
      alias:{
        '@dist':path.resolve(__dirname,"/dist")
      }
    },
    optimization:optimization(),
    mode:"production",
    module:{
      rules:[
        { 
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: css.loader,
              options: {
                hmr:isDev,
                reloadAll:true
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader',
         ],
       },
       {
        test: /\.xml$/,
        use: [
          'xml-loader',
        ],
      },
      {
        test: /\.csv$/,
        use: [
          'csv-loader',
        ],
      },
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 9000,
      overlay:true
    },
    plugins:[
      new html({
        template:"./src/index.html",
        filename:'test.html',
        minify:{
          collapseWhitespace:isProd,
        }
      }),
      new css({
        filename: "[name].putin.css"
      }),
      new CopyPlugin([
        { from: './src/testCopy', to: '@dist' },
      ]),
    ],
}