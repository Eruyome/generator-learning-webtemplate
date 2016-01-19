'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');
var gzip = require('gulp-gzip');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var nconf = require('nconf');

nconf.env().argv();
nconf.file('config.json');
var shouldBeGzipped = nconf.get('Gzip');
var addAnalytics = nconf.get('Analytics:include');
var fileExtension = nconf.get('fileExt');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
    return gulp.src('app/styles/scss/application.scss')
		.pipe($.compass({
			errLogToConsole: true, 
			includePaths : ['./bower_components/stipe', './styles', './bower_components/normalize-scss', './bower_components/sass-css-importer'],
			config_file: './config.rb',
			css: 'app/styles/css',
			sass: 'app/styles/scss',
			require: [
			'compass/import-once/activate',
			'normalize-scss',
			'sass-css-importer',
			'stipe'
			],
			bundle_exec: true
		}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles/css'))
        //.pipe(reload({stream:true}))
        .pipe($.size())
        .pipe($.notify("Compilation complete."));
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/**/*.css');
	var extFilter = $.filter('**/**/*'+fileExtension);

    return gulp.src('app/*'+fileExtension)
        .pipe($.useref.assets())
        .pipe(jsFilter)
        .pipe($.uglify())
		.pipe(gulpif(shouldBeGzipped, $.gzip()))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
		.pipe(gulpif(shouldBeGzipped, $.gzip()))
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
		.pipe(extFilter)
		.pipe(gulpif(addAnalytics, $.inject(gulp.src(['app/templates/analytics.html']), {
			starttag: '<!-- inject:analytics -->',
			transform: function (filePath, file) {
			  return file.contents.toString('utf8');
			}
		})))
		.pipe(extFilter.restore())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        //.pipe(reload({stream:true, once:true}))
        .pipe($.size());
});

gulp.task('renderStylus', function () {
  gulp.src('app/bower_components/flowplayer/skin/styl/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('app/bower_components/flowplayer/skin'))
    .pipe($.size());
});

gulp.task('fonts', function () {
    var streamqueue = require('streamqueue');
    return streamqueue({objectMode: true},
        //$.bowerFiles(),
        gulp.src('app/fonts/**/*')
    )
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});
/* original clean task
gulp.task('clean', function () {
    return gulp.src(['app/styles/css/application.css', 'dist'], { read: false }).pipe($.clean());
});*/

gulp.task('clean', function () {
    return gulp.src(['app/styles/css/application.css', 'dist'], { read: false }).pipe(vinylPaths(del));
});

gulp.task('build', ['html', 'images', 'fonts' ]);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles'], function () {
    /*
	browserSync.init(null, {
        server: {
            baseDir: 'app',
            directory: true
        },
        debugInfo: false,
        open: false,
        hostnameSuffix: ".xip.io"
    }, function (err, bs) {
        require('opn')(bs.options.url);
        console.log('Started connect web server on ' + bs.options.url);
    });
	*/
});

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    gulp.src('app/styles/scss/application.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles/css'));
    gulp.src('app/*'+fileExtension)
        .pipe(wiredep({
            directory: 'app/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['serve'], function () {
 
    // watch for changes
    gulp.watch(['app/*'+fileExtension]);
	//gulp.watch(['app/*'+fileExtension], reload);
 
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
