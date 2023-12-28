import path, { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== 'production';

console.log('isDevelopment', isDevelopment);

const config = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: 'eval-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    // port: 8111,
  },
  entry: {
    index: join(__dirname, 'src', 'index.js'),
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
    publicPath: '/',
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      name: 'index.html',
      template: join(__dirname, '.', 'public', 'index.html'),
      chunks: ['index'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    isDevelopment ? undefined : new CleanWebpackPlugin(),
  ].filter(Boolean),
};

export default config;