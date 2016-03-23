/*

  Framework file: attaches all sub utilities

*/

define([
  'framework/view',
  'framework/module',
  'framework/router',
  'framework/props',
  'framework/util',
  'framework/xhr',
], function(View, Module, Router, Props, Util, XHR){

  var framework = {
    version: "{{ VERSION }}",
    View: View,
    Module: Module,
    Router: Router,
    Props: Props,
    _: Util,
    XHR: XHR
  };

  // set to UMD variable (see 'umd-wrapper.js')
  if(typeof UMDfactory !== "undefined") {
    UMDfactory = framework;
  }

  return framework;
});
