#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const {
  exec,
} = require('child_process');

const packageJson = require('../package.json');

const scripts = `"build": "webpack --config webpack.prod.js",
    "dev": "webpack-dev-server --config webpack.dev.js",
    "test": "jest ./tests",
    "lint": "eslint src/**/*.js src/**/*.jsx",
    "start": "npm-run-all lint test dev"`;
/**
 * we pass the object key dependency || devdependency to this function
 * @param {object} deps object key that we want to extract
 * @returns {string} a string of 'dependencies@version'
 * that we can attach to an `npm i {value}` to install
 * every dep the exact version speficied in package.json
 */
const getDeps = deps => Object.entries(deps)
  .map(dep => `${dep[0]}@${dep[1]}`)
  .toString()
  .replace(/,/g, ' ')
  .replace(/^/g, '')
  // exclude the plugin only used in this file, nor relevant to the boilerplate
  .replace(/fs-extra[^\s]+/g, '');

console.log('⚡️⚡️⚡️⚡️⚡️ Initializing project ⚡️⚡️⚡️⚡️⚡️');

// create folder and initialize npm
exec(
  `mkdir ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`,
  (initErr, initStdout, initStderr) => {
    if (initErr) {
      console.error(`💩💩💩💩💩💩💩💩💩💩:
    ${initErr}`);
      return;
    }
    const packageJSON = `${process.argv[2]}/package.json`;
    // replace the default scripts, with the webpack scripts in package.json
    fs.readFile(packageJSON, (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts)
      fs.writeFile(packageJSON, data, err2 => err2 || true);
    });

    const filesToCopy = ['README.md', 'webpack.common.js', 'webpack.dev.js', 'webpack.prod.js', '.eslintrc', '.eslintignore', 'index.html', '.babelrc', '.gitignore'];

    for (let i = 0; i < filesToCopy.length; i += 1) {
      fs
        .createReadStream(path.join(__dirname, `../${filesToCopy[i]}`))
        .pipe(fs.createWriteStream(`${process.argv[2]}/${filesToCopy[i]}`));
    }

    https.get(
      'https://raw.githubusercontent.com/gpfaff/pfreact-boiler/master/.gitignore',
      (res) => {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (data) => {
          body += data;
        });
        res.on('end', () => {
          fs.writeFile(`${process.argv[2]}/.gitignore`, body, {
            encoding: 'utf-8',
          }, (err) => {
            if (err) throw err;
          });
        });
      },
    );

    console.log('npm init 🎯🥳🎯🥳🎯🥳🎯🥳🎯🥳🎯🥳\n');

    // installing dependencies
    console.log('Installing the 📦📦📦📦📦📦 -- hang tight.');
    const devDeps = getDeps(packageJson.devDependencies);
    const deps = getDeps(packageJson.dependencies);
    exec(
      `cd ${process.argv[2]} && npm i -D ${devDeps} && npm i -S ${deps}`,
      (npmErr, npmStdout, npmStderr) => {
        if (npmErr) {
          console.error(`💩💩💩💩💩💩💩💩💩💩
      ${npmErr}`);
          return;
        }
        console.log(npmStdout);
        console.log('Dependencies installed 🤪🤪🤪🤪🤪🤪🤪🤪');

        console.log('Copying additional files.. 📠📠📠📠📠📠📠📠📠');
        // copy additional source files
        fs
          .copy(path.join(__dirname, '../src'), `${process.argv[2]}/src`)
          .then(() => console.log(`All done!\nYour project is now ready to rock in ${
            process.argv[2]
          } folder.\n👾💻👾💻👾💻👾💻👾💻 away!!`))
          .catch(err => console.error(err));
      },
    );
  },
);
