let path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, "public"),
        port: 8080,
        compress: false,
        publicPath: '/dist/'
    }
}