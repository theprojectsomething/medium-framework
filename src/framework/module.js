/**

    Module Utility

**/

define([
  "framework/props",
  "framework/el",
  "framework/util",
  "framework/xhr"
], function (Props, El, _, XHR) {

  var Module = {

    extend: function (module) {
      El.init();
      
      // if name is defined, auto-setup props
      if( module.name ) {
        var props = Props.init(module.name, module.props);
        _.extend(module, props);

        // make any props functions non-enumerable
        _.each(_.omit(props, 'props'), function (val, key) {
          Object.defineProperty(module, key, {
            enumerable: false,
            value: val
          });
        });
      } else {
        console.warn( 'A view/module is unnamed - it will be unable to communicate:\r', module );
      }
      
      // retain non-wrapped function list
      Object.defineProperty(module, '_fn', {
        enumerable: false,
        value: _.cloneDeep( module.fn )
      });

      // add XHR
      Object.defineProperty(module, 'XHR', {
        enumerable: false,
        value: XHR
      });

      // add utility belt
      Object.defineProperty(module, '_', {
        enumerable: false,
        value: _
      });

      // set Props reference
      module.Props = Props;

      // return wrapped function (sets 'this' to module)
      return this.wrap(module.fn, module);
    },

    wrap: function (fn, m) {

      _.each(fn, function (val, key) {

        if(_.isObject( val ) && !_.isFunction( val ) && !_.isNodeList( val ) && !_.isJquery( val )) Module.wrap(val, m);
        else if(_.isFunction( val )) {

          // set 'this' to module
          fn[ key ] = function (e) {
            return val.apply(m, arguments);
          };
        }
      });

      return fn;
    }
  };

  return Module;
});