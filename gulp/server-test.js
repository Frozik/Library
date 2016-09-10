const gulp = require('gulp');
const gulpMocha = require('gulp-mocha');
const gulpExit = require('gulp-exit');

const taskName = 'test-server';

gulp.task(taskName, () => gulp.src('./server/**/*.spec.ts', {read: false}).
        pipe(gulpMocha({
            compilers: {
                ts: 'ts-node/register',
                tsx: 'ts-node/register',
            }
        })).
        pipe(gulpExit())
);

module.exports = taskName;
