const gulp = require('gulp');
const gulpServer = require('gulp-express');
const runSequence = require('run-sequence');

const configuration = require('./gulp/configuration');
const client = require('./gulp/client');
const testClient = require('./gulp/client-test');
const server = require('./gulp/server');
const testServer = require('./gulp/server-test');

const buildClient = client(configuration);
const buildServer = server(configuration);

gulp.task('build', () => gulp.start(buildClient, buildServer));
gulp.task('test', () => runSequence(testClient, testServer));

gulp.task('run-server', () => {
    // Start the server at the beginning of the task 
    gulpServer.run(['./wwwroot/server.js']);
 
    // Restart the server when file changes 
    gulp.watch(['./wwwroot/public/**/*'], gulpServer.notify);
    gulp.watch(['./wwwroot/server.js'], gulpServer.notify);
});
