/***

  A global events model for storing and retrieving properties, and triggering and listening to events

***/

define([
  "framework/util"
], function (_) {

  var Props = {

    $event: window,

    // namespace props storage
    props: {},

    // raw props without getters/setters
    data: {},

    // return default props for a namespace
    init: function (namespace, defaults) {

      // if no props defined, set an empty object 
      if(!this.props.hasOwnProperty( namespace )) {
        this.data[ namespace ] = {};
        this.props[ namespace ] = {};
      }

      var props = this.props[ namespace ],
      data = this.data[ namespace ],
      fn = {

        on: function (prop, callback) {
          
          // iterate over any space-seperated events
          _.each(prop.split(" "), function (p) {

            // if prop is :module, listen for module event only
            if(p.slice(0, 1)===":") return Props.on(Props.event(p.slice( 1 )), callback);

            Props.on(Props.event(namespace, p), callback);
          });

          // allow chaining
          return fn;
        },

        off: function (prop) {

          _.each(prop.split(" "), function (p) {

            // if prop is :module, remove module event only
            p = p.slice(0, 1)===":" ?  Props.event(p.slice( 1 )) : Props.event(namespace, prop);

            Props.off( p );

          });

          // allow chaining
          return fn;
        }, 

        // get props like a model
        get: function (prop) {
          return prop.slice(0, 1)===":" ? Props.get(prop.slice( 1 )) : prop.split( ":" ).reduce(function (o, key) {
            return _.isUndefined( o ) ? o : o[ key ];
          }, data);
        },
        
        // set props like a model, prop can be object containing values to extend (so {value} becomes {trigger})
        set: function (list, value, trigger) {
          
          // if list is string assume single property, reassign list to {prop: value}
          if(_.isString( list )) list = _.object([ list ], [ value ]);
          else trigger = value;

          var updates = [];

          // iterate through properties
          _.each(list, function (val, proptree) {

            if( proptree.slice(0, 1)===":" ) return Props.get(proptree.slice( 1 ), val, trigger);

            // get deep property tree
            var tree = proptree.split( ":" ),
                prop = tree.shift(),
                current = !tree.length ? val : _.isObject( data[ prop ] ) ? data[ prop ] : {},
                changed;

            // if prop no yet defined
            if(!data.hasOwnProperty( prop )) {

              // unless explicitly set, do not trigger on creation
              if( trigger!==true ) changed = false;

              // define a getter and setter
              Object.defineProperty(props, prop, {

                // allow the props to be iterated over
                enumerable: true,

                // allow the property to be deleted
                configurable: true,

                get: function () {
                  return data[ prop ];
                },
                
                set: function (val) {

                  // if val unchanged do nothing
                  if(data[ prop ]===val) return;

                  // set the new value
                  data[ prop ] = val;

                  // trigger an event
                  fn.trigger( prop );
                }
              });
            }

            // set deep property
            if( tree.length ) {
              tree.reduce(function (current, prop, i) {
                if(i + 1 < tree.length) {
                  if(!_.isObject( current[ prop ] )) current[ prop ] = {};
                  return current[ prop ];
                } else {
                  if( _.isUndefined( current ) ) current = {};

                  // check if subvalue has changed
                  if(_.isUndefined( changed )) changed = current[ prop ] !== val;
                  current[ prop ] = val;
                }
              }, current);
            } else if(_.isUndefined( changed )) {
              changed = data[ prop ] !== current;
            }

            data[ prop ] = current;

            // if property changed or trigger is forced
            if(trigger===true || changed && trigger!==false) {
              fn.trigger( proptree );
            }
          });

          // allow chaining
          return fn;
        },

        // trigger an event on a prop, an array of props, or a module
        trigger: function (list) {
          if(_.isString( list )) list = [ list ];

          // set a value for module triggers
          var val = _.toArray( arguments ).slice( 1 );

          // iterate through props
          _.each(list, function (proptree) {

            _.each(proptree.split( ":" ), function (subprop, i, tree) {

              // get actual data (if exists)
              var path = tree.slice(0, tree.length - i),
                  prop = path.join( ":" ),
                  pick = _.getProp(data, path),

              // set returned value
              args = val.length ? val : [ pick[ path.slice( -1 )[ 0 ] ] ],

              // if prop is :module, trigger module event
              event = prop.slice(0, 1)===":" ? Props.event(prop.slice( 1 )) : Props.event(namespace, prop);

              // include picked object only if a single value is being returned
              args = args.length===1 ? args.concat(pick, fn) : args.concat( fn );

              Props.$event.trigger(event, args);
            });
          });

          // allow chaining
          return fn;
        },

        unset: function (list) {

          // if list is string assume single property, reassign list to array
          if(_.isString( list )) list = [ list ];

          _.each(list, function (proptree) {
            var tree = proptree.split( ":" ),
                ns = tree[ 0 ] === "" ? tree[ 1 ] : namespace,
                prop = tree[ 0 ] === "" ? tree[ 2 ] : tree[ 0 ];

            delete Props.data[ ns ][ prop ];
          });
        },

        // the props, can be attached for quick access
        props: props,

        // the raw data, can be used for base access without triggers
        raw: data

      };

      // set any default values
      if(_.isObject( defaults )) fn.set(defaults, false);

      return fn;
    },

    // retrieve and/or update a property:prop:value
    get: function (proptree, value, trigger) {

      // if property:prop isn't defined properly return
      if(proptree.indexOf( ':' )<=0) return;

      // split the property into its components (namespace and prop)
      var tree = proptree.split( ':' ),
          namespace = this.init( tree[ 0 ] ),
          prop = tree.slice( 1 ).join( ":" );

      // if a value is present set it
      if(!_.isUndefined( value )) namespace.set(prop, value, trigger);

      // return the result
      return namespace.get( prop );

    },

    // listen to events on a namespace
    on: function (namespace, callback) {

      if(!Props.$event.on && window.jQuery) Props.$event = window.jQuery( window );

      // iterate over any space-seperated events
      _.each(namespace.split(" "), function (ns) {
        Props.$event.on(Props.event( ns ), function () {
          if(_.isFunction( callback )) callback.apply(this, _.toArray( arguments ).slice( 1 ));
        });
      });

      // allow chaining
      return Props;
    },

    // remove listeners on a namespace
    off: function (namespace, callback) {

      _.each(namespace.split(" "), function (ns) {
        if(callback) {
          Props.$event.off(Props.event( ns ), callback);
        }else {
          Props.$event.off( Props.event( ns ) );
        }
      });

      // allow chaining
      return Props;
    },

    // retrieve an event string
    event: function (namespaces) {

      // select the event by namespace and prop
      return 'app-props:' + _.toArray( arguments ).join( ":" ).replace(/app-props:/g, "");
    },

  };

  return Props;
});