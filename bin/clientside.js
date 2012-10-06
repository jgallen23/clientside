#!/usr/bin/env node

var fs = require('fs');
var version = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version

var opt = require('optimist')
    .usage('clientside'+ version +'\nUsage: $0')
    .options('m', {
      alias: 'main',
      describe: 'Main file',
      type: 'string',
      demand: true
    })
    .options('n', {
      alias: 'name',
      describe: 'Module name',
      demand: true,
      type: 'string'
    })
    .options('h', {
      alias: 'help',
      descripe: 'Show help info'
    });

var argv = opt.argv;

if (argv.help) {
  return opt.showHelp();
}

var clientside = require('../');
clientside(argv.main, argv.name, function(err, results) {
  if (err) {
    throw err;
  }
  process.stdout.write(results);
});
