MediumFramework.View.extend({

  name: "docs-content",

  el: {
    selector: ".content",

    on: {

      "click.show": {
        delegate: "[data-show]",
        fn: "on:show",
      }

    }
  },

  props: {},

  fn: {

    init: function () {
      this.bind();
    },

    on: {
      
      show: function (e) {
        $(e.target.dataset.show).toggleClass('hidden');
      }
    }
  }
}).init();