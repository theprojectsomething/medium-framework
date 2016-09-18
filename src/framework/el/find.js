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
        Node.prototype.parents = NodeList.prototype.parents = Find.fn.parents;
        Node.prototype.path = NodeList.prototype.path = Find.fn.path;
        Node.prototype.closest = NodeList.prototype.closest = Find.fn.closest;
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
      },

      parents: function (selector) {
        if(_.isNodeList( this )) {
          return this.length > 1 ? _.uniq(this.reduce(function (list, $el) {
            return list.concat($el.parents.call(this, selector));
          }, [])): this.parents.call(this[0], selector);
        }

        var path = this.path().slice(1);
        
        return selector ? path.filter(function ($el) {
          return $el.is(selector);
        }) : path;
        
      },

      path: function (reset) {
        if(_.isNodeList( this )) {
          return this.map(function ($el) {
            return $el.path(reset);
          });
        }

        if(!this.$path || reset) {
          var $el = this;
          this.$path = [];
          for (; $el && $el !== document; $el = $el.parentNode) {
            this.$path.push($el);
          }
        }
        
        return this.$path.slice();
      },

      closest: function (selector) {
        if(!selector) return [];

        if(_.isNodeList( this )) {
          return this.length > 1 ? _.uniq(this.reduce(function (list, $el) {
            return list.concat($el.closest.call(this, selector));
          }, [])) : this.closest.call(this[0], selector);
        }

        return this.path().find(function ($el) {
          return $el.is(selector);
        });
      }
    },

  };

  return Find.fn;
});