module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'shell': {
      'traceur': {
        command: 'traceur --out main.js src/modules.js  --source-maps=file --experimental --modules=inline'
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
      },

      'sass': {
        files: [
          'src/**/*.scss'
        ],
        tasks: [ 'sass' ],
        options: {
          atBegin: true
        }
      }
    },

    'karma': {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    'sass': {
      'dist': {
        options: {
          loadPath: 'src/themes'
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.scss'],
          dest: 'out/',
          ext: '.css'
        }]
      }
    },

    // Configuration to be run (and then tested).
    'yuimd': {
      protoboard: {
        options: {
          'projectName': 'ProtoBoard',
          '$home': 'doc-theme/Home.theme',
          '$class': 'doc-theme/class.theme'
        },
        'src': 'src',
        'dest': 'doc'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-sass');
};