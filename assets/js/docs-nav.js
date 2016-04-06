MediumFramework.View.extend({

  name: "docs-nav",

  el: {
    selector: ".nav .menu",

    bind: {

      ".menu ol": {
        to: "$el:list",
        fn: "on:add",
        set: 'innerHTML',
      },

      "$el:list": '[data-nav]'

    }
  },

  props: {},

  fn: {

    init: function () {
      this.bind();

      this.trigger('$el:list');
    },

    on: {
      
      add: function (list) {
        return list.reduce(function (html, $el) {
          $el.id = $el.textContent.replace(/\W+/g, '-').toLowerCase();
          return html + `
          <li>
            <a href="#${$el.id}">${$el.textContent.replace(/ \(.*$/, '')}</a>
          </li>`;
        }.bind( this ), '');
      }
    }
  }
}).init();