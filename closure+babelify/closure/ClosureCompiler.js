const lift = require('when/node').lift;
const jvm = require('java');

/* begin java-virtual machine configuration */

jvm.asyncOptions = {
  asyncSuffix: undefined,
  syncSuffix: '',
  promiseSuffix: 'Promise',
  promisify: lift,
};
jvm.classpath.push(`${__dirname}/compiler.jar`);

/* end of configuration */

/**
 * Initializes the ClosureCompiler of the Java Class.
 * @returns {JavaClassObject} a Closure CommandLineRunner-Class object.
 * @method main (params?: string[])
 */
function closureCompiler() {
  return jvm.import('com.google.javascript.jscomp.CommandLineRunner');
}
/**
 * Runs an asynchronous instance of the
 * Google-Closure-Compiler through the
 * Java-Virtual-Machine instantiated before.
 * @param {string[]} array commandline parameters.
 */
function runClosureCompiler(array, stdout) {
  const params = [];
  array.forEach((option) => {
    params.push(option);
  });
  if (stdout) {
    jvm.newInstancePromise(closureCompiler().main(params)).catch((err) => {
      console.log(err.toString());
    });
    return null;
  }
  const output = [];
  jvm
    .newInstancePromise(closureCompiler().main(params))
    .then((response) => {
      output.push(response.toString());
    })
    .catch((err) => {
      console.log(err.toString());
    });
  return output.join('\n');
}

/**
 * Compresses 'file(s)' with 'option(s)' and returns a string
 * containing the compressed javascript or null.
 * @param {string|string[]} jsFiles file(s) to compress.
 * @param {object} config the commandline parameters used by the compiler.
 * @param {string} jsOut set to {null|undefined} or provide a filename for the output-file.
 * @returns {string|null} compressed JavaScript string or creates outputFile and returns 'null'.
 */
function closureJs(jsFiles, config, jsOut) {
  // Array to hold the CLI arguments for the compiler.
  const array = [];
  // Gets all defined CLI option(s).
  const keys = Object.keys(config);
  // Push the file(s) as first argument(s).
  if (typeof jsFiles === typeof array) {
    jsFiles.forEach((file) => {
      array.push(file);
    });
  } else {
    array.push(jsFiles);
  }
  // Push the option(s) to array.
  keys.forEach((key) => {
    array.push(key.toString(), config[key].toString());
  });
  // If jsOut is not null, push the filename as last parameter.
  if (jsOut) {
    array.push('--js_output_file', `${jsOut}`);
  }
  // Run the compiler.
  return runClosureCompiler(array);
}

module.exports = closureJs;
