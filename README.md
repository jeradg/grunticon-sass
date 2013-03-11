# grunticon, SASSified!

This is an SCSS version of the [original and awesomer Grunticon](https://github.com/filamentgroup/grunticon)

```
         /'
        //
    .  //
    |\//7
   /' " \     
  .   . .      
  | (    \     
  |  '._  '        
  /    \'-'

```

## A mystical SCSS icon solution.

grunticonsass is a [Grunt.js](https://github.com/gruntjs/grunt/) task that makes it easy to manage icons and background images for all devices, preferring HD (retina) SVG icons but also provides fallback support for standard definition browsers, and old browsers alike. From a CSS perspective, it's easy to use, as it generates a customizable selector referencing each icon, and doesn't use CSS sprites. 

grunticonsass takes a [folder of SVG files](https://github.com/zigotica/grunticon/tree/master/example/source) (typically, icons that you've drawn in an application like Adobe Illustrator), and [outputs them](https://github.com/zigotica/grunticon/tree/master/example/output) to SCSS in 3 formats: [svg data urls](https://github.com/zigotica/grunticon/blob/master/example/output/icons.data.svg.scss), [png data urls](https://github.com/zigotica/grunticon/blob/master/example/output/icons.data.png.scss), and [a third fallback CSS file with references to regular png images](https://github.com/zigotica/grunticon/blob/master/example/output/icons.fallback.scss), which are also automatically [generated and placed in a folder](https://github.com/zigotica/grunticon/tree/master/example/output/png). 

Currently, as of version 0.1.7 of this fork we are outputting 3 scss files and one txt that holds a list of selectors/original files. The purpose is to use sass to hold a file list with custom selectors for each icon, so we can import them into the 3 scss files and watch changes to build the final css files. The original filelist must be copy/pasted into a scss file that we will create and maintain separately (to avoid overwritting custom selectors). The name of the text and scss files can also be customized in Gruntfile.js

grunticonsass also generates [a small bit of JavaScript and CSS](https://github.com/zigotica/grunticon/blob/master/example/output/grunticon.loader.txt) to drop into your site, which asynchronously loads the appropriate icon CSS depending on a browser's capabilities, and a preview HTML file with that loader script in place. 

You can see [a demonstration of the output here](http://filamentgroup.com/examples/grunticon-output/preview.html).

## License
Copyright (c) 2012 Scott Jehl, [Filament Group, Inc.](http://filamentgroup.com)
Licensed under the MIT license.

## Getting Started

First, you'll need to install [PhantomJS](http://phantomjs.org/), which you might already have if you have [Grunt](https://github.com/cowboy/grunt) installed (No? You'll need that too.).

Once those are installed...

Install the grunticon module with: `npm install grunt-grunticon-sass`

Then add this line to your project's `Gruntfile.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-grunticon-sass');
```

And lastly, add the configuration settings to your `Gruntfile.js` file as mentioned below. grunticon will batch your icons whenever you run `$ grunt`, and output the files listed above to your `dest` folder, which is documented below.


## Documentation

### Required configuration properties

grunticon has 2 required configuration properties: `src` and `dest`. Both need to be defined for grunticon to run.

- `src`: path to your folder of svg files, relative to the grunt.js file. Perhaps something like `images/icons-source/`.
- `dest`: path to the folder that grunticon will write to, relative to the grunt.js file. Ideally, this would be a folder that does not yet exist in your directory. Perhaps something like `scss/icons-dist/`.

These can be set in your Gruntfile.js config file, under the name `grunticonsass`, like so:

```
	grunticonsass: {
      options: {
        src: "scss/dist/icons/",
        dest: "scss/icons/"
      }
    }
```

The `src` property refers to the directory in which your SVG icons are stored. The `dest` property refers to the directory you'd like grunticonsass to create, which will contain your output files. 

**IMPORTANT NOTE:** grunticonsass will overwrite any files in the `dest` directory if they are of the same name as a file that grunticon needs to create. For easiest results, you can set `dest` to a folder that does not yet exist in your directory and grunticon will create that folder, or set it to an existing folder and be sure to configure grunticon to create file names that do not already exist in that folder.

With these configuration properties set, you can add `grunticonsass` to your default tasks list. That'll look something like this:

    grunt.registerTask('default', ['lint', 'qunit', 'concat', 'min', 'grunticonsass']);

grunticonsass will now batch your icons whenever you run grunt.

### Optional configuration properties

In addition to the required configuration properties above, grunticon's grunt configuration lets you configure the names of the files and the images folder it generates inside `dest`. 

- `iconslistfile`: text file that will hold the original list of icons. Default: `"icons.list.txt"`
- `iconslistscss`:  scss file that will hold the customized selectors for each icon. YOU create this file manually. Default: `"icons.list.scss"`
- `datasvgscss`: The name of the SCSS file containing SVG data uris. Default: `"icons.data.svg.scss"`
- `datapngscss`: The name of the SCSS file containing PNG data uris. Default: `"icons.data.png.scss"`
- `urlpngscss`: The name of the SCSS file containing external png url references. Default: `"icons.fallback.scss"`
- `previewhtml`: The name of the generated HTML file containing PNG data uris. Default: `"preview.html"`
- `loadersnippet`:  The name of the generated text file containing the grunticon loading snippet. Default: `"grunticon.loader.txt"`
- `pngfolder`:  The name of the generated folder containing the generated PNG images. Default: `"png/"`
- `cssprefix`: a string to prefix all css classes with. Default: `"icon-"`

A config.rb has been added to build css files from previous scss files. You will have to  watch the folder (e.g., with `compass watch`) or build manually.

## Browser testing results for icon output

The generated asynchronous CSS loader script delivers an appropriate icon stylesheet depending on a device/browser's capabilities.

Browsers that render the SVG data url stylesheet:
- IE9
- Chrome 14+ (maybe older too?)
- Safari 4+ (maybe older too?)
- Firefox 3.6+ (maybe older too?)
- Opera 10+ (maybe older too?)
- iOS 3+ Safari and Chrome
- Android 4.0 Chrome (caveat: SVG icons do not scale in vector, but do appear to draw in high-resolution)
- Android 4.0 ICS Browser
- BlackBerry Playbook

Browsers that receive the PNG data url stylesheet:
- IE8
- Android 2.3 Browser
- Android 2.2 Browser
- Android 2.1 Browser
- Android 1.6 Browser
- Android 1.5 Browser

Browsers that receive the fallback png request:
- IE7
- IE6
- Non-JavaScript environments

## Tips

### Serving compressed CSS
One of the great benefits to data uris is the ability to compress the images heavily via gzip. Be sure to do this, as it'll cut your icon transfer size greatly.

### Creating SVG Artwork

The workflow we've been using so far involves creating a new Illustrator file with the artboard set to the desired size of the icon you want set in the CSS. 

Export the artwork by choosing File > Save as...  In the dialog, choose "SVG" as the format and enter a name for the file (this wil be used as your class name later, so keep it free of any disallowed CSS class characters like `.`, `{`, `(`, `)`, etc.

In the Save SVG dialog that opens up, there are lots of options. SVG has a ton of formats, so here are a few tips we've learned. 

- SVG Profile: Seems like SVG 1.1 Tiny is really well supported across even older mobile platforms so if you have simple artwork that doesn't use gradients or opacity this will yield a smaller and more compatible graphic. If you want to use all the fancy effects, save artwork as SVG 1.1. 
- Type: Convert to outline before export.
- Subsetting: None, I usually convert all text to outlines ahead of time
- Images: Embed
- Don't check "Preserve Illustrator editing" to reduce file size

### Copyright and licensing for the example SVG icons...

The example SVG icons in the source folder are borrowed from a few places, with attribution noted below. 
- [Unicorn icon by Andrew McKinley, The Noun Project](http://thenounproject.com/noun/unicorn/#icon-No3364)
- [Bear icon by National Park Service](http://thenounproject.com/noun/bear/#icon-No499)
- [Cat icon by  Marie Coons](http://thenounproject.com/noun/cat/#icon-No840)
- All others are either from [this free set by Tehk Seven](http://www.tehkseven.net/blog/1/entry-1066-475-free-awesome-high-quality-icons-for-designers/) or drawn by @toddparker of Filament Group

## ToDo
- Migrate ToDos to GitHub issues
- in the user's Gruntfile.js, grunticonsass's config options now must be wrapped with `options`. This was the fastest way to upgrade to grunt 0.4.0, but is there a way to avoid having to wrap the config in this way?
- Consider changing default dest filenames to be scss partials (i.e., beginning with `_`)
- Update example so that it uses the scss files and compiles automatically when `grunt grunticonsass` is run
- The javascript CSS autoload doesn't really make sense for SCSS/Compass. Figure out another way to conditionally load svg/PNG data/PNG url
- add grunt-compass to watch for scss changes automatically on grunt call (add it to dependencies section in package.json as well)
