const todos = [
  { id: 1, title: 'Homework' },
  { id: 2, title: 'Shopping' },
  { id: 3, title: 'Calling Mom' },
  { id: 4, title: 'Coffee with John '}
];

let app = {
  populateTodos() {
    let todosTemplate = Handlebars.compile($('#todos_template').html())
    let $ul = $('#todos')
    $ul.html(todosTemplate({todos: todos}))
  },
  launchConfirm(event) {
    let todoId = $(event.target).parent().attr('data-id')
    let todo = this.findTodo(todoId)
    let confirmTemplate = Handlebars.compile($('#confirm').html())
    let $divConfirm = $('.confirm_prompt')
    $divConfirm.css('display', 'block')
    $divConfirm.html(confirmTemplate(todo))
    let $divOverlay = $('.overlay')
    $divOverlay.css('display', 'block')
    this.bindEventsOverlay()
  },
  findTodo(todoId) {
    let todo;
    this.todos.forEach(t => {
      if (t.id == todoId) {
        todo = t
      }
    })
    return todo
  },
  bindEventsOverlay() {
    let $divOverlay = $('.overlay')
    let $noButton = $('.confirm_no')
    let $yesButton = $('.confirm_yes')
    
    $divOverlay.click(this.returnToMain.bind(this))
    $noButton.click(this.returnToMain.bind(this))
    $yesButton.click(this.deleteTodo.bind(this))
  },
  returnToMain(event) {
    let $divOverlay = $('.overlay')
    let $divConfirm = $('.confirm_prompt')
    $divOverlay.css('display', 'none')
    $divConfirm.css('display', 'none')
  },
  deleteTodo(event) {
    let todoId = $('.confirm-wrapper').attr('data-id')
    let $todoLi = $(`li[data-id=${todoId}]`)
    $todoLi.remove()
    this.returnToMain(event)
  },
  displayContextmenu(event) {
    let $menu = this.createMenuMarkup()
    $(event.target).append($menu)
    $(document).on('click', this.removeContextMenu.bind(this))
  },
  removeContextMenu(event) {
    if ($(event.target).attr('class') === 'popup') {
      return
    }
    let $menu = $('.popup')
    $menu.remove()
  },
  createMenuMarkup() {
    let $ul = $('<ul>')
    $ul.attr('class', 'popup')
    let $edit = $('<li>Edit Todo</li>')
    let $showDeets = $('<li>Show Details</li>')
    let $delete = $('<li>Delete</li>')
    $ul.append($edit)
    $ul.append($showDeets)
    $ul.append($delete)

    return $ul
  },
  bindEvents() {
    $('li').on('contextmenu', event => {
      event.preventDefault()
      this.displayContextmenu(event)
    })
  },
  init() {
    this.todos = todos;
    this.populateTodos()
    this.bindEvents()
  }
}

$(function() {
  app.init()
})