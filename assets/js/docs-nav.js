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

      ".menu [name='search']": {
        to: "search",
      },

      "$el:list": '[data-nav]',
      "$el:search": '.menu [name="search"]',
      "$el:reset": ".search--reset"
    }
  },

  props: {},

  fn: {

    init: function () {
      this.bind();

      this.trigger('$el:list');
      this.on("search", this.fn.on.search);
      this.props.$el.reset.on("click", this.fn.on.reset);
    },

    on: {
      
      add: function (list) {
        this.props.items = [];
        return list.reduce(function (html, $el) {
          var text = $el.textContent.replace(/ \(.*$/, '');
              $el.id = $el.id || text.replace(/^_/, 'utility')
                       .replace(/^\$[(.]/, 'dom-')
                       .replace(/(\( ?)|( ?\))/g, '')
                       .replace(/[^$\w]+/g, '-')
                       .replace(/(^-+)|(-+$)/g, '')
                       .toLowerCase(),
              search = text.replace(/\b(the|and|or)\b\W/g, '') + " " + ($el.getAttribute("data-search") || "");
          
          this.props.items.push({
            search: search.toLowerCase(),
            id: $el.id,
            $el: $el.parentElement
          });

          return html + `
          <li class="tag-${$el.tagName}">
            <a href="#${$el.id}">${text}</a>
          </li>`;
        }.bind( this ), '');
      },

      search: function (search) {
        if(search.length < 2) search = false;

        $('.search--match, .search--nomatch').removeClass('search--match search--nomatch');

        var matches = 0;
        if(search) {
          this.props.items.forEach(function (item) {
            if(item.search.indexOf(search.toLowerCase())<0) {
              item.$el.addClass('search--nomatch');
              $('.menu [href="#' + item.id + '"]')[0].parentElement.addClass('search--nomatch');
            } else {
              item.$el.addClass('search--match');
              var $el = item.$el;
              while($el) {
                $el.removeClass('search--nomatch');
                $el = $el.parentElement;
              }
              ++matches;
            }
          });
        }

        this.props.$el.search.eq(0).parentNode.attr('data-matches', search ? matches : -1);
        $('body').toggleClass('search', matches);
      },

      reset: function () {
        this.props.$el.search.val('').trigger('change');
      }
    }
  }
}).init();