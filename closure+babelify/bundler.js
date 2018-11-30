#!/usr/bin/node
const resolve = require('path').resolve;
const outStream = require('fs').createWriteStream;
const browserify = require('browserify');
const closureJs = require('./closure');

const tmpBundle = './.tmpBundle.js';
const src = process.argv[2];
const dest = process.argv[3];
const err = new Error('Missing parameter');

/**
 * Uses UglifyJS to compress a Browserify-Bundle.
 * @param {string} input Input-Path of a temporary bundle-file.
 * @param {string} output Output-Path where the bundle will be saved.
 */
function compressBundle(output) {
  closureJs(resolve(tmpBundle), 1, resolve(output));
}

/**
 * Bundles the Application with Browserify to a temporary-used file.
 */
function createBundle(input, output) {
  // **browserify**
  browserify(input)
    .transform('babelify', { presets: ['@babel/preset-env', '@babel/preset-react'] })
    .bundle()
    .pipe(outStream(tmpBundle))
    .on('close', () => {
      compressBundle(output);
    });
}

if (src && dest) {
  createBundle(resolve(src), resolve(dest));
} else {
  throw err;
}
