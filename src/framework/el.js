/**

    Element Utility

**/

define([
  "framework/el/attr",
  "framework/el/classlist",
  "framework/el/events",
  "framework/el/find",
  "framework/el/content",
  "framework/util"
], function (Attr, ClassList, Events, Find, Content, _) {

  var El = {

    init: function () {
      _.init();
      
      if( window.jQuery ) return;
      this.init = _.noop;

      window.$ = function (selector) {
        return _.isString( selector ) ? document.querySelectorAll( selector ) : selector;
      };
      NodeList.prototype.__proto__ = Array.prototype;

      Attr.init();
      ClassList.init();
      Events.init();
      Find.init();
      Content.init();
    }
  };

  return El;
});