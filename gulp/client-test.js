const path = require('path');

const gulp = require('gulp');
const Server = require('karma').Server;

const taskName = 'test-client';

gulp.task(taskName, done => new Server(
    {
        configFile: path.join(__dirname, '/karma.client.conf.js'),
        singleRun: true
    },
    done).start()
);

module.exports = taskName;

