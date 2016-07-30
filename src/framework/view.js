/**

    Module Utility

**/

define([
  "framework/module",
  "framework/util"
], function (Module, _) {

  var View = {

    extend: function (view) {

      // extend module
      var module = Module.extend( view );

      if( !view.uid ) view.uid = _.randomString( 16 );
      view.bind = View.$el.bind.bind( view );
      view.unbind = View.$el.unbind.bind( view );
      view.autoBind = View.$el.autoBind.bind( view );

      View.$el.set(view);

      // return wrapped function (sets 'this' to module)
      return module;
    },

    $el: {
      set: function (view) {
        view.el = view.el || 'body';
        view.$el = _.isString( view.el ) ? $(view.el) : 
                   _.isDomSelection( view.el ) ? view.el : 
                   _.isString( view.el.selector ) ? $(view.el.selector) : false;

        if( !view.$el ) return console.warn( 'View "' + view.name + '": element is incorrectly defined' );
      },

      autoBind: function (fn, route, router) {
        router = router || ":router";
        this.on(router + ":" + (route || this.name), fn || this.fn.render);
        this.on(router + ":before", this.unbind);
      },

      bind: function () {
        if(this.bindings) this.unbind();
        this.bindings = [];
        _.each(this.el.bind, function (bind, bindFrom) {
          var $el, binding;
          if(_.isString( bind )) bind = {selector: bind}
          if( bind.selector ) {
            binding = {
              el: $(bind.selector),
              prop: bindFrom,
              selector: bind.selector,
              node: true
            };
            this.set(binding.prop, binding.el, false);
          } else if(_.isObject( bind )) {


            $el = $(bindFrom);
            binding = {
              input: $el.is('input, textarea') || $el.prop('contentEditable')===true,
              prop: bind.to,
              $el: $el,
              selector: bindFrom,
              fn: function (input) {
                binding.$el.forEach(function ($el) {
                  if(binding.current === $el) return;
                  var output = _.isFunction( fn ) ? fn( input, $el, true ) : input;
                  if(!_.isUndefined( output )) $el.prop( bind.set, output );
                })
              }
            };
            
            bind.set = bind.set || (binding.input ? 'value' : 'textContent');
            
            var fn = bind.fn ? bind.fn.split( ":" ).reduce(function (fn, method) {
              return _.isObject( fn ) ? fn[ method ] : false;
            }, this.fn) : false,
                val = _.isUndefined( bind.val ) ? this.Props.get(this.name + ":" + binding.prop) || binding.$el.prop( bind.set ) : bind.val;

            this.on(binding.prop, binding.fn);
            
            // set initial value (get === set when a value is passed)
            this.Props.get(this.name + ":" + binding.prop, val, true);

            // two-way bind only
            if( binding.input ) {
              this.$el.on(View.$el.event('input change', this), binding.selector, function (e) {
                binding.current = e.target;
                var input = e.target[ bind.set ], 
                    output = _.isFunction( fn ) ? fn( input, e.target, false ) : input;
                this.set(binding.prop, output);
                binding.current = false;
              }.bind( this ));
            }
          }

          if(binding && bind.on) {
            _.each(bind.on, function (fn, event) {
              View.$el.fn(event, binding.selector, fn, this);
            }, this);
          }
          
          this.bindings.push( binding );
         
        }, this);

        _.each(this.el.on, function (fn, event) {
          View.$el.fn(event, false, fn, this);
        }, this);

      },

      fn: function (event, delegate, fn, view) {
        if(_.isObject( fn ) && fn.delegate && fn.fn) {
          delegate = _.isString( delegate ) ? delegate + ' ' + fn.delegate : fn.delegate;
          fn = fn.fn;
        }
        if(_.isString( fn )) fn = fn.split( ":" ).reduce(function (fn, method) {
          return _.isObject( fn ) ? fn[ method ] : false;
        }, view.fn);
        if(_.isFunction( fn )) {
          event = View.$el.event(event, view);
          fn = fn.bind( view );
          if(delegate) view.$el.on(event, delegate, fn);
          else view.$el.on(event, fn);
        }
      },

      unbind: function () {
        if( !this.bindings ) return;
        this.$el.off('.bind-' + (this.uid || this.name));
        _.each(this.bindings, function (binding) {
          if( binding.node ) this.unset( binding.prop );
          else this.off(binding.prop, binding.fn);
        }, this);
        this.bindings = false;
      },

      event: function (event, view) {
        return event.replace(/( |$)/g, '.bind-' + (view.uid || view.name) + '$1');
      }
    }
  };

  return View;
});