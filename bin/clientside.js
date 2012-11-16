#!/usr/bin/env node

var fs = require('fs');
var clientside = require('../');

var opt = require('optimist')
    .usage('clientside '+ clientside.version +'\nUsage: $0 file.js [options]')
    .options('n', {
      alias: 'name',
      describe: 'Module name',
      type: 'string'
    })
    .options('x', {
      alias: 'exclude',
      describe: 'Exclude module from build',
      type: 'string',
      'default': []
    })
    .options('r', {
      alias: 'returns',
      describe: 'custom returns, useful if module is not built using CommonJS',
      type: 'string'
    })
    .options('h', {
      alias: 'help',
      descripe: 'Show help info'
    });

var argv = opt.argv;

if (argv.help || argv._.length === 0) {
  return opt.showHelp(function(help) {
    console.log(help);
    if (argv._.length === 0) {
      console.error('Error: must pass in a file');
    }
  });
}

clientside({
  main: argv._[0], 
  name: argv.name,
  returns: argv.returns,
  excludes: (typeof argv.exclude === 'string') ? [argv.exclude] : argv.exclude
}, function(err, results) {
  if (err) {
    throw err;
  }
  process.stdout.write(results);
});
