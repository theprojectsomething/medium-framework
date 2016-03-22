/**

    Module Utility
    See Bling.js: https://gist.github.com/paulirish/12fb951a8b893a454b32

**/

define([
  "framework/util"
], function (_) {

  var Events = {

    // see: https://developer.mozilla.org/en-US/docs/Web/Events
    types: {
      DragEvent:        ["drag", "dragend", "dragenter", "dragleave", "dragover", "dragstart", "drop"],
      Event:            ["change", "input", "invalid"],
      FocusEvent:       ["blur", "focus"],
      KeyboardEvent:    ["keydown", "keypress", "keyup"],
      MouseEvent:       ["click", "contextmenu", "dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"],
      TouchEvent:       ["touchcancel", "touchend", "touchenter", "touchleave", "touchmove", "touchstart"],
      WheelEvent:       ["wheel"]
    },

    list: [],
    data: {},

    fn: {

      init: function () {
        NodeList.prototype.on = NodeList.prototype.addEventListener = Events.fn.on.all;
        Node.prototype.on = window.on = Events.fn.on.event;
        XMLHttpRequest.prototype.on = Events.fn.on.xhr;
        NodeList.prototype.off = NodeList.prototype.removeEventListener = Events.fn.off.all;
        Node.prototype.off = window.off = XMLHttpRequest.prototype.off = Events.fn.off.event;
        NodeList.prototype.trigger = Events.fn.trigger.all;
        Node.prototype.trigger = window.trigger = Events.fn.trigger.event;

        Events.types.list = {
          ref: {}
        };
        for(var type in Events.types) {
          if( type==='list' ) continue;
          Events.types[ type ].forEach(function (val) {
            Events.types.list[ val ] = window[ type ];
            Events.types.list.ref[ val ] = type;
          });
        }
      },

      on: {

        all: function (types, delegate, fn) {
          this.forEach(function ($el) {
            $el.on(types, delegate || fn, delegate ? fn : false);
          });
          return this;
        },

        event: function (types, delegate, fn) {

          types.split(' ').forEach(function (typespace) {
            var type = Events.fn.type.e( typespace ),
                namespace = Events.fn.type.ns( typespace ),
                callback = function (e) {

                  // set el to 'this' if no delegate, or delegate if there is a match
                  var $el = !fn ? this : $(e.target).is( delegate ) ? e.target : false,
                      detail = e.detail || e.data,
                      data = Events.data[ detail ];

                  // return if no match
                  if( !$el ) return;

                  // reset detail
                  e.detail = 0;

                  (fn || delegate).apply($el, data ? _.toArray( arguments ).concat( data ) : arguments);
                };

            // add to events lists
            Events.list.push({
              $el: this,
              type: type,
              ns: namespace,
              fn: (fn || delegate),
              callback: callback
            });

            this.addEventListener(type, callback);
          }.bind( this ));

          return this;
        },

        xhr: function (types, fn) {
          Events.fn.on.el.call(this, types, fn);
          return this;
        }
      },

      off: {

        all: function (types, fn) {
          this.forEach(function ($el) {
            $el.off.apply($el, this);
          }.bind( arguments ));
          return this;
        },

        event: function (types, fn) {
          fn = arguments.length > 1 ? fn || true : false;


          types.split(' ').forEach(function (typespace) {
            if( !typespace ) return;
            var type = Events.fn.type.e( typespace ),
                namespace = Events.fn.type.ns( typespace ),
                events = _.filter(Events.list, function (e, i) {
                  e.i = i;


                  // check element
                  if( e.$el!==this ) return;
                  return (!type || e.type === type) &&
                         (!namespace || e.ns === namespace) &&
                         (!fn || e.fn === fn);

                }.bind( this ));

            for(var i in events) {
              Events.list.splice(events[ i ].i, 1);
              this.removeEventListener(events[ i ].type, events[ i ].callback);
            }
          }.bind( this ));
          return this;
        }
      },

      trigger: {
        all: function (type, args) {
          this.forEach(function ($el) {
            $el.trigger(type, args);
          });
          return this;
        },

        event: function (type, args) {
          // store data against a random number (long integer)
          var n = +Math.random().toString().slice(2, 11),
              event;

          Events.data[ n ] = args;

          if( _.isIE ) {
            event = document.createEvent(Events.types.list.ref[ type ] || "Event");
            event.initEvent(type, true, false);
            event.data = n;
            this.dispatchEvent( event );
          } else {
            event = Events.types.list[ type ] || CustomEvent;
            this.dispatchEvent(new event(type, {
              bubbles: true,
              detail: n // pass data reference through detail
            }));
          }

          // delete data reference
          delete Events.data[ n ];
        }
      },

      type: {
        e: function (type) {
          return type.replace(/\..*/, '');
        },

        ns: function (type) {
          return type.replace(/^[^.]*\.?/, '');
        }
      }
    }
  };

  return Events.fn;
});