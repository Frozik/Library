const path = require('path');

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        
        files: [
            './../client/**/*.spec.ts?',
        ],

        frameworks: ['mocha', 'chai'],

        reporters: ['spec'],

        preprocessors: {
            './../client/**/*': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'eval-source-map',
            debug: true,
            module: {
                loaders: [
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        loader: 'style-loader!css-loader?camelCase&sourceMap&modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:3]!postcss-loader'
                    },
                    {
                        include: /\.json$/,
                        loaders: [ 'json-loader' ]
                    },
                ]
            },
            resolve: {
                extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.jss', '.json'],
                modules: [
                    path.resolve(__dirname, './../client'),
                    'node_modules'
                ]
            },
        },

        webpackMiddleware: {
            noInfo: true,
        }
  });
};
