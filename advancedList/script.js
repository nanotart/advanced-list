const form = document.querySelector('#new-todo-form')
const todoInput = document.querySelector('#todo-input') // getting the input value
const list = document.querySelector('#list')

const template = document.querySelector('#list-item-template')
const LOCAL_STORAGE_PREFIX = 'ADVANCED_TODO_LIST'
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`
let todos = loadTodos()
todos.forEach(renderTodo)

// Code for checking a todo
list.addEventListener('change', e => {
    if (!e.target.matches('[data-list-item-checkbox]')) return
    
    // e.target in this case is the <input> 
    const parent = e.target.closest('.list-item')
    const todoId = parent.dataset.todoId
    const todo = todos.find(t => t.id === todoId)

    todo.complete = e.target.checked // checked attribute on a type=checkbox
    saveTodos()
})

// Code for deleting a todo
list.addEventListener('click', e => {
    if (!e.target.matches('[data-button-delete]')) return

    const parent = e.target.closest('.list-item')
    const todoId = parent.dataset.todoId

    parent.remove() //deletes this parent
    todos = todos.filter(todo => todo.id !== todoId)
    saveTodos()
})

// Code for adding a todo list item
// User will type in todo and click add todo button. add todo to the list above
form.addEventListener('submit', e => {
    e.preventDefault()

    const todoName = todoInput.value

    // edge case
    if (todoName === "") return

    // create into an object
    const newTodo = {
        name: todoName,
        complete: false, // tracking element
        id: new Date().valueOf().toString() // number of milliseconds in a certain date
    }

    // push to array
    todos.push(newTodo) 
    renderTodo(newTodo)
    saveTodos()
    todoInput.value = ""
})

// Code for graphically rendering a todo
function renderTodo(todo) {

    // get all content inside of the template --> cloneNode()
    const templateClone = template.content.cloneNode(true)
    const textElement = templateClone.querySelector('[data-list-item-text]')
    const listItem = templateClone.querySelector('.list-item') // get the class
    const checkbox = templateClone.querySelector('[data-list-item-checkbox]')

    // set innerText to name
    textElement.innerText = todo.name
    listItem.dataset.todoId = todo.id
    checkbox.checked = todo.complete

    // append to list
    list.appendChild(templateClone)
}

// Code for saving: even if page gets reloaded, the list is saved
function saveTodos() {
    // JSON.stringify for value pair since value must always be a string
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

// Code for loading: loading even after reloaded page
function loadTodos() {
    const todosString = localStorage.getItem(TODOS_STORAGE_KEY)
    // parse string in order to get object (in this case, the array of todos)
    // return an empty array otherwise
    return JSON.parse(todosString) || []
}