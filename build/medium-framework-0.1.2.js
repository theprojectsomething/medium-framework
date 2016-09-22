// UMD Wrapper
//  - http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
//  - replace SCRIPT with processed script
//  - replace NAME with library name
(function (root, factory, name) {
  
	// AMD
  if(typeof define === "function" && define.amd) {
  	define(function () {
      return (root[ name ] = factory());
    });

  // CommonJS
  } else if(typeof module === "object" && module.exports) {
    module.exports = (root[ name ] = factory());

  // Vanilla
  } else {
    root[ name ] = factory();
  }

}(this, function () {

  // override window object, processed sript attaches global method to it below
  var UMDfactory = true;

	// processed script
	;(function() {
/**

    Utility

**/
var framework_util, framework_props, framework_el_attr, framework_el_classlist, framework_el_events, framework_el_find, framework_el_content, framework_el, framework_xhr, framework_module, framework_view, framework_router, main;
framework_util = function () {
  var template, Util, _ = {}, fn = {
      init: function (lodash) {
        console.log('init:', window._ ? 'LODASH/UNDERSCORE!' : '(no lodash/underscore)');
        _ = lodash || window._ || _;
        Util.extend(Util, _);
      },
      clone: function (a, b, deep, transform, defaults) {
        b = b || (Util.isArray(a) ? [] : {});
        transform = transform || Util.noop;
        for (var i in a) {
          if (a.hasOwnProperty(i) && (!defaults || Util.isUndefined(b[i]))) {
            b[i] = deep && Util.isObject(a[i]) ? fn.clone(a[i], null, true) : transform(a[i], i, b);
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
        if (Util.isArray(list))
          list.forEach(fn.bind(context || window));
        else
          for (var i in list)
            fn.bind(context || window)(list[i], i, list);
      },
      extend: function (a, b, deep) {
        return fn.clone(b, a, !!deep);
      },
      filter: function (a, b, single) {
        var r = [];
        for (var i in a) {
          if (fn.isEqual(a[i], b, i)) {
            r.push(a[i]);
            if (single)
              break;
          }
        }
        return single ? r[0] : r;
      },
      find: function (a, b) {
        return Util.filter(a, b, true);
      },
      findWhere: function (a, props) {
        return Util.find(a, props);
      },
      get: function (o, path, defaultValue) {
        var pathtree = o.hasOwnProperty(path) ? [path] : Util.isArray(path) ? path : path.split(/[\[\].:]+/);
        return pathtree.reduce(function (o, path) {
          return o === defaultValue || Util.isUndefined(o[path]) ? defaultValue : o[path];
        }, o);
      },
      getProp: function (o, path) {
        var pathtree = Util.isArray(path) ? path : path.split(':'), key = pathtree.slice(-1)[0], prop = {};
        prop[key] = Util.get(o, pathtree.join('.'));
        return prop;
      },
      isArray: function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
      },
      isBoolean: function (o) {
        return typeof o === 'boolean';
      },
      isDomSelection: function (o) {
        return Util.isNodeList(o) || Util.isNode(o) || Util.isJquery(o);
      },
      isEqual: function (a, b, args) {
        if (!Util.isObject(a) && typeof a !== typeof b)
          return false;
        if (Util.isBoolean(b))
          return !!a === b;
        if (Util.isFunction(b))
          return b(a, isNaN(args) ? args : +args);
        if (Util.isObject(b)) {
          for (var i in b) {
            if (!b.hasOwnProperty(i))
              continue;
            if (!a.hasOwnProperty(i) || !fn.isEqual(a[i], b[i])) {
              return false;
            }
          }
          return true;
        }
        // if number, string, etc
        return Util.isObject(a) ? a[b] : a === b;
      },
      isFunction: function (o) {
        return typeof o === 'function';
      },
      isIE: function () {
        return typeof ScriptEngineMajorVersion === 'function' ? ScriptEngineMajorVersion() : undefined;
      }(),
      isJquery: function (o) {
        return window.jQuery && o instanceof window.jQuery;
      },
      isNode: function (o) {
        return Object.prototype.toString.call(o) === '[object HTMLElement]';
      },
      isNodeList: function (o) {
        return Object.prototype.toString.call(o) === '[object NodeList]';
      },
      isObject: function (o, noArray) {
        return noArray ? Object.prototype.toString.call(o) === '[object Object]' : typeof o === 'object';
      },
      isRegExp: function (o) {
        return Object.prototype.toString.call(o) === '[object RegExp]';
      },
      isString: function (o) {
        return typeof o === 'string';
      },
      isUndefined: function (o) {
        return typeof o === 'undefined';
      },
      noop: function (v) {
        return v;
      },
      object: function (list, values) {
        var array = Util.isArray(list[0]);
        return list.reduce(function (o, val, i) {
          o[array ? val[0] : val] = array ? val[1] : values[i];
          return o;
        }, {});
      },
      omit: function (o, keys) {
        return Util.pick2(o, Util.isArray(keys) ? keys : Util.toArray(arguments).slice(1), true);
      },
      pick: function (o, keys) {
        return Util.pick2(o, Util.isArray(keys) ? keys : Util.toArray(arguments).slice(1));
      },
      pick2: function (o, keys, without) {
        return Object.keys(o).reduce(function (picked, key) {
          var hasKey = keys.indexOf(key) >= 0;
          if (hasKey && !without || !hasKey && without)
            picked[key] = o[key];
          return picked;
        }, {});
      },
      randomString: function (length) {
        return Array(length + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, length);
      },
      template: function (str) {
        // Adapted from http://goo.gl/7KvWuU with single-quote fix from http://goo.gl/fOuW28
        // John Resig - http://ejohn.org/ - MIT Licensed
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ? template[str] = template[str] || this.template($(str)[0].innerHTML) : // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};' + // Introduce the data as local variables using with(){}
        'with(obj){p.push(\'' + // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, ' ').replace(/'(?=[^%]*%>)/g, '\t').split('\'').join('\\\'').split('\t').join('\'').replace(/<%=(.+?)%>/g, '\',$1,\'').replace(/{{(.+?)}}/g, '\',$1,\'').split('<%').join('\');').split('%>').join('p.push(\'') + '\');}return p.join(\'\');');
        // Provide some basic currying to the user
        return function (data) {
          return fn(Util.defaults(data, { _: Util }));
        };
      },
      toArray: function (args) {
        return [].slice.call(args);
      },
      serialise: function (data, prefix) {
        // http://stackoverflow.com/a/1714899/720204
        var str = [];
        for (var i in data) {
          if (data.hasOwnProperty(i)) {
            var key = prefix ? prefix + '[' + i + ']' : i, value = data[i];
            str.push(typeof value == 'object' ? this.serialise(value, key) : encodeURIComponent(key) + '=' + encodeURIComponent(value));
          }
        }
        return str.join('&');
      },
      uniq: function (list) {
        // http://stackoverflow.com/a/9229821/720204
        return list.filter(function (value, i, self) {
          return self.indexOf(value) === i;
        });
      }
    };
  // create Util getters from functions
  Util = {};
  for (var i in fn) {
    (function (i) {
      Object.defineProperty(Util, i, {
        get: function () {
          // return lodash version if available
          return _[i] || fn[i];
        }
      });
    }(i));
  }
  return Util;
}();
framework_props = function (_) {
  var Props = {
    $event: window,
    // namespace props storage
    props: {},
    // raw props without getters/setters
    data: {},
    // return default props for a namespace
    init: function (namespace, defaults) {
      // if no props defined, set an empty object 
      if (!this.props.hasOwnProperty(namespace)) {
        this.data[namespace] = {};
        this.props[namespace] = {};
      }
      var props = this.props[namespace], data = this.data[namespace], fn = {
          on: function (prop, callback) {
            // iterate over any space-seperated events
            _.each(prop.split(' '), function (p) {
              // if prop is :module, listen for module event only
              if (p.slice(0, 1) === ':')
                return Props.on(Props.event(p.slice(1)), callback);
              Props.on(Props.event(namespace, p), callback);
            });
            // allow chaining
            return fn;
          },
          off: function (prop) {
            _.each(prop.split(' '), function (p) {
              // if prop is :module, remove module event only
              p = p.slice(0, 1) === ':' ? Props.event(p.slice(1)) : Props.event(namespace, prop);
              Props.off(p);
            });
            // allow chaining
            return fn;
          },
          // get props like a model
          get: function (prop) {
            return prop.slice(0, 1) === ':' ? Props.get(prop.slice(1)) : prop.split(':').reduce(function (o, key) {
              return _.isUndefined(o) ? o : o[key];
            }, data);
          },
          // set props like a model, prop can be object containing values to extend (so {value} becomes {trigger})
          set: function (list, value, trigger) {
            // if list is string assume single property, reassign list to {prop: value}
            if (_.isString(list))
              list = _.object([list], [value]);
            else
              trigger = value;
            var updates = [];
            // iterate through properties
            _.each(list, function (val, proptree) {
              if (proptree.slice(0, 1) === ':')
                return Props.get(proptree.slice(1), val, trigger);
              // get deep property tree
              var tree = proptree.split(':'), prop = tree.shift(), current = !tree.length ? val : _.isObject(data[prop]) ? data[prop] : {}, changed;
              // if prop no yet defined
              if (!data.hasOwnProperty(prop)) {
                // unless explicitly set, do not trigger on creation
                if (trigger !== true)
                  changed = false;
                // define a getter and setter
                Object.defineProperty(props, prop, {
                  // allow the props to be iterated over
                  enumerable: true,
                  // allow the property to be deleted
                  configurable: true,
                  get: function () {
                    return data[prop];
                  },
                  set: function (val) {
                    // if val unchanged do nothing
                    if (data[prop] === val)
                      return;
                    // set the new value
                    data[prop] = val;
                    // trigger an event
                    fn.trigger(prop);
                  }
                });
              }
              // set deep property
              if (tree.length) {
                tree.reduce(function (current, prop, i) {
                  if (i + 1 < tree.length) {
                    if (!_.isObject(current[prop]))
                      current[prop] = {};
                    return current[prop];
                  } else {
                    if (_.isUndefined(current))
                      current = {};
                    // check if subvalue has changed
                    if (_.isUndefined(changed))
                      changed = current[prop] !== val;
                    current[prop] = val;
                  }
                }, current);
              } else if (_.isUndefined(changed)) {
                changed = data[prop] !== current;
              }
              data[prop] = current;
              // if property changed or trigger is forced
              if (trigger === true || changed && trigger !== false) {
                fn.trigger(proptree);
              }
            });
            // allow chaining
            return fn;
          },
          // trigger an event on a prop, an array of props, or a module
          trigger: function (list) {
            if (_.isString(list))
              list = [list];
            // set a value for module triggers
            var val = _.toArray(arguments).slice(1);
            // iterate through props
            _.each(list, function (proptree) {
              _.each(proptree.split(':'), function (subprop, i, tree) {
                // get actual data (if exists)
                var path = tree.slice(0, tree.length - i), prop = path.join(':'), pick = _.getProp(data, path),
                  // set returned value
                  args = val.length ? val : [pick[path.slice(-1)[0]]],
                  // if prop is :module, trigger module event
                  event = prop.slice(0, 1) === ':' ? Props.event(prop.slice(1)) : Props.event(namespace, prop);
                // include picked object only if a single value is being returned
                args = args.length === 1 ? args.concat(pick, fn) : args.concat(fn);
                Props.$event.trigger(event, args);
              });
            });
            // allow chaining
            return fn;
          },
          unset: function (list) {
            // if list is string assume single property, reassign list to array
            if (_.isString(list))
              list = [list];
            _.each(list, function (proptree) {
              var tree = proptree.split(':'), ns = tree[0] === '' ? tree[1] : namespace, prop = tree[0] === '' ? tree[2] : tree[0];
              delete Props.data[ns][prop];
            });
          },
          // the props, can be attached for quick access
          props: props,
          // the raw data, can be used for base access without triggers
          raw: data
        };
      // set any default values
      if (_.isObject(defaults))
        fn.set(defaults, false);
      return fn;
    },
    // retrieve and/or update a property:prop:value
    get: function (proptree, value, trigger) {
      // if property:prop isn't defined properly return
      if (proptree.indexOf(':') <= 0)
        return;
      // split the property into its components (namespace and prop)
      var tree = proptree.split(':'), namespace = this.init(tree[0]), prop = tree.slice(1).join(':');
      // if a value is present set it
      if (!_.isUndefined(value))
        namespace.set(prop, value, trigger);
      // return the result
      return namespace.get(prop);
    },
    // listen to events on a namespace
    on: function (namespace, callback) {
      if (!Props.$event.on && window.jQuery)
        Props.$event = window.jQuery(window);
      // iterate over any space-seperated events
      _.each(namespace.split(' '), function (ns) {
        Props.$event.on(Props.event(ns), function () {
          if (_.isFunction(callback))
            callback.apply(this, _.toArray(arguments).slice(1));
        });
      });
      // allow chaining
      return Props;
    },
    // remove listeners on a namespace
    off: function (namespace, callback) {
      _.each(namespace.split(' '), function (ns) {
        if (callback) {
          Props.$event.off(Props.event(ns), callback);
        } else {
          Props.$event.off(Props.event(ns));
        }
      });
      // allow chaining
      return Props;
    },
    // retrieve an event string
    event: function (namespaces) {
      // select the event by namespace and prop
      return 'app-props:' + _.toArray(arguments).join(':').replace(/app-props:/g, '');
    }
  };
  return Props;
}(framework_util);
framework_el_attr = function (_) {
  var Attr = {
    fn: {
      init: function () {
        Node.prototype.removeAttr = NodeList.prototype.removeAttr = Attr.fn.removeAttr;
        Node.prototype.attr = NodeList.prototype.attr = Attr.fn.attr;
        Node.prototype.data = NodeList.prototype.data = Attr.fn.data;
      },
      removeAttr: function (name) {
        this.forEach(function ($el) {
          $el.removeAttribute(name);
        });
        return this;
      },
      attr: function (name, value) {
        var args = _.toArray(arguments);
        if (args.length > 2)
          args.length = 2;
        return Attr.fn.set.apply(this, args);
      },
      data: function (name, value) {
        if (arguments.length === 1 && _.isString(name))
          return Attr.fn.set.call(_.isNodeList(this) ? this[0] : this, name, undefined, true);
        var data = {};
        if (!_.isObject(name))
          data[name] = value;
        else
          _.extend(data, name, true);
        Attr.fn.set.call(this, data, undefined, true);
        return this;
      },
      set: function (name, value, data) {
        if (_.isNodeList(this)) {
          if (arguments.length === 1 && _.isString(name))
            return this[0] ? this[0].getAttribute(name) : undefined;
          this.forEach(function ($el) {
            Attr.fn.set.apply($el, this);
          }.bind(arguments));
          return this;
        }
        if (data && !this._dataset)
          this._dataset = _.cloneDeep(this.dataset);
        if (arguments.length === 1 || data && _.isUndefined(value)) {
          if (_.isString(name))
            return data ? this._dataset[name] : this.getAttribute(name);
          else
            for (var i in name) {
              if (data)
                this._dataset[i] = name[i];
              else
                this.setAttribute(i, name[i]);
            }
        } else if (data)
          this._dataset[name] = value;
        else
          this.setAttribute(name, value);
        return this;
      }
    }
  };
  return Attr.fn;
}(framework_util);
framework_el_classlist = function (_) {
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
          return list.concat(_.toArray($el.classList));
        }, []);
      },
      set: function ($el, method, args, fn) {
        if (_.isNodeList($el)) {
          $el.forEach(function ($i) {
            if (fn)
              fn.apply($i, args);
            else
              ClassList.fn.set($i, method, this);
          }.bind(args));
        } else {
          _.toArray(args).join(' ').split(' ').forEach(function (value) {
            $el.classList[method](value);
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
          if (_.isIE) {
            if (_.isUndefined(toggle) ? this.classList.contains(className) : toggle) {
              this.classList.add(className);
            } else {
              this.classList.remove(className);
            }
          } else {
            this.classList.toggle(className, toggle);
          }
        });
      },
      contains: function (className, all) {
        if (_.isNodeList(this)) {
          var contains;
          this.forEach(function ($el, i) {
            if ($el.classList.contains(className)) {
              if (all && contains !== false)
                contains = true;
              else if (!all)
                contains = true;
            } else if (all)
              contains = false;
          });
          return !!contains;
        } else {
          return this.classList.contains(className);
        }
      }
    }
  };
  return ClassList.fn;
}(framework_util);
framework_el_events = function (_) {
  var Events = {
    // see: https://developer.mozilla.org/en-US/docs/Web/Events
    types: {
      DragEvent: [
        'drag',
        'dragend',
        'dragenter',
        'dragleave',
        'dragover',
        'dragstart',
        'drop'
      ],
      Event: [
        'change',
        'input',
        'invalid'
      ],
      FocusEvent: [
        'blur',
        'focus'
      ],
      KeyboardEvent: [
        'keydown',
        'keypress',
        'keyup'
      ],
      MouseEvent: [
        'click',
        'contextmenu',
        'dblclick',
        'mousedown',
        'mouseenter',
        'mouseleave',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup'
      ],
      TouchEvent: [
        'touchcancel',
        'touchend',
        'touchenter',
        'touchleave',
        'touchmove',
        'touchstart'
      ],
      WheelEvent: ['wheel']
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
        Events.types.list = { ref: {} };
        for (var type in Events.types) {
          if (type === 'list')
            continue;
          Events.types[type].forEach(function (val) {
            Events.types.list[val] = window[type];
            Events.types.list.ref[val] = type;
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
            var type = Events.fn.type.e(typespace), namespace = Events.fn.type.ns(typespace), callback = function (e) {
                // set el to 'this' if no delegate, or delegate if there is a match
                var $el = !fn ? this : (e.delegateTarget = e.target.closest(delegate)) ? e.target : false, detail = e.detail || e.data, data = Events.data[detail];
                // return if no match
                if (!$el)
                  return;
                // reset detail
                e.detail = 0;
                (fn || delegate).apply($el, data ? _.toArray(arguments).concat(data) : arguments);
              };
            // add to events lists
            Events.list.push({
              $el: this,
              type: type,
              ns: namespace,
              fn: fn || delegate,
              callback: callback
            });
            this.addEventListener(type, callback);
          }.bind(this));
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
          }.bind(arguments));
          return this;
        },
        event: function (types, fn) {
          fn = arguments.length > 1 ? fn || true : false;
          types.split(' ').forEach(function (typespace) {
            if (!typespace)
              return;
            var type = Events.fn.type.e(typespace), namespace = Events.fn.type.ns(typespace), events = _.filter(Events.list, function (e, i) {
                e.i = i;
                // check element
                if (e.$el !== this)
                  return;
                return (!type || e.type === type) && (!namespace || e.ns === namespace) && (!fn || e.fn === fn);
              }.bind(this));
            for (var i in events) {
              Events.list.splice(events[i].i, 1);
              this.removeEventListener(events[i].type, events[i].callback);
            }
          }.bind(this));
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
          var n = +Math.random().toString().slice(2, 11), event;
          Events.data[n] = args;
          if (_.isIE) {
            event = document.createEvent(Events.types.list.ref[type] || 'Event');
            event.initEvent(type, true, false);
            event.data = n;
            this.dispatchEvent(event);
          } else {
            event = Events.types.list[type] || CustomEvent;
            this.dispatchEvent(new event(type, {
              bubbles: true,
              detail: n  // pass data reference through detail
            }));
          }
          // delete data reference
          delete Events.data[n];
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
}(framework_util);
framework_el_find = function (_) {
  var Find = {
    fn: {
      init: function () {
        Node.prototype.find = window.find = NodeList.prototype.find = Find.fn.find;
        Node.prototype.parents = NodeList.prototype.parents = Find.fn.parents;
        Node.prototype.path = NodeList.prototype.path = Find.fn.path;
        Node.prototype.closest = NodeList.prototype.closest = Find.fn.closest;
      },
      find: function (selector) {
        if (_.isNodeList(this)) {
          var className = 'f' + (Math.random() * 100000 | 0), matches;
          this.forEach(function ($el) {
            $el.find(selector).forEach(function ($i) {
              $i.classList.add(className);
            });
          });
          var $matches = document.querySelectorAll('.' + className);
          $matches.forEach(function ($i) {
            $i.classList.remove(className);
          });
          return $matches;
        } else {
          var $el = this === window ? document : this;
          return $el.querySelectorAll(selector);
        }
      },
      parents: function (selector) {
        if (_.isNodeList(this)) {
          return this.length > 1 ? _.uniq(this.reduce(function (list, $el) {
            return list.concat($el.parents.call(this, selector));
          }, [])) : this.parents.call(this[0], selector);
        }
        var path = this.path().slice(1);
        return selector ? path.filter(function ($el) {
          return $el.is(selector);
        }) : path;
      },
      path: function (reset) {
        if (_.isNodeList(this)) {
          return this.map(function ($el) {
            return $el.path(reset);
          });
        }
        if (!this.$path || reset) {
          var $el = this;
          this.$path = [];
          for (; $el && $el !== document; $el = $el.parentNode) {
            this.$path.push($el);
          }
        }
        return this.$path.slice();
      },
      closest: function (selector) {
        if (!selector)
          return [];
        if (_.isNodeList(this)) {
          return this.length > 1 ? _.uniq(this.reduce(function (list, $el) {
            return list.concat($el.closest.call(this, selector));
          }, [])) : this.closest.call(this[0], selector);
        }
        return _.find(this.path(), function ($el) {
          return $el.is(selector);
        });
      }
    }
  };
  return Find.fn;
}(framework_util);
framework_el_content = function (_) {
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
        if (_.isNodeList($el)) {
          $el.forEach(function ($i) {
            Content.fn.el($i, position, html);
          });
        } else {
          if (_.isString(html))
            return $el.insertAdjacentHTML(position, html);
        }
      },
      eq: function (i) {
        return this[i];
      },
      is: function (selector) {
        var $list = _.isNodeList(this) ? this : [this];
        return $list.reduce(function (is, $el) {
          return is || (_.isString(selector) ? _.isIE || $el.msMatchesSelector ? $el.msMatchesSelector(selector) : $el.matches(selector) : _.isNodeList(selector) ? selector.is($el) : selector === $el);
        }, false);
      },
      clone: function () {
        if (_.isNodeList(this)) {
          var $fragment = document.createDocumentFragment();
          this.forEach(function ($el) {
            var $clone = $el.cloneNode(true);
            $fragment.appendChild($clone);
          });
          return $fragment.childNodes;
        }
        return this.cloneNode(true);
      },
      val: function (val) {
        return this.prop('value', val);
      },
      prop: function (prop, value) {
        var $list = _.isNodeList(this) ? this : [this];
        if (arguments.length === 1 && _.isString(prop)) {
          value = $list[0] ? $list[0][prop] : undefined;
          return value === 'true' ? true : value === 'false' ? false : value;
        }
        if (_.isString(prop))
          prop = _.object([prop], [value]);
        $list.forEach(function ($el) {
          for (var i in prop)
            $el[i] = prop[i];
        });
        return this;
      },
      before: function (html) {
        Content.fn.el(this, 'beforebegin', html);
        return this;
      },
      after: function (html) {
        Content.fn.el(this, 'afterend', html);
        return this;
      },
      prepend: function (html) {
        Content.fn.el(this, 'afterbegin', html);
        return this;
      },
      append: function (html) {
        Content.fn.el(this, 'beforeend', html);
        return this;
      },
      text: function (text, ishtml) {
        var $list = _.isNodeList(this) ? this : [this];
        if (_.isUndefined(text)) {
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
}(framework_util);
framework_el = function (Attr, ClassList, Events, Find, Content, _) {
  var El = {
    init: function () {
      _.init();
      if (window.jQuery)
        return;
      this.init = _.noop;
      window.$ = function (selector) {
        return _.isString(selector) ? document.querySelectorAll(selector) : selector;
      };
      NodeList.prototype.__proto__ = Array.prototype;
      Attr.init();
      ClassList.init();
      Events.init();
      Find.init();
      Content.init();
    }
  };
  return El;
}(framework_el_attr, framework_el_classlist, framework_el_events, framework_el_find, framework_el_content, framework_util);
framework_xhr = function (_) {
  var XHR = {
    get: function (props) {
      props.type = 'GET';
      props.url = props.url || '';
      if (props.data) {
        props.data = _.isString(props.data) ? props.data : _.serialise(props.data);
        props.url += (props.url.indexOf('?') >= 0 ? '&' : '?') + props.data;
      }
      return this.request(props);
    },
    post: function (props) {
      props.type = 'POST';
      props.url = props.url || '';
      return this.request(props);
    },
    request: function (props) {
      var xhr = new XMLHttpRequest();
      type = props.type || 'GET', callback = function (fn, response, e) {
        if (!_.isFunction(fn))
          return;
        if (!e) {
          e = response;
          response = e.target.response;
        }
        if (_.isString(response) && /\[|\{/.test(response.slice(0, 1)) || !isNaN(response)) {
          try {
            response = JSON.parse(response);
          } catch (e) {
          }
        }
        fn(response, e, xhr);
      };
      xhr.addEventListener('load', function (e) {
        if (e.target.status !== 200)
          callback(props.error, e);
        callback(props.complete, e);
      });
      xhr.addEventListener('progress', function (e) {
        callback(props.progress, e.lengthComputable ? e.loaded / e.total : undefined, e);
      });
      xhr.addEventListener('error', function (e) {
        callback(props.error, e);
      });
      xhr.addEventListener('abort', function (e) {
        callback(props.abort, e);
      });
      xhr.open(type, props.url);
      if (type === 'GET' || !props.data) {
        xhr.send();
      } else {
        if (props.header !== false) {
          xhr.setRequestHeader('Content-Type', props.header || 'application/json;charset=UTF-8');
        }
        xhr.send(_.isString(props.data) ? props.data : JSON.stringify(props.data));
      }
      return xhr;
    }
  };
  return XHR;
}(framework_util);
framework_module = function (Props, El, _, XHR) {
  var Module = {
    extend: function (module) {
      El.init();
      // if name is defined, auto-setup props
      if (module.name) {
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
        console.warn('A view/module is unnamed - it will be unable to communicate:\r', module);
      }
      // retain non-wrapped function list
      Object.defineProperty(module, '_fn', {
        enumerable: false,
        value: _.cloneDeep(module.fn)
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
        if (_.isObject(val) && !_.isFunction(val) && !_.isNodeList(val) && !_.isJquery(val))
          Module.wrap(val, m);
        else if (_.isFunction(val)) {
          // set 'this' to module
          fn[key] = function (e) {
            return val.apply(m, arguments);
          };
        }
      });
      return fn;
    }
  };
  return Module;
}(framework_props, framework_el, framework_util, framework_xhr);
framework_view = function (Module, _) {
  var View = {
    extend: function (view) {
      // extend module
      var module = Module.extend(view);
      if (!view.uid)
        view.uid = _.randomString(16);
      view.bind = View.$el.bind.bind(view);
      view.unbind = View.$el.unbind.bind(view);
      view.autoBind = View.$el.autoBind.bind(view);
      View.$el.set(view);
      // return wrapped function (sets 'this' to module)
      return module;
    },
    $el: {
      set: function (view) {
        view.el = view.el || 'body';
        view.$el = _.isString(view.el) ? $(view.el) : _.isDomSelection(view.el) ? view.el : _.isString(view.el.selector) ? $(view.el.selector) : false;
        if (!view.$el)
          return console.warn('View "' + view.name + '": element is incorrectly defined');
      },
      autoBind: function (route, router) {
        router = router || ':router';
        this.on(router + ':' + (route || this.name), function () {
          (this.fn.render || _.noop).apply(this, arguments);
          this.bind();
        }.bind(this));
        this.on(router + ':before', this.unbind);
      },
      bind: function () {
        if (this.bindings)
          this.unbind();
        // trigger before bind
        this.trigger('prebind');
        this.bindings = [];
        _.each(this.el.bind, function (bind, bindFrom) {
          var $el, binding;
          if (_.isString(bind))
            bind = { selector: bind };
          if (bind.selector) {
            binding = {
              el: $(bind.selector),
              prop: bindFrom,
              selector: bind.selector,
              node: true
            };
            this.set(binding.prop, binding.el, false);
          } else if (_.isObject(bind)) {
            $el = $(bindFrom);
            binding = {
              input: $el.is('input, textarea') || $el.prop('contentEditable') === true,
              prop: bind.to,
              $el: $el,
              selector: bindFrom,
              fn: function (input) {
                binding.$el.forEach(function ($el) {
                  if (binding.current === $el)
                    return;
                  var output = _.isFunction(fn) ? fn(input, $el, true) : input;
                  if (!_.isUndefined(output))
                    $el.prop(bind.set, output);
                });
              }
            };
            bind.set = bind.set || (binding.input ? 'value' : 'textContent');
            var fn = bind.fn ? bind.fn.split(':').reduce(function (fn, method) {
                return _.isObject(fn) ? fn[method] : false;
              }, this.fn) : false, val = _.isUndefined(bind.val) ? this.Props.get(this.name + ':' + binding.prop) || binding.$el.prop(bind.set) : bind.val;
            this.on(binding.prop, binding.fn);
            // set initial value (get === set when a value is passed)
            this.Props.get(this.name + ':' + binding.prop, val, true);
            // two-way bind only
            if (binding.input) {
              this.$el.on(View.$el.event('input change', this), binding.selector, function (e) {
                binding.current = e.target;
                var input = e.target[bind.set], output = _.isFunction(fn) ? fn(input, e.target, false) : input;
                this.set(binding.prop, output);
                binding.current = false;
              }.bind(this));
            }
          }
          if (binding && bind.on) {
            _.each(bind.on, function (fn, event) {
              View.$el.fn(event, binding.selector, fn, this);
            }, this);
          }
          this.bindings.push(binding);
        }, this);
        _.each(this.el.on, function (fn, event) {
          View.$el.fn(event, false, fn, this);
        }, this);
        // trigger after bind
        this.trigger('bind');
      },
      fn: function (event, delegate, fn, view) {
        if (_.isObject(fn) && fn.delegate && fn.fn) {
          delegate = _.isString(delegate) ? delegate + ' ' + fn.delegate : fn.delegate;
          fn = fn.fn;
        }
        if (_.isString(fn))
          fn = fn.split(':').reduce(function (fn, method) {
            return _.isObject(fn) ? fn[method] : false;
          }, view.fn);
        if (_.isFunction(fn)) {
          event = View.$el.event(event, view);
          fn = fn.bind(view);
          if (delegate)
            view.$el.on(event, delegate, fn);
          else
            view.$el.on(event, fn);
        }
      },
      unbind: function () {
        if (!this.bindings)
          return;
        // trigger before unbind
        this.trigger('preunbind');
        this.$el.off('.bind-' + (this.uid || this.name));
        _.each(this.bindings, function (binding) {
          if (binding.node)
            this.unset(binding.prop);
          else
            this.off(binding.prop, binding.fn);
        }, this);
        this.bindings = false;
        // trigger after unbind
        this.trigger('unbind');
      },
      event: function (event, view) {
        return event.replace(/( |$)/g, '.bind-' + (view.uid || view.name) + '$1');
      }
    }
  };
  return View;
}(framework_module, framework_util);
framework_router = function (Module, _) {
  var WarningTemplate = '<% if( obj.missing ){ %>Missing a BASE tag<% }else{ %>BASE tag is incorrect<% } %>. If this is a production site include the following below your <title>:\n<base href="<%= base %>">', Router = {
      extend: function (router) {
        // attach router functions that aren't being overridden
        _.defaultsDeep(router.fn, Router.fn);
        router.start = function () {
          this.fn.start.apply(this, arguments);
        };
        // return wrapped function (sets 'this' to module)
        return Module.extend(router);
      },
      fn: {
        start: function (base, startURL) {
          window.onpopstate = function (e) {
            if (!e.state)
              return;
            this.fn.route.href({
              href: e.state.href,
              replace: true
            });
          }.bind(this);
          // check for a base tag
          var $tag = $('head base'), cookieBase = this._.cookie('base');
          // set the app base url
          this.props.base = base || this.props.base || cookieBase || $tag.attr('href') || window.location.origin;
          // add origin if it doesn't exist
          if (this.props.base.indexOf(location.origin) !== 0)
            this.props.base = location.origin + this.props.base;
          // create $tag if it doesn't exist (and redirects aren't handled by htaccess)
          if (!$tag.length) {
            $('head title').after('<base href="' + this.props.base + '">');
            if (!cookieBase)
              console.warn(_.template(WarningTemplate)({
                base: this.props.base,
                missing: true
              }));
          }  // or update if different
          else if ($tag.attr('href') !== this.props.base) {
            $tag.attr('href', this.props.base);
            if (!cookieBase)
              console.warn(_.template(WarningTemplate)({ base: this.props.base }));
          }
          // set the app title
          this.props.title = $('head title').text();
          // set the routes
          _.each(this.props.routes, this.fn.route.set);
          // listen to changes to href
          this.on('href', this.fn.route.href);
          // listen to all anchor clicks
          $('body').on('click', 'a:not([data-external])', this.fn.anchor);
          // broadcast router start
          this.trigger('start');
          // set current url
          this.set('href', {
            href: startURL || location.href.replace(this.props.base, ''),
            replace: true
          }, true);
        },
        anchor: function (e) {
          // links out of app
          if (e.delegateTarget.href.indexOf(this.props.base) !== 0)
            return;
          var $anchor = e.delegateTarget,
            // href as defined in code (remove first slash)
            href = $anchor.getAttribute('href').replace(/^\//, '');
          // link protocol is http?
          http = $anchor.href.slice(0, 4) === 'http', // link target
          target = $anchor.target || '_self';
          // link opens in a different window, is a hash link, isn't http, or ctrl/cmd pressed
          if (target !== '_self' || href.slice(0, 1) === '#' || !http || e.ctrlKey || e.metaKey)
            return;
          e.preventDefault();
          this.fn.route.href(href);
        },
        route: {
          href: function (options) {
            // convert options
            if (_.isString(options))
              options = { href: options };  // set href to string
            else
              this.set('href', options.href, false);
            var href = options.href, match = [], args, replace, trigger,
              // route and match
              route = _.find(this.props.routes, function (route) {
                match = href.match(route.re);
                for (var i in match)
                  match[i] = isNaN(match[i]) ? match[i] : +match[i];
                return match;
              }) || {};
            // if no route/match found
            if (!match)
              match = [];
            // event arguments
            args = [route.name].concat(match.slice(1));
            // replace url, default false
            replace = options.replace || [
              href,
              this.props.base + href
            ].indexOf(window.location.href) >= 0;
            // trigger events, default true
            trigger = options.trigger !== false;
            // run before route
            if (trigger)
              this.trigger.apply(this, ['before'].concat(args));
            // if no pushstate open url
            if (!window.history.pushState)
              window.open(href, '_self');
            // push or replace state
            if (replace)
              window.history.replaceState({ href: href }, route.title, href);
            else
              window.history.pushState({ href: href }, route.title, href);
            // update the title
            document.title = route.title;
            $('body').attr('data-route', route.name);
            // set current properties
            this.set('current', {
              href: href,
              name: route.name,
              args: match.slice(1)
            }, trigger);
            // run route trigger
            if (trigger)
              this.trigger.apply(this, args);
            // run after route
            if (trigger)
              this.trigger.apply(this, ['after'].concat(args));
          },
          set: function (route, name, routes) {
            // turn route into an object
            if (!_.isObject(route))
              route = { route: route };
            // set the name
            route.name = name;
            // set a title
            route.title = (route.title || name.slice(0, 1).toUpperCase() + name.slice(1)) + (this.props.delimeter || ' | ') + this.props.title;
            route.re = route.re || _.isRegExp(route.route) ? route.route : this.fn.route.re(route.route);
            routes[name] = route;
          },
          re: function (route) {
            var re = {
              optional: /\((.*?)\)/g,
              named: /(\(\?)?:\w+/g,
              path: /\*\w+/g,
              escape: /[\-{}\[\]+?.,\\\^$|#\s]/g
            };
            route = route.replace(re.escape, '\\$&').replace(re.optional, '(?:$1)?').replace(re.named, function (match, optional) {
              return optional ? match : '([^/?]+)';
            }).replace(re.path, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?[\\s\\S]*)?$');
          }
        }
      }
    };
  return Router;
}(framework_module, framework_util);
main = function (View, Module, Router, Props, Util, XHR) {
  var framework = {
    version: '0.1.2',
    View: View,
    Module: Module,
    Router: Router,
    Props: Props,
    _: Util,
    XHR: XHR
  };
  // set to UMD variable (see 'umd-wrapper.js')
  if (typeof UMDfactory !== 'undefined') {
    UMDfactory = framework;
  }
  return framework;
}(framework_view, framework_module, framework_router, framework_props, framework_util, framework_xhr);
}());

	// return main pseudo global method from script
  return UMDfactory;

// defines the library name
}, 'MediumFramework'));