const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const fileVersion = new Date().getTime()
const isDev = process.env.NODE_ENV === 'development'

const devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: { // dev时设置index.html路径，否则history模式下刷新页面路由会请求后段路由
      index: '/index.html'
    },
    // proxy: {
    //   '/api': 'http://127.0.0.1:3000'
    // },
    hot: true
}

let config = {
    entry: {
        monitorjs: ['./src/index.js']
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'), // 打包后的文件存放的地方
        // filename: '[name].js', // 打包后输出文件的文件名
        filename: '[name].min.js', //打包后输出文件的文件名
        publicPath: "",
        chunkFilename: "[name].min.js",
        library: "monitorjs",  //类库名称
        libraryTarget: "umd",  //指定输出格式
        umdNamedDefine: true //会对UMD的构建过程中的AMD模块进行命名，否则就使用匿名的define
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            },
            fileVersion:fileVersion //文件版本
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./test/index.html")
        })
    ]
}

if (isDev) {
    config.devServer = devServer
}

module.exports = config