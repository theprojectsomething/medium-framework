/**

    XHR

**/

define([
  "framework/util"
], function (_) {

  var XHR = {

    get: function (props) {
      props.type = "GET";
      props.url = props.url || "";
      if( props.data ) {
        props.data = _.isString( props.data ) ? props.data : _.serialise( props.data );
        props.url += (props.url.indexOf( '?' ) >= 0 ? '&' : '?') + props.data;
      }

      return this.request( props );
    },

    post: function (props) {
      props.type = "POST";
      props.url = props.url || "";
      return this.request(props);
    },

    request: function (props) {
      var xhr = new XMLHttpRequest()
          type = props.type || "GET",
          callback = function (fn, response, e) {
            if(!_.isFunction( fn )) return;
            if(!e) {
              e = response;
              response = e.target.response;
            }
            if(_.isString( response ) && /\[|\{/.test(response.slice(0, 1)) || !isNaN( response )) {
              try {
                response = JSON.parse( response );
              } catch (e) {}
            }
            fn(response, e, xhr);
          };
      xhr.addEventListener("load", function (e) {
        if( e.target.status!==200 ) callback(props.error, e);
        callback(props.complete, e);
      });
      xhr.addEventListener("progress", function (e) {
        callback(props.progress, e.lengthComputable ? e.loaded / e.total : undefined, e);
      });
      xhr.addEventListener("error", function (e) {
        callback(props.error, e);
      });
      xhr.addEventListener("abort", function (e) {
        callback(props.abort, e);
      });
      xhr.open(type, props.url);

      if( props.headers!==false ){
        _.each(props.headers, function (value, header) {
          xhr.setRequestHeader(header, value);
        });
      }

      if(type === "GET" || !props.data) {
        xhr.send();
      } else {

        /* DEPRECATED FEATURE - THIS SHOULD BE SET TO `props.contentType` OR REMOVED */
        if( props.header!==false ){
          xhr.setRequestHeader("Content-Type", props.header || "application/json;charset=UTF-8");
        }
        xhr.send( _.isString( props.data ) ? props.data : JSON.stringify( props.data ) );
      }

      return xhr;
    }
  };

  
  return XHR;
});