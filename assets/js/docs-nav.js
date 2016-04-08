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
          var text = $el.textContent.replace(/ \(.*$/, '');
          $el.id = $el.id || text.replace(/^_/, 'utility')
                       .replace(/(^\$)|(\( ?)|( ?\))/g, '')
                       .replace(/[^$\w]+/g, '-')
                       .toLowerCase();
          return html + `
          <li>
            <a href="#${$el.id}" class="tag-${$el.tagName}">${text}</a>
          </li>`;
        }.bind( this ), '');
      }
    }
  }
}).init();