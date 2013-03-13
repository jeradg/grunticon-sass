/*
 * grunticon-sass
 * https://github.com/zigotica/grunticon
 *
 * Copyright (c) 2013 Scott Jehl, Filament Group, Inc
 * Licensed under the MIT license.
 */

module.exports = function( grunt, undefined ) {
  "use strict";

  var uglify = require( 'uglify-js' );

  grunt.registerTask( 'grunticonsass', 'A mystical SCSS icon solution.', function() {

    // just a quick starting message
    grunt.log.write( "Look, it's a grunticon!\n" );

    // get the config
    var config = this.options();

    config.files = {
        loader: __dirname + "/grunticonsass/static/grunticon.loader.js",
        banner: __dirname + "/grunticonsass/static/grunticon.loader.banner.js",
        preview: __dirname + "/grunticonsass/static/preview.html",
        phantom: __dirname + "/grunticonsass/phantom.js"
    };
    // fail if config or no src or dest config
    if( !config || config.src === undefined || config.dest === undefined ){
        grunt.fatal( "Oops! Please provide grunticonsass configuration for src and dest in your Gruntfile.js file" );
        return;
    }

    // make sure src and dest have / at the end
    if( !config.src.match( /\/$/ ) ){
        config.src += "/";
    }
    if( !config.dest.match( /\/$/ ) ){
        config.dest += "/";
    }

    var asyncCSS = config.files.loader;
    var asyncCSSBanner = config.files.banner;
    var previewHTMLsrc = config.files.preview;

    // text filename that will hold the original list of icons
    var iconslistfile = config.iconslistfile || "icons.list.txt";

    // scss filename that will be used to add our own selectors
    // this file will need to be created manually to avoid overwrite!
    // we list it here so we can add the require rules at beginning of the 3 scss files
    var iconslistscss = config.iconslistscss || "icons.list.scss";

    // SCSS filenames 
    var datasvgscss = config.datasvgscss || "icons.data.svg.scss";
    var datapngscss = config.datapngscss || "icons.data.png.scss";
    var urlpngscss = config.urlpngscss || "icons.fallback.scss";

    // CSS filenames to be used on preview async call
    var datasvgcss = config.datasvgcss || "icons.data.svg.css";
    var datapngcss = config.datapngcss || "icons.data.png.css";
    var urlpngcss = config.urlpngcss || "icons.fallback.css";

    //filename for generated output preview HTML file
    var previewhtml = config.previewhtml || "preview.html";

    //filename for generated loader HTML snippet file
    var loadersnippet = config.loadersnippet || "grunticon.loader.txt";

    // css references base path for the loader
    var cssbasepath = config.cssbasepath || "/";

    // folder name (within the output folder) for generated png files
    var pngfolder = config.pngfolder || "png/";
    // make sure pngfolder has / at the end
    if( !pngfolder.match( /\/$/ ) ){
        pngfolder += "/";
    }

    // css class prefix
    var cssprefix;
    //If the user has set config.cssprefix to be an empty string, assign cssprefix to be an empty string. 
    //Otherwise, assign cssprefix to be either config.cssprefix or the default value "icon-". Testing for
    //an empty string is necessary because empty strings are falsy, but it should be possible for the
    //user to choose not to have a prefix in their icon css classes, i.e., an empty string.
    if ( config.cssprefix === "" ) {
        cssprefix = "";
    } else {
        cssprefix = config.cssprefix || "icon-";
    }

    // create the output directory
    grunt.file.mkdir( config.dest );

    // create the output icons directory
    grunt.file.mkdir( config.dest + pngfolder );

    // minify the source of the grunticon loader and write that to the output
    grunt.log.write( "\ngrunticon now minifying the stylesheet loader source." );
    var banner = grunt.file.read( asyncCSSBanner );
    var minified = uglify.minify( asyncCSS );
    var min = banner + "\n" + uglify.minify( asyncCSS ).code;
    var loaderCodeDest = config.dest + loadersnippet;
    grunt.file.write( loaderCodeDest, min );
    grunt.log.write( "\ngrunticon loader file created." );

    // take it to phantomjs to do the rest
    grunt.log.write( "\ngrunticon now spawning phantomjs..." );

    grunt.util.spawn({
      cmd: 'phantomjs',
      args: [
        config.files.phantom,
        config.src,
        config.dest,
        loaderCodeDest,
        previewHTMLsrc,
        datasvgscss,
        datapngscss,
        urlpngscss,
        previewhtml,
        pngfolder,
        cssprefix,
        cssbasepath,
        iconslistfile,
        iconslistscss,
        datasvgcss,
        datapngcss,
        urlpngcss
      ],
      fallback: ''
    }, function(err, result, code) {
      // TODO boost this up a bit.
      grunt.log.write("\nSomething went wrong with phantomjs...");
    });
  });
};
