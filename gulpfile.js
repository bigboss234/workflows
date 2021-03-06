var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    minifyJSON = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	sassStyle,
	outputDir;

env = process.env.NODE_ENV || 'dev';

if (env=== 'dev') {
	outputDir = 'build/Dev/';
	sassStyle = 'expanded'
} else {
	outputDir = 'build/Prod/';
	sassStyle = 'compressed'
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
]
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];


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
		.pipe(gulpif(env === 'prod', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
        sass: 'components/sass',
		images: outputDir + 'images',
		style: sassStyle
    }))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())

});

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee'])
	gulp.watch(jsSources, ['js'])
	gulp.watch('components/sass/*.scss', ['compass'])
	gulp.watch('build/Dev/*.html', ['html'])
	gulp.watch('build/Dev/js/*.json', ['json'])
	gulp.watch('build/Dev/images/**/*.*', ['images'])
})

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	})
})

gulp.task('html', function() {
	gulp.src('build/Dev/*.html')
		.pipe(gulpif(env === 'prod', minifyHTML()))
		.pipe(gulpif(env === 'prod', gulp.dest(outputDir)))
		.pipe(connect.reload())
})

gulp.task('images', function () {
	gulp.src('build/Dev/images/**/*.*')
		.pipe(gulpif(env === 'prod', imagemin({
			progressive : true,
			svgoPlugins : [{removeViewBox: false}],
			use: [pngcrush()]
		})))
		.pipe(gulpif(env === 'prod', gulp.dest(outputDir + 'images')))
		.pipe(connect.reload())
})

gulp.task('json', function() {
	gulp.src('build/Dev/js/*.json')
		.pipe(gulpif(env === 'prod', minifyJSON()))
		.pipe(gulpif(env === 'prod', gulp.dest('build/Prod/js/')))
		.pipe(connect.reload())
})

gulp.task('default', ['html', 'json','coffee', 'js', 'compass', 'images', 'connect', 'watch']);
