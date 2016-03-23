// UMD Wrapper
//  - http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
//  - replace SCRIPT with processed script
//  - replace NAME with library name
(function (root, factory, name) {
  
	// AMD
  if(typeof define === "function" && define.amd) {
  	define(function () {
      return (root[ name ] = factory());
    });

  // CommonJS
  } else if(typeof module === "object" && module.exports) {
    module.exports = (root[ name ] = factory());

  // Vanilla
  } else {
    root[ name ] = factory();
  }

}(this, function () {

  // override window object, processed sript attaches global method to it below
  var UMDfactory = true;

	// processed script
	{{ SCRIPT }}

	// return main pseudo global method from script
  return UMDfactory;

// defines the library name
}, '{{ NAME }}'));