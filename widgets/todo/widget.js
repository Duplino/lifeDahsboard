// To-Do Widget JavaScript
(function() {
    'use strict';

    class TodoWidget {
        constructor(container, settings, size) {
            this.container = container;
            this.settings = settings || {};
            this.size = size || { width: 0, height: 0 };
            this.showCompleted = this.settings.showCompleted !== undefined ? this.settings.showCompleted : true;
            this.sortByDate = this.settings.sortByDate || false;
            this.todos = [];
            this.storageKey = 'widget_todo_data';
            this.init();
        }

        init() {
            this.loadTodos();
            this.renderTodos();
            this.attachEventListeners();
        }

        loadTodos() {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                try {
                    this.todos = JSON.parse(stored);
                } catch (e) {
                    this.todos = this.getDefaultTodos();
                }
            } else {
                this.todos = this.getDefaultTodos();
            }
        }

        getDefaultTodos() {
            return [
                { id: Date.now() + 1, text: 'Complete project documentation', completed: false, created: Date.now() },
                { id: Date.now() + 2, text: 'Review pull requests', completed: true, created: Date.now() },
                { id: Date.now() + 3, text: 'Update team on progress', completed: false, created: Date.now() },
                { id: Date.now() + 4, text: 'Plan next sprint tasks', completed: false, created: Date.now() },
                { id: Date.now() + 5, text: 'Schedule one-on-ones', completed: false, created: Date.now() }
            ];
        }

        saveTodos() {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        }

        renderTodos() {
            const todoList = this.container.querySelector('#todoList, .todo-list');
            if (!todoList) return;

            let todosToDisplay = [...this.todos];

            // Filter completed if needed
            if (!this.showCompleted) {
                todosToDisplay = todosToDisplay.filter(todo => !todo.completed);
            }

            // Sort by date if needed
            if (this.sortByDate) {
                todosToDisplay.sort((a, b) => b.created - a.created);
            }

            todoList.innerHTML = '';
            todosToDisplay.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.className = 'todo-item';
                todoItem.dataset.id = todo.id;
                todoItem.innerHTML = `
                    <input type="checkbox" class="form-check-input" id="todo${todo.id}" ${todo.completed ? 'checked' : ''}>
                    <label class="form-check-label" for="todo${todo.id}" ${todo.completed ? 'style="text-decoration: line-through; color: #999;"' : ''}>
                        ${todo.text}
                    </label>
                    <button class="btn btn-sm btn-link text-danger delete-todo-btn" data-id="${todo.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
                todoList.appendChild(todoItem);
            });
        }

        attachEventListeners() {
            const todoList = this.container.querySelector('#todoList, .todo-list');
            const addBtn = this.container.querySelector('#addTodoBtn');
            const input = this.container.querySelector('#newTodoInput');

            if (todoList) {
                todoList.addEventListener('change', (e) => {
                    if (e.target.matches('input[type="checkbox"]')) {
                        const todoItem = e.target.closest('.todo-item');
                        const id = parseInt(todoItem.dataset.id);
                        this.toggleTodo(id);
                    }
                });

                todoList.addEventListener('click', (e) => {
                    if (e.target.closest('.delete-todo-btn')) {
                        const btn = e.target.closest('.delete-todo-btn');
                        const id = parseInt(btn.dataset.id);
                        this.deleteTodo(id);
                    }
                });
            }

            if (addBtn && input) {
                addBtn.addEventListener('click', () => {
                    const text = input.value.trim();
                    if (text) {
                        this.addTodo(text);
                        input.value = '';
                    }
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const text = input.value.trim();
                        if (text) {
                            this.addTodo(text);
                            input.value = '';
                        }
                    }
                });
            }
        }

        addTodo(text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                created: Date.now()
            };
            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
        }

        toggleTodo(id) {
            const todo = this.todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                this.saveTodos();
                this.renderTodos();
            }
        }

        deleteTodo(id) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.renderTodos();
        }
        
        onResize(size) {
            // Called when the widget is resized
            this.size = size;
        }

        updateSettings(settings) {
            this.settings = settings;
            this.showCompleted = settings.showCompleted !== undefined ? settings.showCompleted : true;
            this.sortByDate = settings.sortByDate || false;
            this.renderTodos();
        }

        destroy() {
            // Cleanup if needed
        }
    }

    // Export to global scope
    window.TodoWidget = TodoWidget;
})();
