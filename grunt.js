module.exports = function(grunt) {
  grunt.initConfig({
    lint: {
      grunt: 'grunt.js',
      lib: 'lib/*.js',
      test: 'test/**/*.js'
    },
    simplemocha: {
      all: {
        src: 'test/**/*.js',
        options: {
          ui: 'bdd',
          reporter: 'list',
          growl: true
        }
      }
    },
    watch: {
      test: {
        files: ['<config:lint.grunt>', '<config:lint.lib>', '<config:lint.test>', 'lib/template.handlebars'],
        tasks: 'default'
      }
    }
  });
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.registerTask('default', 'lint simplemocha');
};
