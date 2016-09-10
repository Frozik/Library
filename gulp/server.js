const path = require('path');
const fs = require('fs');

const gulp = require('gulp');
const gulpWebpack = require('gulp-webpack');

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (settings) {
    const taskName = 'build-server';

    const plugins = [];
    settings.minimize && plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: settings.sourceMap
    }));
    plugins.push(new CopyWebpackPlugin([
        { from: './server/views', to: path.resolve(__dirname, 'wwwroot/views') },
    ]));

    const nodeModules = {};
    
    fs.readdirSync('node_modules').
        filter(name => ['.bin'].indexOf(name) === -1).
        forEach(mod => nodeModules[mod] = `commonjs ${mod}`);

    gulp.task(taskName, () => gulp.src('./server/application.ts').
        pipe(gulpWebpack({
            output: {
                filename: './server.js',
                libraryTarget: "commonjs2"
            },

            externals: nodeModules,

            resolve: {
                extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.jss', '.json'],
                modules: [
                    path.resolve(__dirname, 'server')
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
                        include: /\.json$/,
                        loaders: ['json-loader']
                    }
                ]
            },

            devtool: settings.sourceMap && 'source-map',

            plugins,

            node: {
                fs: "empty",
                net: "empty"
            },

            target: 'node'
        })).
        pipe(gulp.dest('./wwwroot'))
    );

    return taskName;
}

