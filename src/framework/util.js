/**

    Utility

**/

define([], function () {

  var template, Util, _ = {},

  fn = {

    init: function (lodash) {
      console.log("init:", window._ ? "LODASH/UNDERSCORE!" : "(no lodash/underscore)");
      _ = lodash || window._ || _;
      Util.extend(Util, _);
    },

    clone: function (a, b, deep, transform, defaults) {
      b = b || (Util.isArray( a ) ? [] : {});
      transform = transform || Util.noop;

      for(var i in a){
        if(a.hasOwnProperty( i ) && (!defaults || Util.isUndefined( b[ i ] ))){
          b[ i ] = deep && Util.isObject( a[ i ] ) ? fn.clone( a[ i ], null, true ) : transform(a[ i ], i, b);
        }
      }
      return b;
    },

    cloneDeep: function (a, b, transform) {
      return fn.clone(a, b, true, transform);
    },

    cookie: function (name) {
      // http://stackoverflow.com/a/25490531/720204
      var value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
      return value ? value.pop() : '';
    },

    defaults: function (a, b, deep) {
      return fn.clone(b, a, !!deep, null, true);
    },

    defaultsDeep: function (a, b) {
      return fn.defaults(a, b, true);
    },

    each: function (list, fn, context) {
      if(Util.isArray( list )) list.forEach( fn.bind(context || window) );
      else for(var i in list) fn.bind(context || window)(list[ i ], i, list);
    },

    extend: function (a, b, deep) {
      return fn.clone(b, a, !!deep);
    },

    filter: function (a, b, single) {
      var r = [];
      for(var i in a) {
        if(fn.isEqual(a[ i ], b, i)){
          r.push(a[ i ]);
          if( single ) break;
        }
      }
      return single ? r[ 0 ] : r;
    },

    find: function (a, b) {
      return Util.filter(a, b, true);
    },
    
    findWhere: function (a, props) {
      return Util.find(a, props);
    },

    get: function (o, path, defaultValue) {
      var pathtree = o.hasOwnProperty( path ) ? [ path ] : Util.isArray( path ) ? path : path.split( /[\[\].:]+/ );

      return pathtree.reduce(function (o, path) {
        return o===defaultValue || Util.isUndefined( o[ path ] ) ? defaultValue : o[ path ];
      }, o);
    },

    getProp: function (o, path) {
      var pathtree = Util.isArray( path ) ? path : path.split(":"),
          key = pathtree.slice( -1 )[ 0 ],
          prop = {};
      prop[ key ] = Util.get(o, pathtree.join( "." ));
      return prop;
    },

    isArray: function (o) {
       return Object.prototype.toString.call( o ) === "[object Array]";
    },

    isBoolean: function (o) {
      return typeof o === "boolean";
    },

    isDomSelection: function (o) {
      return Util.isNodeList( o ) || Util.isNode( o ) || Util.isJquery( o );
    },

    isEqual: function (a, b, args) {
      if(!Util.isObject( a ) && typeof a !== typeof b) return false;
      if(Util.isBoolean( b )) return !!a === b;
      if(Util.isFunction( b )) return b(a, isNaN( args ) ? args : +args);
      if(Util.isObject( b )) {
        for(var i in b) {
          if(!b.hasOwnProperty( i )) continue;
          if(!a.hasOwnProperty( i ) || !fn.isEqual(a[ i ], b[ i ])) {
            return false;
          }
        }
        return true;
      }

      // if number, string, etc
      return Util.isObject( a ) ? a[ b ] : a === b;
    },

    isFunction: function (o) {
      return typeof o === "function";
    },

    isIE: (function () {
      return typeof ScriptEngineMajorVersion === "function" ? ScriptEngineMajorVersion() : undefined;
    })(),

    isJquery: function (o) {
      return window.jQuery && o instanceof window.jQuery;
    },

    isNode: function (o) {
      return Object.prototype.toString.call( o ) === "[object HTMLElement]";
    },

    isNodeList: function (o) {
      return Object.prototype.toString.call( o ) === "[object NodeList]";
    },

    isObject: function (o, noArray) {
       return noArray ? Object.prototype.toString.call( o ) === "[object Object]" : typeof o === "object";
    },

    isRegExp: function (o) {
      return Object.prototype.toString.call( o ) === "[object RegExp]";
    },

    isString: function (o) {
      return typeof o === "string";
    },

    isUndefined: function (o) {
      return typeof o === "undefined";
    },

    noop: function (v) {
      return v;
    },

    object: function (list, values) {
      var array = Util.isArray( list[ 0 ] );
      return list.reduce(function (o, val, i) {
        o[array ? val[ 0 ] : val] = array ? val[ 1 ] : values[ i ];
        return o;
      }, {});
    },

    omit: function (o, keys) {
      return Util.pick2(o, Util.isArray( keys ) ? keys : Util.toArray( arguments ).slice( 1 ), true);
    },

    pick: function (o, keys) {
      return Util.pick2(o, Util.isArray( keys ) ? keys : Util.toArray( arguments ).slice( 1 ));
    },

    pick2: function (o, keys, without) {
      return Object.keys( o ).reduce(function (picked, key) {
        var hasKey = keys.indexOf( key ) >= 0;
        if(hasKey && !without || !hasKey && without) picked[ key ] = o[ key ];
        return picked;
      }, {});
    },

    randomString: function (length) {
      return Array(length + 1).join( (Math.random().toString( 36 ) + '00000000000000000').slice(2, 18) ).slice(0, length);
    },

    serialise: function (data, prefix) {
      // http://stackoverflow.com/a/1714899/720204
      var str = [];
      for(var i in data) {
        if( data.hasOwnProperty( i ) ) {
          var key = prefix ? prefix + "[" + i + "]" : i,
              value = data[ i ];
          str.push(typeof value == "object" ? this.serialise(value, key)
            : encodeURIComponent( key ) + "=" + encodeURIComponent( value ));
        }
      }
      return str.join( "&" );
    },

    // set/get/remove items from local/session storage
    storage: (function (window) {
      var uid = new Date,
      Storage = function (type, uid) {

        this.data = (function (type, uid) {
          try {
            var storage = window[type + 'Storage'];
            storage.setItem(uid, uid);
            var result = storage.getItem(uid) == uid;
            storage.removeItem(uid);
            return result && storage;
          } catch (exception) {}
        })(type, uid);
        
        this.setItem = function (key, value) {
          if(this.data) this.data.setItem(key, JSON.stringify(value));
        };

        this.getItem = function (key, isJSON) {
          if(!this.data) return;
          var data = this.data.getItem(key);
          return isJSON!==false ? JSON.parse(data) : data;
        };

        this.removeItem = function (key) {
          if(this.data) this.data.removeItem(key);
        };
      };

      return {
        local: new Storage('local', uid),
        session: new Storage('session', uid)
      };
    })(window),

    template: function (str) {
      // Adapted from http://goo.gl/7KvWuU with single-quote fix from http://goo.gl/fOuW28
      // John Resig - http://ejohn.org/ - MIT Licensed
      // Figure out if we're getting a template, or if we need to
      // load the template - and be sure to cache the result.
      var fn = !/\W/.test( str ) ? template[ str ] = template[ str ] || this.template( $(str)[ 0 ].innerHTML ) :
       
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
         
          // Introduce the data as local variables using with(){}
          "with(obj){p.push('" +
         
          // Convert the template into pure JavaScript
          str.replace(/[\r\t\n]/g, " ")
         .replace(/'(?=[^%]*%>)/g,"\t")
         .split("'").join("\\'")
         .split("\t").join("'")
         .replace(/<%=(.+?)%>/g, "',$1,'")
         .replace(/{{(.+?)}}/g, "',$1,'")
         .split("<%").join("');")
         .split("%>").join("p.push('")
         + "');}return p.join('');");
      
      // Provide some basic currying to the user
      return function (data) {
        return fn( Util.defaults(data, {_: Util}));
      };
    },

    toArray: function (args) {
      return [].slice.call( args );
    },

    uniq: function (list) {
      // http://stackoverflow.com/a/9229821/720204
      return list.filter(function(value, i, self) {
          return self.indexOf(value) === i;
      });
    },

    // convert an xpath to a CSS3 selector e.g. "xpath://body/a[3]" => "body:nth-of-type(1) a:nth-of-type(3)"
    xpathToSelector: function (xpath) {
      return xpath.replace(/^xpath:\/\//, '').split('/').reduce(function (selector, value) {
         return selector.concat(value.replace(/\[(\d+)\]|$/, function ($0, $1) {
            return ':nth-of-type(' + ($1 || 1) + ')';
         }));
      }, []).join(" ");
    }
  };

  // create Util getters from functions
  Util = {};
  for(var i in fn) {
    (function (i) {
      Object.defineProperty(Util, i, {
        get: function () {

          // return lodash version if available
          return _[ i ] || fn[ i ];
        }
      });
    })( i );
  }

  return Util;
});