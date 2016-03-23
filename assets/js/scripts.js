/**

    Test

**/


MediumFramework.View.extend({

  name: "todo",

  el: {
    selector: ".main",
    bind: {

      "ul.todos": {
        to: "list",
        fn: "on:add",
        set: 'innerHTML',
        val: [],
      },

      ".todos-remain": {
        to: "active",
        fn: "on:active",
        set: 'textContent',
        val: 0
      }

    },

    on: {
      "change.input": {
        delegate: ".todo",
        fn: "on:todo"
      },
      "change.checked": {
        delegate: ".todo-check",
        fn: "on:check"
      },
      "click.remove": {
        delegate: ".remove",
        fn: "on:remove"
      },
      "change.type": {
        delegate: ".todo-type",
        fn: "on:type"
      },
      "click.clear": {
        delegate: ".clear",
        fn: "on:clear"
      }
    }
  },

  props: {},

  fn: {

    init: function () {
      this.bind();
    },

    on: {
      todo: function (e) {
        this.props.list.push({
          value: e.target.value,
          completed: false
        });
        e.target.value = '';
        ++this.props.active;
        this.trigger('list');
      },

      add: function (list) {
        return list.reduce(function (html, todo, i) {
          var show = !this.props.type
            || (this.props.type==="active" && !todo.complete)
            || (this.props.type==="complete" && todo.complete);
          return html + (show ? `
          <li data-index="${i}">
            <input class="todo-check" type="checkbox" id="cb-${i}" ${todo.complete ? 'checked' : ''}>
            <label for="cb-${i}">${todo.value}</label>
            <button class="remove">&times;</button>
          </li>` : '');
        }.bind( this ), '');
      },

      check: function (e) {
        if(this.props.list[ e.target.parentElement.dataset.index ].complete = e.target.checked) {
          --this.props.active;
        }else {
          ++this.props.active;
        }
        if(this.props.type) this.trigger('list');
      },

      remove: function (e) {
        if( !this.props.list.splice(e.target.parentElement.dataset.index, 1)[ 0 ].complete ) {
          --this.props.active;
        }
        this.trigger('list');
      },

      active: function (val) {
        this.$el.attr({
          'data-total': this.props.list.length,
          'data-active': this.props.active,
          'data-complete': this.props.list.length - this.props.active,
        });
        return `${val} items left`;
      },

      type: function (e) {
        this.props.type = e.target.value;
        this.trigger('list');
      },

      clear: function () {
        this.props.list = this.props.list.reduce(function (list, todo) {
          return todo.complete ? list : list.concat(todo);
        }, []);
        this.set('active', this.props.list.length, true);
      }
    }
  }
}).init();