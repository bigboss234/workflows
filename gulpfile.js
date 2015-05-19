var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/*.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]
var sassSources = ['components/sass/style.scss'];


gulp.task('coffee', function () {
	gulp.src(coffeeSources)
		.pipe(coffee({ bare: true })
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('scripts.js'))
		.pipe(browserify())
		.pipe(gulp.dest('build/Dev/js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
        sass: 'components/sass',
		images: 'build/Dev/images',
		style: 'nested'
    }))
    .pipe(gulp.dest('build/Dev/css'))
    .pipe(connect.reload())

});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	gulp.watch('components/sass/*.scss', ['compass'])
})

gulp.task('connect', function() {
	connect.server({
		root: 'build/Dev',
		livereload: true
	})
})

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);
