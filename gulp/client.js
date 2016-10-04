const path = require('path');

const gulp = require('gulp');
const gulpWebpack = require('gulp-webpack');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (settings) {
    const taskName = 'build-client';

    const plugins = [];
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: './js/vendor.bundle.js'
    }));
    settings.minimize && plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: settings.sourceMap
    }));
    plugins.push(new ExtractTextPlugin('./css/bundle.css', { allChunks: true }));
    plugins.push(new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(settings.environment) }
    }));
    plugins.push(new CopyWebpackPlugin([
        {
            context: path.resolve(__dirname, './../node_modules/react-mdl/extra'),
            from: '*.min.css*',
            to: path.resolve(__dirname, '../css')
        },
        {
            context: path.resolve(__dirname, './../node_modules/react-mdl/extra'),
            from: '*.min.js*',
            to: path.resolve(__dirname, '../js')
        },
        {
            context: path.resolve(__dirname, './../node_modules/katex/dist'),
            from: '*.min.css',
            to: path.resolve(__dirname, '../css')
        },
        {
            context: path.resolve(__dirname, './../node_modules/katex/dist'),
            from: 'fonts',
            to: path.resolve(__dirname, '../css/fonts')
        },
    ]));

    gulp.task(taskName, () => gulp.src('./client/application.ts').
        pipe(gulpWebpack({
            debug: settings.debug,

            entry: {
                bundle: './client/application.ts',
                vendor: [
                    'lodash',
                    'classnames',
                    'keymirror',
                    'normalizr',
                    'i18next',
                    'redux', 'redux-thunk',
                    'react', 'react-dom', 'react-router', 'react-redux', 'react-addons-update', 'react-mdl',
                    'draft-js',
                    'katex'
                ]
            },

            output: {
                filename: './js/bundle.js'
            },

            resolve: {
                extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.jss', '.json'],
                modules: [
                    path.resolve(__dirname, './../client'),
                    'node_modules'
                ]
            },

            module: {
                loaders: [
                    {
                        test: /\.tsx?$/,
                        loaders: ['ts-loader'].concat(settings.checkSyntax ? ['tslint-loader'] : []),
                        exclude: /node_modules/
                    },
                    {
                        test: /\.*css$/,
                        exclude: /node_modules/,
                        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?camelCase&sourceMap&modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:3]!postcss-loader')
                    },
                    {
                        include: /\.json$/,
                        loaders: [ 'json-loader' ]
                    }
                ]
            },

            devtool: settings.sourceMap && 'source-map',

            plugins,

            postcss: () => [require('autoprefixer'), require('precss')],
        })).
        pipe(gulp.dest('./wwwroot/public'))
    );

    return taskName;
}

