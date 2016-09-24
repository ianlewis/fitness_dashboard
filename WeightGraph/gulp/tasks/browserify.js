/*
Copyright 2015 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict'

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require("babelify");
var util = require("gulp-util");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

var config = require("../config");

gulp.task("browserify", function() {
    var b = browserify({
        entries: config.client.srcJSEntries,
        extensions: config.client.srcJSExtensions,
        debug: config.debug
    });

    b.transform(babelify, {presets: ["es2015", "react"]});

    return b.bundle()
        .pipe(source(config.client.buildFileName))
        .pipe(buffer())
        .on('error', util.log)
        .pipe(gulp.dest(config.buildDir));
});
