/*

  Build Script
   - run with command 'npm run build'

*/


var library = "Medium Framework",

    // the start module
    init = "main",

    // the output directory
    output = '../build/',
    
    // imports
    requirejs = require( 'requirejs' ),
    fs = require( 'fs' ),
    uglifyjs = require( 'uglify-js' ),
    amdclean = require( 'amdclean' ),

    // turn passed arguments into object
    args = process.argv.slice(2).reduce(function (args, arg) {
      var split = arg.split( "=" ),
          key = split[ 0 ],
          val = split.length > 1 ? split[ 1 ] : true;

      args[ key ] = isNaN( val ) ? val : +val;
      return args;
    }, {}),
    
    // scripts & sourcemap
    name = library.replace(/\W+/g, ""),
    version = require( '../package.json' ).version,
    script = library.replace(/\W+/g, "-").toLowerCase() + '-' + version + '.js',
    scriptamd = script.replace('.js', '.amd.js'),
    scriptmin = script.replace('.js', '.min.js'),
    scriptnoversion = scriptmin.replace('-' + version, ''),
    sourcemap = scriptmin + ".map";

// clean the output directory
fs.readdirSync( output ).forEach(function (file, index) {
  fs.unlinkSync(output + file);
});

// optimise AMD
requirejs.optimize({

  // mainConfigFile: 'src/config.js',
  optimize: 'none',
  include: [ init ],
  out: output + scriptamd,

  onModuleBundleComplete: function (data) {

    // load the UMD wrapper
    var umd = fs.readFileSync('umd-wrapper.js', 'utf-8'),

    // load the AMD script and replace the version
    amdcode = fs.readFileSync(output + scriptamd, 'utf-8').replace("{{ VERSION }}", version),

    // the init module (value is returned by the UMD wrapper)
    globalModule = init,
    
    // clean the optimised AMD - sourcemaps and minification happen later (sourcemaps break when wrapping included here)
    cleaned = amdclean.clean({
      
      // location of file to clean
      code: amdcode,

    }),

    // include library name
    code = umd.replace("{{ NAME }}", name)

    // include cleaned script
    .replace("{{ SCRIPT }}", function () {
      
      // include current version
      return cleaned;

    }),

    // minify
    minified = args.minify ? uglifyjs.minify(code, {
      fromString: true,
      outSourceMap: sourcemap,
    }) : {
      code: code,
      map: ""
    };
  
    // write files
    fs.writeFileSync(output + scriptamd, amdcode);
    fs.writeFileSync(output + script, code);
    fs.writeFileSync(output + scriptmin, minified.code);
    fs.writeFileSync(output + sourcemap, minified.map);
    fs.writeFileSync(output + scriptnoversion, minified.code);
  }
}, function (e) {

  // check to make output locations relative to script runner
  var rel = args.rel ? output.replace(args.rel, '') : output,

  // list of scripts to include [{script}, {label}, {calculate size (default: true)}]
  list = [
    [scriptamd, "    AMD only"],
    [script, "-------------\n   UMD build"],
    [scriptnoversion, "-------------\n versionless"],
  ];

  // check to include minified scripts
  if(args.minify) {
    list.splice(2, 0, [scriptmin, "    minified"], [sourcemap, "   sourcemap", false]);
  }

  // create output
  list = list.map(function (item) {
    return `${item[ 1 ]}:\t${rel + item[ 0 ]}` + (item[ 2 ] !== false ? ` (${Math.round(100*fs.statSync( output + item[ 0 ] )["size"]/1024)/100}kB)` : '');
  });

  console.log(`
${e}
Success!
-------------
${list.join('\n')}
-------------
  `);
}, function(e) {
  console.log(`
RequireJS Error:
----------------
${e}
----------------
  `);
});
