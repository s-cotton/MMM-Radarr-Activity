'use strict';

module.exports = function (grunt) {

  //require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    watch: {
      options: {
        nospawn: true
      },
      handlebars: {
        files: [
          'templates/*.hbs'
        ],
        tasks: ['handlebars:compile']
      },
      less: {
        files: [ 'css/*.less' ],
        tasks: ['less']
      }
    },

    less: {
      development: {
        options: {
          paths: ['css']
        },
        files: {
          'css/main.css': 'css/main.less'
        }
      }
    },

    handlebars: {
      options: {
        namespace: 'MMMRadarrActivity.Templates',
        processName: function(filePath) {
          return filePath.replace(/^templates\//, '').replace(/\.hbs$/, '');
        }
      },
      compile: {
        files: {
          'templates.js': ['templates/*.hbs']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');

};