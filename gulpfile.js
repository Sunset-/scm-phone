var gulp = require('gulp'),
	webpack = require('gulp-webpack'),
	sftp = require('gulp-sftp'),
	replace = require('gulp-replace'),
	zip = require('gulp-zip'),
	path = require('path'),
	moment = require('moment'),
	gulpSequence = require('gulp-sequence'),
	gulpSSH = require('gulp-ssh'),
	config = require('./publishConfig.json');

var publishFileName;

gulp.task('build', function () {
	return gulp.src('src/main.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('build/'));
});

gulp.task('version', ['build'], function () {
	var now = new Date().getTime();
	gulp.src(['build/verification.html'])
		.pipe(replace(/build\.js\?v=\d+/g, 'build.js?v=' + now))
		.pipe(replace(/sunset-wechat\.js\?v=\d+/g, 'sunset-wechat.js?v=' + now))
		.pipe(gulp.dest('build'));
});
gulp.task('zip', function () {
	return gulp.src('build/**/*.*')
		.pipe(zip(publishFileName = ('build-' + moment().format("YYYYMMDD-HHmm") + '.zip')))
		.pipe(gulp.dest('publish'));
});
//上传到远程服务器任务
gulp.task('upload', function () {
	return gulp.src(path.resolve(__dirname, config.buildDir) + '/' + publishFileName)
		.pipe(sftp({
			host: config.sftp.host,
			port: config.sftp.port,
			user: config.sftp.user,
			key: config.sftp.key,
			pass: config.sftp.pass,
			remotePath: config.sftp.remotePath
		}));
});
//解压服务器文件
gulp.task('unzip', ['upload'], function () {
	var SSH = new gulpSSH({
		ignoreErrors: false,
		sshConfig: {
			host: config.sftp.host,
			port: config.sftp.port,
			username: config.sftp.user,
			password: config.sftp.pass
		}
	});
	SSH.shell(['cd ' + config.sftp.remotePath, 'unzip -o ' + publishFileName, 'rm -rf ' + publishFileName,'\\cp -f verification.html ../jameka-phone/verification.html'], {
			filePath: 'shell.log'
		})
		.pipe(gulp.dest('logs'));
});

gulp.task('publish', function (cb) {
	gulpSequence('version', 'zip', 'unzip', cb);
})