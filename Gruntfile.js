module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
     // Empties folders to start fresh
      clean: {
          dist: {
              files: [{
                  dot: true,
                  src: [
                    '.tmp',
                    'prod/*',
                  ]
              }]
          }
      },
     //usemin updates references automatically when doing uglify etc
    useminPrepare: {
        html: 'index.html',
        options: {
            dest: 'prod/'
        }
    },
    usemin: {
        html: 'prod/{,*/}*.html'
    },
    filerev: {
          options: {
              encoding: 'utf8',
              algorithm: 'md5',
              length: 8
          },
          source: {
              files: [{
                  src: [
                      'prod/scripts/{,*/}*.js',
                  ]
              }]
          }
      },
      copy: {
        main: {
          expand: true,
          src: ['*.html', '*.css'],
          dest: 'prod/',
        },
        misc: {
          expand: true,
          src: ["assets/img/*", "fonts/*"],
          dest: 'prod/'
        },
        mapfiles: {
          expand: true,
          src: ['map/mapfiles/*'],
          dest: 'prod/',
          rename: function (dest, src) {
              return dest + src.replace(/\.tmx$/, ".xml");
          },
          options: {
            process: function (content, srcpath) {
              return content.replace(/\.\.\/\.\.\/assets/g, "assets");
            }
          },
        },
      },
      replace: {
        example: {
          src: ['prod/scripts/*'],             // source files array (supports minimatch)
          overwrite: true,
          replacements: [{
            from: 'tmx',                   // string replacement
            to: 'xml'
          }]
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-text-replace');

  // Default task(s).
  grunt.registerTask('build', ['clean', 'useminPrepare', 'concat', 'uglify', 'copy', 'filerev', 'usemin', 'replace']);
};