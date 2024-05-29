const path = require('path');

module.exports = {
    mode: 'production',
    // import the main files for each component as entry points
    entry: {
        'http-hello-world':'./components/http-hello-world/src/index.ts',
        calc:'./components/calc/src/index.ts',
    },
    // mark the component modules as externals as they will be provided by other components at runtime
    externals: {
        "wasi:http/types@0.2.0": 'wasi:http/types@0.2.0',
        "wasmcloud:hello/calculator": 'wasmcloud:hello/calculator',
        "wasi:logging/logging":'wasi:logging/logging',
    },
    // mark the output as a module as wasi expects to use esmodule syntax
    externalsType: 'module',
    experiments: {outputModule: true},

    // run the files through the typescript and babel loaders
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ],
    },
    optimization: {
        minimize: false,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        // output each component to it's own file
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // make sure the output is compatible as an esmodule
        library: { type: 'module' },
    },
};
