module.exports = function(grunt) {
  grunt.initConfig({
    lint: {
      grunt: 'grunt.js',
      bin: 'bin/clientside.js',
      lib: 'lib/*.js',
      test: 'test/**/*.js'
    },
    simplemocha: {
      all: {
        src: 'test/**/*.test.js',
        options: {
          ui: 'tdd',
          reporter: 'list',
          growl: true
        }
      }
    },
    watch: {
      test: {
        files: ['<config:lint.bin>', '<config:lint.grunt>', '<config:lint.lib>', '<config:lint.test>', 'lib/template.handlebars'],
        tasks: 'default'
      }
    }
  });
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.registerTask('default', 'lint simplemocha');
};
