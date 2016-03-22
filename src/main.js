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
  return {
    version: "{{ VERSION }}",
    View: View,
    Module: Module,
    Router: Router,
    Props: Props,
    _: Util,
    XHR: XHR
  };
});
