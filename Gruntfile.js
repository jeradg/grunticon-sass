module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    grunticonsass: {
      // required config
      src: "example/source/",
      dest: "example/output/",

      // optional grunticon config properties

      // text file that will hold the original list of icons
      // to be copy/pasted into a customizable scss file by editor
      // that file must be requiered inside scss files
      iconslistfile: "icons.list.txt",

      // YOU create this file manually so that we dont overwrite content on icons change
      iconslistcss: "icons.list.scss",

      // SCSS filenames (now sass powered in order to manage different selectors)
      datasvgscss: "icons.data.svg.scss",
      datapngscss: "icons.data.png.scss",
      urlpngscss: "icons.fallback.scss",

      // CSS filenames (used in async call in preview html)
      datasvgcss: "icons.data.svg.css",
      datapngcss: "icons.data.png.css",
      urlpngcss: "icons.fallback.css",

      // preview HTML filename
      previewhtml: "preview.html",

      // grunticon loader code snippet filename
      loadersnippet: "grunticon.loader.txt",

      // folder name (within dest) for png output
      pngfolder: "png/",

      // prefix for CSS classnames
      cssprefix: "icon-",

      // css file path prefix - this defaults to "/" and will be placed before the "dest" path when stylesheets are loaded.
      // This allows root-relative referencing of the CSS. If you don't want a prefix path, set to to ""
      cssbasepath: "/"
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: { 
        Image: true,
        window: true
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );

  // Default task.
  grunt.registerTask('default', ['jshint', 'grunticonsass']);

};
