/**

    Attr Utility

**/

define([
  "framework/util"
], function (_) {

  var Attr = {

    fn: {
      init: function () {
        Node.prototype.removeAttr = NodeList.prototype.removeAttr = Attr.fn.removeAttr;
        Node.prototype.attr = NodeList.prototype.attr = Attr.fn.attr;
        Node.prototype.data = NodeList.prototype.data = Attr.fn.data;
      },

      removeAttr: function (name) {
        this.forEach(function ($el) {
          $el.removeAttribute( name );
        });
        return this;
      },

      attr: function (name, value) {
        var args = _.toArray( arguments );
        if( args.length>2 ) args.length = 2;
        return Attr.fn.set.apply(this, args);
      },

      data: function (name, value) {
        if(arguments.length===1 && _.isString( name )) return Attr.fn.set.call(_.isNodeList( this ) ? this[ 0 ] : this, name, undefined, true);

        var data = {};
        if(!_.isObject( name )) data[ name ] = value;
        else _.extend(data, name, true);

        Attr.fn.set.call(this, data, undefined, true);
        return this;
      },

      set: function (name, value, data) {
        if(_.isNodeList( this )) {
          if(arguments.length===1 && _.isString( name )) return this[ 0 ] ? this[ 0 ].getAttribute( name ) : undefined;

          this.forEach(function ($el) {
            Attr.fn.set.apply($el, this);
          }.bind( arguments ));
          return this;
        }

        if(data && !this._dataset) this._dataset = _.cloneDeep( this.dataset );
        if(arguments.length===1 || data && _.isUndefined( value )) {
          if(_.isString( name )) return data ? this._dataset[ name ] : this.getAttribute( name );
          else for(var i in name) {
            if( data ) this._dataset[ i ] = name[ i ];
            else this.setAttribute(i, name[ i] );
          }
        }else if( data ) this._dataset[ name ] = value;
        else this.setAttribute(name, value);

        return this;
      }
    }
  };

  return Attr.fn;
});