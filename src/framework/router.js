/**

    Router Utility

**/

define([
  "framework/module",
  "framework/util",
], function (Module, _) {

  var WarningTemplate = '<% if( obj.missing ){ %>Missing a BASE tag<% }else{ %>BASE tag is incorrect<% } %>. If this is a production site include the following below your <title>:\n<base href="<%= base %>">',
  
  Router = {

    extend: function (router) {

      // attach router functions that aren't being overridden
      _.defaultsDeep(router.fn, Router.fn);

      router.start = function () {
        this.fn.start.apply(this, arguments);
      };

      // return wrapped function (sets 'this' to module)
      return Module.extend( router );
    },

    fn: {

      start: function (base, startURL) {
        window.onpopstate = function (e) {
          if( !e.state ) return;

          this.fn.route.href({
            href: e.state.href,
            replace: true
          });
        }.bind( this );

        // check for a base tag
        var $tag = $('head base');

        // set the app base url
        this.props.base = base || this.props.base || $tag.attr( 'href' ) || window.location.origin;

        // create $tag if it doesn't exist
        if( !$tag.length ) {
          $('head title').after('<base href="' + this.props.base + '">');
          console.warn(_.template( WarningTemplate )({base: this.props.base, missing: true}));
        }

        // or update if different
        else if($tag.attr( 'href' )!==this.props.base){
          $tag.attr('href', this.props.base);
          console.warn(_.template( WarningTemplate )({base: this.props.base}));
        }

        // set the app title
        this.props.title = $('head title').text();

        // set the routes
        _.each(this.props.routes, this.fn.route.set);

        // listen to changes to href
        this.on("href", this.fn.route.href);

        // listen to all anchor clicks
        $('body').on("click", "a:not([data-external])", this.fn.anchor);

        // broadcast router start
        this.trigger( "start" )

        // set current url
        this.set("href", {
          href: startURL || location.href.replace(this.props.base, ""),
          replace: true
        }, true);
      },

      anchor: function (e) {


        var $anchor = e.target;

        // links out of app
        if(e.target.href.indexOf( this.props.base )!==0) return;

        var $anchor = e.target,

        // href as defined in code (remove first slash)
        href = $anchor.getAttribute( 'href' ).replace(/^\//, "");
        
        // link protocol is http?
        http = $anchor.href.slice(0, 4)==="http",

        // link target
        target = $anchor.target || "_self";
        
        // link opens in a different window, is a hash link, isn't http, or ctrl/cmd pressed
        if(target!=="_self" || href.slice(0, 1)==="#" || !http || e.ctrlKey || e.metaKey) return;
        
        e.preventDefault();
        this.fn.route.href( href );
      },

      route: {

        href: function (options) {

          // convert options
          if(_.isString( options )) options = {href: options};

          // set href to string
          else this.set("href", options.href, false);

          var href = options.href,
          match = [], args, replace, trigger,

          // route and match
          route = _.find(this.props.routes, function (route) {
            match = href.match( route.re );
            for(var i in match) match[ i ] = isNaN( match[ i ] ) ? match[ i ] : +match[ i ];
            return match;
          }) || {};

          // if no route/match found
          if( !match ) match = [];

          // event arguments
          args = [route.name].concat(match.slice( 1 ));

           // replace url, default false
          replace = options.replace || [href, this.props.base + href].indexOf(window.location.href)>=0;

          // trigger events, default true
          trigger = options.trigger!==false;

          // run before route
          if( trigger ) this.trigger.apply(this, ["before"].concat( args ));

          // if no pushstate open url
          if( !window.history.pushState ) window.open(href, '_self');

          // push or replace state
          if( replace ) window.history.replaceState({href: href}, route.title, href);
          else window.history.pushState({href: href}, route.title, href);

          // update the title
          document.title = route.title;

          $('body').attr('data-route', route.name);
          
          // set current properties
          this.set("current", {
            href: href,
            name: route.name,
            args: match.slice( 1 )
          }, trigger);

          // run route trigger
          if( trigger ) this.trigger.apply(this, args);

          // run after route
          if( trigger ) this.trigger.apply(this, ["after"].concat( args ));
        },

        set: function (route, name, routes) {
          
          // turn route into an object
          if(!_.isObject( route )) route = { route: route };

          // set the name
          route.name = name;
          
          // set a title
          route.title = (route.title || name.slice(0, 1).toUpperCase() + name.slice( 1 )) + (this.props.delimeter || " | ") + this.props.title;

          route.re = route.re || _.isRegExp( route.route ) ? route.route : this.fn.route.re( route.route );

          routes[ name ] = route;
        },

        re: function (route) {
          var re = {
            optional: /\((.*?)\)/g,
            named: /(\(\?)?:\w+/g,
            path: /\*\w+/g,
            escape: /[\-{}\[\]+?.,\\\^$|#\s]/g
          };

          route = route.replace(re.escape, '\\$&')
                  .replace(re.optional, '(?:$1)?')
                  .replace(re.named, function (match, optional) {
                    return optional ? match : '([^/?]+)';
                  })
                  .replace(re.path, '([^?]*?)');
          return new RegExp('^' + route + '(?:\\?[\\s\\S]*)?$');
        }
      }

    }
  };

  return Router;
});