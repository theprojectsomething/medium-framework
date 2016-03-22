/**

    Element Utility

**/

define([
  "framework/util"
], function (_) {

  var ClassList = {

    fn: {
      init: function () {
        Node.prototype.addClass = NodeList.prototype.addClass = ClassList.fn.add;
        Node.prototype.removeClass = NodeList.prototype.removeClass = ClassList.fn.remove;
        Node.prototype.toggleClass = NodeList.prototype.toggleClass = ClassList.fn.toggle;
        Node.prototype.hasClass = NodeList.prototype.hasClass = ClassList.fn.contains;
      },

      get: function () {
        return this.reduce(function (list, $el) {
          return list.concat(_.toArray( $el.classList ));
        }, [])
      },

      set: function ($el, method, args, fn) {
        if(_.isNodeList( $el )) {
          $el.forEach(function ($i) {
            if( fn ) fn.apply($i, args);
            else ClassList.fn.set($i, method, this);
          }.bind( args ))
        } else {
          _.toArray( args ).join(" ").split(" ").forEach(function (value) {
            $el.classList[ method ]( value );
          });
        }
        return $el;
      },

      add: function () {
        return ClassList.fn.set(this, 'add', arguments);
      },

      remove: function () {
        return ClassList.fn.set(this, 'remove', arguments);
      },
      
      toggle: function (className, toggle) {
        return ClassList.fn.set(this, 'add', arguments, function () {
          if( _.isIE ) {
            if(_.isUndefined( toggle ) ? this.classList.contains( className ) : toggle) {
              this.classList.add( className );
            } else {
              this.classList.remove( className );
            }
          } else {
            this.classList.toggle(className, toggle);
          }
        });
      },

      contains: function (className, all) {
        if(_.isNodeList( this )) {
          var contains;
          this.forEach(function ($el, i) {
            if($el.classList.contains( className )) {
              if(all && contains!==false) contains = true;
              else if( !all ) contains = true;
            } else if( all ) contains = false
          });
          return !!contains;
        } else {
          return this.classList.contains( className );
        }
      }
    }
  };

  return ClassList.fn;
});