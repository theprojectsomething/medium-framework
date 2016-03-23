/**
 * A simple To-Do App
 */

MediumFramework.View.extend({

  name: "todo",
  
  // the view element   
  el: {
    selector: ".main",
    
    // binds elements to properties
    bind: {
       
      "ul.todos": {
        to: "list",
        val: [],
        fn: "on:add",
        set: 'innerHTML',
      },
      
      // binds an element 
      ".todos-remain": {
                
        // to a prop with an initial value
        to: "active",
        val: 0,
        
        // runs a method whenever the prop changes
        fn: "on:active",
        
        // and then updates the innerHTML
        set: 'textContent',
      },
      
      // alternatively binds a prop to an element
      "$el:todos": ".todos"
    },
    
    // listens to events    
    on: {
      "change.input": {
        delegate: ".todo",
        fn: "on:todo"
      },
      
      // on an event (possibly namespaced)      
      "change.checked": {
        
        // looks for a delegate         
        delegate: "input[type='checkbox']",
        
        // then runs a method        
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

  // anything defined here fires an event when it changes   
  props: {},
  
  // all our methods, scope is always bound to the view   
  fn: {

    init: function() {
      
      // turn the listeners on      
      this.bind();
      
    },
    
    // any naming conventions are allowed inside fn     
    on: {
      
      // this method fires on an input change event
      todo: function(e) {
        
        // it adds something to a list        
        this.props.list.push({
          value: e.target.value,
          completed: false
        });
        
        // resets the input value         
        e.target.value = '';
        
        // updates an active count (trigggering another method)    
        ++this.props.active;
        
        // and manually triggers another event (push isn't considered a change)         
        this.trigger('list');
        
        // the above has rendered the list, now we scroll it to the bottom
        this.props.$el.todos[ 0 ].scrollTop = this.props.$el.todos[ 0 ].scrollHeight;
      },

      add: function(list) {
        return list.reduce(function(html, todo, i) {
          var show = !this.props.type ||
            (this.props.type === "active" && !todo.complete) ||
            (this.props.type === "complete" && todo.complete);
          return html + (show ? `
          <li data-index="${i}">
            <input type="checkbox" id="cb-${i}" ${todo.complete ? 'checked' : ''}>
            <label for="cb-${i}">${todo.value}</label>
            <button class="remove">&times;</button>
          </li>` : '');
        }.bind(this), '');
      },

      check: function(e) {
        if (this.props.list[e.target.parentElement.dataset.index].complete = e.target.checked) {
          --this.props.active;
        } else {
          ++this.props.active;
        }
        if (this.props.type) this.trigger('list');
      },

      remove: function(e) {
        if (!this.props.list.splice(e.target.parentElement.dataset.index, 1)[0].complete) {
          --this.props.active;
        }
        this.trigger('list');
      },

      active: function(val) {
        this.$el.attr({
          'data-total': this.props.list.length,
          'data-active': this.props.active,
          'data-complete': this.props.list.length - this.props.active,
        });
        if( !this.props.list.length ) {
          this.$el.find('input').eq(0).focus(); 
        }
        return `${val} items left`;
      },

      type: function(e) {
        this.props.type = e.target.value;
        this.trigger('list');
      },

      clear: function() {
        this.props.list = this.props.list.reduce(function(list, todo) {
          return todo.complete ? list : list.concat(todo);
        }, []);
        this.set('active', this.props.list.length, true);
      }
    }
  }
}).init();