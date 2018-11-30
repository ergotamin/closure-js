#!/usr/bin/node


const argv = require('process').argv;
const jvm = require('java');

/* begin java-virtual machine configuration */

jvm.asyncOptions = {
  asyncSuffix: undefined,
  syncSuffix: '',
  promiseSuffix: 'Promise',
  promisify: require('when/node').lift,
};
jvm.classpath.push(`${__dirname}/compiler.jar`);

/* end of configuration */

/**
 * @class Compiler the '.jar'-inherit CommandLineRunner-class.
 */
const Compiler = jvm.import('com.google.javascript.jscomp.CommandLineRunner');

/**
 * Runs an asynchronous instance of the
 * Google-Closure-Compiler through the
 * Java-Virtual-Machine instantiated before.
 * @param {string[]} array commandline parameters.
 */
function closureJS(array) {
  const params = [];
  array.forEach((option) => {
    params.push(option);
  });
  try {
    jvm.newInstancePromise(Compiler.main(params));
  } catch (err) {
    console.log(err.toString());
  }
}
if (argv.length >= 3) {
  const array = [];
  argv.forEach((param, idx) => {
    if (idx >= 2) array.push(param.toString());
  });
  closureJS(array);
}
