var webpack = require('webpack');
var path = require('path');
// var argv = require('yargs').argv; //获取webpack命令中的自定义参数

console.log('....................生产模式，用于正式环境......................');

// var commonsChunk = new webpack.optimize.CommonsChunkPlugin('commons','commons.v2.0.[hash].js');  // 生成common.js公共代码文件
var commonsChunk = new webpack.optimize.CommonsChunkPlugin('commons','commons.v2.0.7f55cec0e4e5d7eab078.js');
var uglifyJs = new webpack.optimize.UglifyJsPlugin({  // 压缩js代码
    compress: {
        warnings: false,
        drop_: true,
        drop_console: true
    },
    mangle: {
        except: ['$super', '$', 'exports', 'require']
    }
});
var definePlugin = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify('production')  // development:用于开发环境
    }
});
var occurrenceOrder = new webpack.optimize.OccurrenceOrderPlugin();

var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var lodashModuleReplacement = new LodashModuleReplacementPlugin();

var config = {
    // context: path.join(__dirname, "clife_admin"),
    name: 'browser',
    entry: {  // 文件入口
        app: './school/src/app',
        commons: ['react','react-dom', 'reflux','react-router','reqwest','qs','crypto-js','moment','react-datepicker'],
    },
    output: {  // 输出文件
        path: path.join(__dirname, '/school/production/build'),  // clife统计运营管理平台
        // filename: '[name].v2.0.[hash].js', // clife统计运营管理平台
        // chunkFilename: 'chunk.[id].v2.0.[hash].js',  // clife统计运营管理平台
        filename: '[name].v2.0.7f55cec0e4e5d7eab078.js', // clife统计运营管理平台
        chunkFilename: 'chunk.[id].v2.0.7f55cec0e4e5d7eab078.js',  // clife统计运营管理平台
        publicPath: './build/',  // clife统计运营管理平台
    },
    module: {  // 资源加载器       
        loaders: [  
            { test: /\.css$/, loader: 'style!css!autoprefixer'},
            { test: /\.less$/, loader: 'style!css!less?strictMath&noIeCompat'},
            { test: /\.scss$/, loader: 'style!css!scss'},
            { 
                test: /\.(js|jsx|es6)$/, 
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                // query: {
                //   'presets': ['es2015','es2016','es2017','react','stage-0','stage-1','stage-2','stage-3'],
                //   'plugins': ['react-hot-loader/babel','transform-object-assign','transform-es5-property-mutators','transform-es3-property-literals','transform-es3-member-expression-literals','transform-jscript','transform-merge-sibling-variables','transform-minify-booleans','transform-simplify-comparison-operators','transform-undefined-to-void','transform-object-set-prototype-of-to-assign','transform-proto-to-assign','transform-regenerator','transform-strict-mode','transform-runtime','lodash']
                // }
            },
            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url?limit=8192'},
            { test: /\.(woff|ttf)$/, loader: 'url'},
            { test: /\.(wav|mp3)$/, loader: 'url'},
            { test: /\.(mpeg|mp4|webm|ogv)$/, loader: 'url'},
            { test: /\.html$/, loader: 'html'},
            { test: /\.(md|markdown)$/, loader: 'html!markdown?gfm=false'},
            {
              // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
              test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
              loader: 'url?name=./static/font/[name].[ext]'
            }
        ]
    },    
    resolve: {  // 省略文件扩展名
        extensions: ['', '.js', '.jsx', '.es6', '.json', '.css', '.less', '.scss', '.html', '.md', '.markdown', 'coffee'],
        alias: {}
    },
    plugins: [
        commonsChunk,
        uglifyJs,
        definePlugin,
        lodashModuleReplacement,
        occurrenceOrder
    ],  // 需要运行的插件
    // resolveLoader: {
    //     modulesDirectories: ["web_loaders", "web_modules", "node_loaders", "node_modules"],
    //     extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
    //     packageMains: ["webpackLoader", "webLoader", "loader", "main"]
    // },
    // externals: {  // 兼容外部第三方库
    //     // require('jquery') and require('react') is external and available
    //     //  on the global var jQuery and React
    //     // 'jquery': 'jquery'
    // },
    // target: 'node',
    // bail: '',
    // profile: '',
    // cache: false,
    // debug: true,
    // watch: '',
    // devtool: '',
    // devServer: '',
    // node: {
    //     console: false,
    //     global: true,
    //     process: true,
    //     Buffer: true,
    //     __filename: "mock",
    //     __dirname: "mock",
    //     setImmediate: true
    // },
    // amd: { jQuery: true },
    // loader: '',
    // recordsPath: '',
    // recordsInputPath: '',
    // recordsOutputPath: ''
};

module.exports = config;