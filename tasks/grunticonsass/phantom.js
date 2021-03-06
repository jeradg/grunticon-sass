/*
 * grunticon-sass
 * https://github.com/filamentgroup/grunticon
 *
 * Copyright (c) 2012 Scott Jehl, Filament Group, Inc
 * Licensed under the MIT license.
 */

/*global phantom:true*/
/*global window:true*/
/*global btoa:true*/

/*
phantom args sent from grunticon-sass.js:
  [0] - input directory path
  [1] - output directory path
  [2] - asyncCSS output file path
  [3] - preview.html static file path
  [4] - SCSS filename for datasvg scss
  [5] - SCSS filename for datapng scss
  [6] - SCSS filename for urlpng scss
  [7] - filename for preview HTML file
  [8] - png folder name
  [9] - css classname prefix
  [10] - css basepath prefix
  [11] - text file that will hold the original list of icons
  [12] - scss file that will hold the customized selectors
  [13] - CSS filename for datasvg css (for preview.html js code)
  [14] - CSS filename for datapng css
  [15] - CSS filename for urlpng css
*/

var fs = require( "fs" );
var inputdir = phantom.args[0];
var outputdir = phantom.args[1];
var pngout =  phantom.args[8];
var cssprefix;
//If in grunticonsass.js config.cssprefix is an empty string, when it passes the empty string to phantom.js 
//as an argument in grunt.util.spawn, phantom.js does not receive the argument. Thus, grunticonsass.js sends
//phantom.js the string "empty-string-cssprefix", which we now turn back into an empty string.
if ( phantom.args[9] === "empty-string-cssprefix" ) {
  cssprefix = "";
} else {
  cssprefix = phantom.args[9];
}
var files = fs.list( inputdir );
var currfile = 0;
var pngcssrules = [];
var pngdatacssrules = [];
var datacssrules = [];
var htmlpreviewbody = [];
var fallbackscss = phantom.args[6];
var pngdatascss = phantom.args[5];
var datascss = phantom.args[4];
var cssbasepath = phantom.args[10];
// css version as well to be used in the async call:
var fallbackcss = phantom.args[15];
var pngdatacss = phantom.args[14];
var datacss = phantom.args[13];
// hold the list of icons:
var listiconsnames = [];
var listiconsfile = phantom.args[11];
var listiconscss = phantom.args[12];
// now we add the require calls to each scss file
// these will reference our custom list of selectors for each icon file
datacssrules.push( "@import \"" + listiconscss +  "\";" );
pngdatacssrules.push( "@import \"" + listiconscss +  "\";" );
pngcssrules.push( "@import \"" + listiconscss +  "\";" );

// increment the current file index and process it
function nextFile(){
  currfile++;
  processFile();
}

