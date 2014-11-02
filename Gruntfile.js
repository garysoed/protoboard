module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'shell': {
      'traceur': {
        command: 'traceur --out main.js src/modules.js  --source-maps=file --symbols=true --modules=inline'
      },
      'karma': {
        command: 'karma start karma.conf.js'
      },
      'mv': {
        command: function(from, to) {
          return 'mv ' + from + ' ' + to;
        }
      }
    },

    'watch': {
      'traceur': {
        files: [
          'src/**/*.js'
        ],
        tasks: [ 'shell:traceur' ],
        options: {
          atBegin: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('karma', 'shell:karma');
};