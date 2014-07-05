module.exports = function(grunt) {

  // Grunt configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'dist/public/**.html',
      options: {
        dest: 'dist/public',
        root: 'public',
      }
    },

    usemin: {
      html: 'dist/public/**.html',
      options: {
        assetsDirs: ['dist/public',]
      }
    },

    // copy templates to dist folder for usemin to update
    copy: {
      templates: {
        files: [{expand:true, src:'public/**.html', dest: 'dist/'}]
      }
    },

    clean: ['dist', '.tmp'],

    less: {
      development: {
        options: {
          relativeUrls: true,
          cleancss: true
        },
        files: {
          'public/css/base.css': 'public/less/base.less'
        },
      },
      production: {
        options: {
          relativeUrls: true,
          compress: true,
          cleancss: true
        },
        files: {
          'dist/public/css/base.css': 'public/less/base.less'
        },
      },
    },

    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      summary: {
        src: 'dist/**/*.{css,js}'
      }
    },

    watch: {
      less: {
        files: ['public/css/*.less'],
        tasks: ['less:development',]
      },
      js: {
        files: ['public/js/*.js'],
        tasks: ['jshint',]
      },
      go: {
        files: ['**/*.go'], // watch and reload go run if any .go file is changed, downside dunno if it compile or not
        tasks: ['shell:gofmt', 'shell:go'],
        options: {
          livereload: true,
        },
      }
    },

    shell: {
      go: {
        command: 'grunt watch & go run main.go',
        options: {
          stdout: true
        }
      },
      gofmt: {
        command: 'gofmt -w *.go',
        options: {
          stdout: true
        }
      }
    },

    jshint: {
        all: ['Gruntfile.js', 'public/js/**/*js',]
    }

  });

  // Load Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-rev');

  // Run "grunt build" to concat+minify+revision CSS/JS files, update usemin
  // blocks in templates
  grunt.registerTask('build',[
    'jshint',
    'shell:gofmt',
    'clean',
    'copy:templates',  // copy templates to dist folder
    'less:production',
    'useminPrepare',   // prepare an object of files that will be passed to concat and/or uglify
    'concat',          // concatenate assets
    'uglify',        // minify JS files
    'cssmin',          // minify CSS files
    'rev',
    'usemin',          // replace usemin blocks with actual filepaths
  ]);

  // Run "grunt" to start the go server and watch less files for recompilation
  grunt.registerTask('default',[
    'jshint',
    'less:development',
    'shell:gofmt',
    'shell:go',
  ]);

};