// files have all been processed. write the css and html files and return
function finishUp(){

  // make the preview HTML file and asyncCSS loader file
  var asyncCSS = fs.read( phantom.args[2] );

  // copy above for a slightly different output in the preview html file (different paths)
  var asyncCSSpreview = asyncCSS;

  // open up the static html document
  var htmldoc = fs.read( phantom.args[3]);

  // noscript for the snippet file
  var noscript = '<noscript><link href="' + cssbasepath + outputdir + fallbackcss + '" rel="stylesheet"></noscript>';

  // noscript for the preview file
  var noscriptpreview = '<noscript><link href="' + fallbackcss + '" rel="stylesheet"></noscript>';

  // add custom function call to asyncCSS
  asyncCSS += '\ngrunticon( [ "' + cssbasepath + outputdir + datacss +'", "' + cssbasepath + outputdir + pngdatacss +'", "' + cssbasepath + outputdir + fallbackcss +'" ] );';
  asyncCSSpreview += '\ngrunticon( [ "'+ datacss +'", "'+ pngdatacss +'", "'+ fallbackcss +'" ] );';

  // add async loader to the top
  htmldoc = htmldoc.replace( /<script>/, "<script>\n\t" + asyncCSSpreview );

  //add noscript
  htmldoc = htmldoc.replace( /<\/script>/, "</script>\n\t" + noscriptpreview );

  // add icons to the body
  htmldoc = htmldoc.replace( /<\/body>/, htmlpreviewbody.join( "\n\t" ) + "\n</body>" );

  // write the preview html file
  fs.write( outputdir + phantom.args[7], htmldoc );

  // write txt with list of files
  fs.write( outputdir + listiconsfile, listiconsnames.join( "\n\n" ) );

  /*
  // TO FIX: using this check makes phantomjs fail silently (no files are written to disk)
  // write scss to hold our custom selectors, but only if it does not exist:
  if(!fs.exist(outputdir + listiconsfile)) {
    fs.write( outputdir + listiconscss, listiconsnames.join( "\n\n" ) );
  }
  else {
  }
  */

  // write SCSS files
  fs.write( outputdir + fallbackscss, pngcssrules.join( "\n\n" ) );
  fs.write( outputdir + pngdatascss, pngdatacssrules.join( "\n\n" ) );
  fs.write( outputdir + datascss, datacssrules.join( "\n\n" ) );

  // overwrite the snippet HTML
  fs.write( phantom.args[2], "<!-- Unicode CSS Loader: place this in the head of your page -->\n<script>\n" + asyncCSS + "</script>\n" + noscript );
}

// process an svg file from the source directory
function processFile(){
  var theFile = files[ currfile ];

  if( theFile ){
    // only parse svg files
    if( theFile.match( /\.svg$/i ) ){
      (function(){
        var page = require( "webpage" ).create();
        var svgdata = fs.read(  inputdir + theFile ) || "";
        var svgdatauri = "data:image/svg+xml;base64,";
        var pngdatauri = "data:image/png;base64,";

        // kill the ".svg" at the end of the filename
        var filenamenoext = theFile.replace( /\.svg$/i, "" );

        // get svg element's dimensions so we can set the viewport dims later
        var frag = window.document.createElement( "div" );
        frag.innerHTML = svgdata;
        var svgelem = frag.querySelector( "svg" );
        var width = svgelem.getAttribute( "width" );
        var height = svgelem.getAttribute( "height" );

        // get base64 of svg file
        svgdatauri += btoa(svgdata);

        // add lines to list of icons file:
        listiconsnames.push( "$" + cssprefix + filenamenoext + " : \"." + cssprefix + filenamenoext + "\";" );

        // add rules to svg data css file (changed from .icon-file format to #{$icon-file} format)
        datacssrules.push( "#{$" + cssprefix + filenamenoext + "} { background-image: url(" + svgdatauri + "); background-repeat: no-repeat; }" );

        // add rules to png url css file (changed from .icon-file format to #{$icon-file} format)
        pngcssrules.push( "#{$" + cssprefix + filenamenoext + "} { background-image: url(" + pngout + filenamenoext + ".png" + "); background-repeat: no-repeat; }" );
        
        // add markup to the preview html file
        htmlpreviewbody.push( '<pre><code>.' + cssprefix + filenamenoext + ':</code></pre><div class="' + cssprefix + filenamenoext + '" style="width: '+ width +'; height: '+ height +'"></div><hr/>' );

        // set page viewport size to svg dimensions
        page.viewportSize = {  width: parseFloat(width), height: parseFloat(height) };

        // open svg file in webkit to make a png
        page.open(  inputdir + theFile, function( status ){

          // create png file
          page.render( outputdir + pngout + filenamenoext + ".png" );

          // create png data URI (changed from .icon-file format to #{$icon-file} format)
          pngdatacssrules.push( "#{$" + cssprefix + filenamenoext + "} { background-image: url(" +  pngdatauri + page.renderBase64( "png" ) + "); background-repeat: no-repeat; }" );

          // process the next svg
          nextFile();
        } );
      }());
    }
    else {
      // process the next svg
      nextFile();
    }
  }
  else {
    // fin
    finishUp();
    phantom.exit();
  }
}

// go ahead with the first file
processFile();