module.exports = {
    resolve: {
        root: __dirname
    },


    entry: {
        app: "./js/app.js"
    },


    output: {
        path: "./sqs_template/scripts/",
        filename: "app.js"
    },


    module: {
        loaders: [
            {
                test: /js\/.*\.js$/,
                exclude: /node_modules|jquery/,
                loaders: ["babel-loader"]
            }
        ]
    }
};