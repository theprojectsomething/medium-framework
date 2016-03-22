/**

    Element Utility

**/

define([
  "framework/util"
], function (_) {

  var Find = {

    fn: {
      init: function () {
        Node.prototype.find = window.find = NodeList.prototype.find = Find.fn.find;
      },

      find: function (selector) {
        if(_.isNodeList( this )) {
          var className = 'f' + (Math.random()*100000|0),
              matches;
          this.forEach(function ($el) {
            $el.find( selector ).forEach(function ($i) {
              $i.classList.add( className );
            });
          });
          var $matches = document.querySelectorAll('.' + className)
          $matches.forEach(function ($i) {
            $i.classList.remove( className );
          });
          return $matches;
        } else {
          var $el = this === window ? document : this;
          return $el.querySelectorAll( selector );
        }
      }
    },

  };

  return Find.fn;
});