/**

    Element Utility

**/

define([
  "framework/util"
], function (_) {

  var Content = {

    fn: {
      init: function () {
        NodeList.prototype.eq = Content.fn.eq;
        Node.prototype.is = NodeList.prototype.is = Content.fn.is;
        Node.prototype.clone = NodeList.prototype.clone = Content.fn.clone;
        Node.prototype.before = NodeList.prototype.before = Content.fn.before;
        Node.prototype.after = NodeList.prototype.after = Content.fn.after;
        Node.prototype.prepend = NodeList.prototype.prepend = Content.fn.prepend;
        Node.prototype.append = NodeList.prototype.append = Content.fn.append;
        Node.prototype.text = NodeList.prototype.text = Content.fn.text;
        Node.prototype.html = NodeList.prototype.html = Content.fn.html;
        Node.prototype.val = NodeList.prototype.val = Content.fn.val;
        Node.prototype.prop = NodeList.prototype.prop = Content.fn.prop;
      },

      el: function ($el, position, html) {
        if(_.isNodeList( $el )) {
          $el.forEach(function ($i) {
            Content.fn.el($i, position, html);
          });
        } else {
          if(_.isString( html )) return $el.insertAdjacentHTML(position, html);
        }
      },

      eq: function (i) {
        return this[ i ];
      },

      is: function (selector) {
        var $list = _.isNodeList( this ) ? this : [ this ];

        return $list.reduce(function (is, $el) {
          return is || (_.isString( selector ) ? (_.isIE || $el.msMatchesSelector ? $el.msMatchesSelector( selector ) : $el.matches( selector ))
                                              : (_.isNodeList( selector ) ? selector.is( $el ) : selector === $el));
        }, false);
      },

      clone: function () {
        if(_.isNodeList( this )) {
          var $fragment = document.createDocumentFragment();
          this.forEach(function ($el) {
            var $clone = $el.cloneNode( true );
            $fragment.appendChild( $clone );
          });

          return $fragment.childNodes;
        }
        
        return this.cloneNode( true );
      },

      val: function (val) {
        return this.prop('value', val);
      },

      prop: function (prop, value) {
        var $list = _.isNodeList( this ) ? this : [ this ];

        if(arguments.length===1 && _.isString( prop )) {
          value = $list[ 0 ] ? $list[ 0 ][ prop ] : undefined; 
          return value === "true" ? true : value === "false" ? false : value;
        }
        if(_.isString( prop )) prop = _.object([ prop ], [ value ]);

        $list.forEach(function ($el) {
          for(var i in prop) $el[ i ] = prop[ i ];
        });
        return this;
      },

      before: function (html) {
        Content.fn.el(this, 'beforebegin', html)
        return this;
      },

      after: function (html) {
        Content.fn.el(this, 'afterend', html)
        return this;
      },

      prepend: function (html) {
        Content.fn.el(this, 'afterbegin', html)
        return this;
      },

      append: function (html) {
        Content.fn.el(this, 'beforeend', html)
        return this;
      },

      text: function (text, ishtml) {
        var $list = _.isNodeList( this ) ? this : [ this ];
        if(_.isUndefined( text )) {
          var textRepeat;

          return $list.reduce(function (r, $el, i) {
            var text = $el[ishtml ? 'innerHTML' : 'textContent'];
            textRepeat = i === 0 || text === textRepeat ? text : false;
            return i === $list.length - 1 && textRepeat ? textRepeat : r + text;
          }, '');
        }

        $list.forEach(function ($el) {
          $el[ishtml ? 'innerHTML' : 'textContent'] = text;
        });

        return this;
      },

      html: function (html) {
        return this.text(html, true);
      }
    }
  };

  return Content.fn;
});