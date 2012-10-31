module.exports = function(grunt) {
  grunt.initConfig({
    lint: {
      lib: 'lib/*.js',
      test: 'text/**/*.js'
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
        files: ['<config:lint.lib>', '<config:lint.test>'],
        tasks: 'default'
      }
    }
  });
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.registerTask('default', 'lint simplemocha');
}
