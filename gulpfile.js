/**
 * Module dependencies.
 */

var babel = require('gulp-babel');
var concat = require('gulp-concat');
var gulp = require('gulp');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var wrapUmd = require('gulp-wrap-umd');

/**
 * Configuration
 */

var config = {
  name: 'oauth2-angular-phonegap.js',
  entry: './src/oauth2-angular-phonegap.js',
  src: ['./src/*.js', './src/**/*.js'],
  dest: './dist',
  umd: {
    namespace: 'oAuth2AngularPhonegap',
    exports: 'ngModule',
    template: `
      (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
          define([ "angular", "query-string" ], factory);
        } else if (typeof exports === 'object') {
          module.exports = factory(require("angular"), require("query-string"));
        } else {
          root.<%= namespace %> = factory(root.angular, root.queryString);
        }
      }(this, function(angular, queryString) {
        <% if (exports) { %>
          <%= contents %>
          return <%= exports %>;
        <% } else { %>
          return <%= contents %>;
        <% } %>
      }));
    `
  },
  banner: ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n')
};

/**
 * Scripts task.
 */

gulp.task('scripts', [], function() {
  return gulp.src(config.src)
    .pipe(babel({ modules: 'ignore', blacklist: ['useStrict'] }))
    .pipe(concat(config.name))
    .pipe(wrapUmd(config.umd))
    .pipe(uglify({
      mangle: false,
      output: { beautify: true },
      compress: false
    }))
    .pipe(header(config.banner, { pkg: pkg }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('scripts-minify', ['scripts'], function() {
  return gulp.src(config.dest + '/' + config.name)
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = '.min.js';
    }))
    .pipe(gulp.dest(config.dest));
});

/**
 * Main tasks.
 */

gulp.task('build', ['scripts-minify']);