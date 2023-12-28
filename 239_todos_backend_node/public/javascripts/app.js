"use strict"

class App {
  constructor(todoData) {
    this.todoData = this.formatStartData(todoData)
    this.todoDataCompleted = this.filterCompleted(this.todoData)
    this.templates = this.initializeTemplates()
    this.renderPageAtStart()
    this.initializeGUI()
  }

  initializeTemplates() {
    let templates = {}
    let $templateScripts = $('[type="text/x-handlebars"]')
    let $templateArray = $.makeArray($templateScripts)

    for (let script of $templateArray) {
      templates[script.id] = Handlebars.compile($(`#${script.id}`).html())
    }
    
    let $templatePartials = $('[data-type="partial"]')
    let $partialsArray = $.makeArray($templatePartials)

    for (let partial of $partialsArray) {
      Handlebars.registerPartial(partial.id, $(`#${partial.id}`).html())
    }

    return templates
  }

  initializeGUI() {
    this.popupModal()
    this.handleAdd()
    this.handleEdit()
    this.handleDelete()
    this.handleCheck()
    this.handleSidebars()
  }

  renderPageAtStart() {
    let todosByDate = this.sortTodosByDate(this.todoData)
    let todosByDateCompleted = this.sortTodosByDate(this.todoDataCompleted)

    let dataObj = {
      todos: this.todoData, //corresponds to sidebar header All Todos
      done: this.todoDataCompleted, //corresponds to sidebar header Completed
      current_section: {title: 'All Todos', data: this.todoData.length},
      todos_by_date: todosByDate, //corresponds to sidebar below All Todos
      done_todos_by_date: todosByDateCompleted, //corresponds to sidebar below Completed
      selected: this.todoData //corresponds to main area list
    }

    let $body = $('body')
    $body.html(this.templates['main_template'](dataObj))

    this.checkedToTheBottom()
    $('#all_header').addClass('active')
  }

  popupModal() {
    $('#modal_layer').on('click', this.collapseModal.bind(this))
  }

  collapseModal(event) {
    if ($(event.target).attr('id') === 'modal_layer') {
      this.basicModalCollapse()
      this.fullFormReset()
    }
  }

  basicModalCollapse() {
    $('#modal_layer').hide()
    $('#form_modal').hide()
  }

  basicModalPopup() {
    $('#form_modal').show()
    $('#modal_layer').show()
  }

  fullFormReset() {
    let $form = $('form')
    $form[0].reset()

    this.formPlaceholderReset()
    $form.off()

    let $markComplete = $('button[name="complete"]')
    $markComplete.off()
  }

  formPlaceholderReset() {
    let $title = $('#title')
    $title.attr('placeholder', 'Item 1')
    let $description = $('fieldset textarea')
    $description.attr('placeholder', 'Description')

    let $selecteds =$.makeArray($('option[selected="selected"]'))
    for (let selected of $selecteds) {
      selected.removeAttribute('selected')
    }
  }

  handleAdd() {
    $('label[for="new_item"]').on('click', this.displayModalAdd.bind(this))
  }

  displayModalAdd(event) {
    let $markComplete = $('button[name="complete"]')
    this.basicModalPopup()
    
    $markComplete.on('click', event =>  {
      event.preventDefault()
      alert('Must first create todo.')
    })
    $('form').on('submit', this.createTodo.bind(this))
  }

  async createTodo(event) {
    event.preventDefault()

    let form = event.target
    let data = new FormData(form)
    let parsedData = this.parseAddFormData(data)

    let check = this.validateAddTitle(parsedData.title)

    if (!check) {
      alert('Title must be at least three characters.')
      return
    }

    let options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(parsedData)
    };

    let request = await fetch('http://localhost:3000/api/todos', options)
    let response = await request.json()
    let parsedResponse = this.parseResponseData(response)
    let status = request.status

    if (status === 201)  {
      this.fullFormReset()
      this.addTodoToData(parsedResponse)
      this.addTodoToPage(parsedResponse)
      this.addListenersToNewTodo(parsedResponse)
      this.updateSidebars()
      this.revertToAllPage()
    }
    this.basicModalCollapse()
  }

  revertToAllPage() {
    this.clearActive()
    let $header = $('#all_header')
    $header.addClass('active')
    this.renderMainAllMisc()
  }

  addTodoToData(parsedResponse) {
    this.todoData.push(parsedResponse)
  }

  addTodoToPage(parsedResponse) {
    let $tbody = $('tbody')
    $tbody.append(this.templates['item_partial'](parsedResponse))
    this.checkedToTheBottom()
  }

  addListenersToNewTodo(parsedResponse) {
    let id = parsedResponse.id
    let $todo = $(`tr[data-id=${id}]`)
    let $todoDelete = $todo.find('.delete')
    let $todoCheck = $todo.find('span')
    

    $todo.on('click', 'label', this.popupEditModal.bind(this))
    $todoDelete.on('click', this.deleteTodo.bind(this))
    $todo.on('click', this.checkComplete.bind(this))
  }

  handleDelete() {
    let $deleteButtons = $('.delete')
    $deleteButtons.on('click', this.deleteTodo.bind(this))
  }

  async deleteTodo(event) {
    let $todo = $(event.target).closest('tr')
    let id = $todo.attr('data-id')
    let options = {
      method: 'DELETE'
    }
    let request = await fetch(`http://localhost:3000/api/todos/${id}`, options)
    let status = request.status

    if (status === 204) {
      $todo.remove()
      this.deleteTodoFromData(id)
      this.updateSidebars()
    }
  }

  deleteTodoFromData(id) {
    this.todoData = this.todoData.filter(todo => String(todo.id) !== String(id))
    this.todoDataCompleted = this.filterCompleted(this.todoData)
  }

  handleEdit() {
    let $row = $('main tr')
    $row.on('click', 'label', this.popupEditModal.bind(this))
  }

  popupEditModal(event) {
    event.preventDefault()
    this.basicModalPopup()

    $('form').on('submit', this.editTodo.bind(this))
    $('button[name="complete"]').on('click', this.markComplete.bind(this))

    let id = $(event.target).closest('tr').attr('data-id')
    this.populateFormEdit(id)
  }

  populateFormEdit(id) {
    let todo = this.findTodoById(id)
    let $ul = $('form ul')
    $ul.attr('data-id', todo.id)

    let $title = $('#title')
    $title.attr('placeholder', todo.title)

    if (todo.day) this.populateDate('day', todo.day)
      
    if (todo.month) this.populateDate('month', todo.month)

    if (todo.year) this.populateDate('year', todo.year)
    
    let $description = $('fieldset textarea')
    $description.attr('placeholder', todo.description)
  }

  populateDate(date, todoDate) {
    let $date = $(`#due_${date}`).find(`option[value=${todoDate}]`)
    $date.attr('selected', 'selected')
  }

  async editTodo(event) {
    event.preventDefault()

    let form = event.target
    let data = new FormData(form)
    let id = $('form ul').attr('data-id')
    let parsedData = this.parseEditFormData(data, id)
   
    let check = this.validateEditTitle(parsedData.title)

    if (!check) {
      alert('Title must be at least three characters.')
      return
    }

    let options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
      'Accept': 'application/json'},
      body: JSON.stringify(parsedData)
    };

    let request = await fetch(`http://localhost:3000/api/todos/${id}`, options)
    let response = await request.json()
    let parsedResponse = this.parseResponseData(response)
    
    let status = request.status
    if (status === 200)  {
      this.fullFormReset()
      this.editTodoData(parsedResponse)
      this.editTodoPage(parsedResponse)
      this.checkAndHideDate(id)
      this.updateSidebars()
    }

    this.basicModalCollapse()
  }

  checkAndHideDate(id) {
    let $active = $('.active')

    if ($active.attr('id') === 'all_header' || $active.attr('id') === 'completed_lists') return

    let $activeDate = $active.attr('data-title') 
    let $todoDate = this.findTodoById(id).due_date

    if ($activeDate !== $todoDate) {
      let $todo = $(`tr[data-id=${id}]`)
      $todo.hide()
    }
  }

  editTodoData(parsedResponse) {
    let id = parsedResponse.id
    let prevTodoIdx = this.todoData.findIndex(todo => String(todo.id) === String(id))
    this.todoData[prevTodoIdx] = parsedResponse
  }

  editTodoPage(parsedResponse) {
    let editedTodo= this.templates['item_partial'](parsedResponse)
    $(`tr[data-id=${parsedResponse.id}]`).replaceWith(editedTodo)
    this.addListenersToNewTodo(parsedResponse)
  }

  async markComplete(event) {
    event.preventDefault()
    
    let $elem = $(event.target)
    let id = $('form ul').attr('data-id')
    let data = JSON.stringify({'completed': 'true'})
    
    let options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
      'Accept': 'application/json'},
      body: data
    };

    let request = await fetch(`http://localhost:3000/api/todos/${id}`, options)
    let response = await request.json()
    let status = request.status
    
    if (status === 200) {
      this.fullFormReset()
      this.updateTodoDataCompleted(id)
      this.updatePageCompleted(id)
      this.checkAndHideComplete($elem, id)
      this.updateSidebars()
      this.checkedToTheBottom()
    }
    this.basicModalCollapse()
  }

  updateTodoDataCompleted(id, bool=true) {
    this.todoData.forEach(todo => {
      if (String(todo.id) === String(id)) {
        todo.completed = bool
      }
    })
  }

  updatePageCompleted(id, bool=true) {
    let todoCheckBoxInput = $(`tr[data-id=${id}] input[type='checkbox']`)[0]
    todoCheckBoxInput.toggleAttribute('checked')
    let $tr = $(todoCheckBoxInput).closest('tr')
    let $tbody = $('tbody')
    $tbody.append($tr)
  }

  handleCheck() {
    $('tr').on('click', this.checkComplete.bind(this))
  }

  async checkComplete(event) {
    event.preventDefault()
    
    let $elem = $(event.target)
    if ($elem.is('label')) return
    if ($elem.hasClass('delete')) return
    if ($elem.is('img')) return


    let $todo = $elem.parents('tr')
    let id = $todo.attr('data-id')

    let todoStatus = this.findTodoById(id).completed
    let data;

    if (todoStatus) {
      data = {'completed': 'false'}
    } else {
      data = {'completed': 'true'}
    }
    
    let options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',
      'Accept': 'application/json'},
      body: JSON.stringify(data)
    };

    let request = await fetch(`http://localhost:3000/api/todos/${id}`, options)
    let response = await request.json()
    let status = request.status
    
    if (status === 200) {
      this.fullFormReset()
      this.updateTodoDataCompleted(id, !todoStatus)
      this.updatePageCompleted(id, !todoStatus)
      this.checkAndHideComplete($elem, id)
      this.updateSidebars()
      this.checkedToTheBottom()
    }
  }

  checkAndHideComplete($elem, id) {
    let $todo = $elem.parents('tr')
    let $active = $('.active')
    let $article = $active.parents('article')
    
    if ($active.attr('id') === 'all_done_header') {
      $todo.hide()
    }

    if ($article.attr('id') === 'completed_lists') {
      $todo.hide()
    }
  }

  handleSidebars() {
    $('[data-title]').on('click', this.renderMain.bind(this))
    $('#sidebar').on('click', this.highlightSidebar.bind(this))
  }

  highlightSidebar(event) {
    this.clearActive()
    
    let $elem = $(event.target)

    if ($elem.is('header'))  {
      $elem.addClass('active')
    }
    if ($elem.is('div'))  {
      let header = $elem.find('header')[0]
      $(header).addClass('active')
      this.renderMainAllMisc()
    }
    if ($elem.is('section')) {
      let $header = $elem.find('header')
      $header.addClass('active')
      this.renderMainAllMisc()

    }
    if ($elem.is('dt')) {
      if ($elem.html() === 'Completed' || $elem.html() === 'All Todos') {
        let $header = $elem.parents('header')
        $header.addClass('active')
      } else {
        $elem.parent('dl').addClass('active')
      }
    }
    if ($elem.is('time')) {
      let $dl = $elem.parents('dl')
      $dl.addClass('active')
    }
    if ($elem.is('dl')) {
      if ($elem.attr('data-title')) {
        $elem.addClass('active')
      } else {
        $elem.parent('header').addClass('active')
      }
    }
  }

  renderMain(event) {
    let $elem = $(event.target)
    let titleText = $elem.parents('header').attr('data-title')

    if (titleText === "All Todos" || titleText === "Completed") {
      let $header = $elem.parents('header')
      //$header.addClass('active')
      this.renderMainAreaByCategory($header)
      return
    }

    let $dl = $elem.closest('dl')
    //$dl.addClass('active')
    this.renderMainAreaByCategory($dl)
  }

  renderMainAreaByCategory($elem) {
    this.renderMainAreaHeader($elem)
    let titleText = $elem.attr('data-title')

    this.hideAllTodos()

    if (titleText === 'All Todos') this.renderMainAreaTodosAll()

    if (titleText === 'Completed') this.renderMainAreaTodosCompleted()

    if (titleText) this.renderMainAreaTodosDates($elem, titleText)
  }

  renderMainAreaHeader($elem) {
    let titleText = $elem.attr('data-title')
    let $heading = $('header dt time')
    $heading.html(titleText)
  }

  renderMainAllMisc() {
    let $header = $('#all_header')
    this.showAllTodos()
    this.renderMainAreaHeader($header)
    this.renderMainAreaCount()
  }

  renderMainAreaCount() {
    let $dd = $('#items header dd')
    let count = $('tr:visible').size()
    $dd.html(count)
  }

  renderMainAreaTodosAll() {
    this.showAllTodos()
    this.renderMainAreaCount()
    return
  }

  renderMainAreaTodosCompleted() {
    let $checked = $.makeArray($('input[checked]'))
      for (let check of $checked) {
        $(check).parents('tr').show()
      }
      this.renderMainAreaCount()
      return
  }

  renderMainAreaTodosDates($elem, titleText) {
    let $labels = $.makeArray($('tr label'))
    let $sectionId = $elem.parents('section').attr('id')

    for (let label of $labels) {
      let date = this.parseDate(label)
      let $todo = $(label).parents('tr')

      if (date === titleText) {
        if ($sectionId === 'completed_items') {
          let status = $todo.find('input').attr('checked')
          if (!status) {
            continue
          }
        }
        $todo.show()
        }
      }
      this.renderMainAreaCount()
  }

  showAllTodos() {
    let $todos = $.makeArray($('tr'))
    for (let todo of $todos) {
      $(todo).show()
    }
  }

  updateSidebars() {
    let currentActive = $('.active')[0]
    let dataTitle = $(currentActive).attr('data-title')
    let articleId = $(currentActive).parents('article').attr('id')
    $('[data-title]').off()
    $('#sidebar').off()

    this.todoDataCompleted = this.filterCompleted(this.todoData)
    let todosByDate = this.sortTodosByDate(this.todoData)
    let todosByDateCompleted = this.sortTodosByDate(this.todoDataCompleted)
    
    let $sidebarAllHeader = $('#all_todos')
    let $sidebarCompletedHeader = $('#completed_todos')
    let $sidebarAllLists = $('#all_lists')
    let $sidebarCompletedLists = $('#completed_lists')

    $sidebarAllHeader.html(this.templates['all_todos_template']({todos: this.todoData}))
    $sidebarCompletedHeader.html(this.templates['completed_todos_template']({done: this.todoDataCompleted}))
    $sidebarAllLists.html(this.templates['all_list_template']({todos_by_date: todosByDate}))
    $sidebarCompletedLists.html(this.templates['completed_list_template']({done_todos_by_date: todosByDateCompleted}))

    this.renderMainAreaCount()
    this.handleSidebars()
    this.restoreActive(dataTitle, articleId)
    //console.log($('.active').length)
  }

  restoreActive(dataTitle, articleId) {
    this.clearActive()

    if (dataTitle === 'All Todos') {
      $('#all_header').addClass('active')
      return
    } 

    if (dataTitle === 'Completed') {
      $('#all_done_header').addClass('active')
      return
    } 

    let $targetArr = $.makeArray($(`[data-title]`))
    for (let target of $targetArr) {
      if ($(target).attr('data-title') === dataTitle)  {
        let $articleId = $(target).parents('article').attr('id')
        if ($articleId === articleId) {
          $(target).addClass('active')
          return
        }
        
      }
    }
  }

  clearActive() {
    let $activeArr = $.makeArray($('.active'))
    for (let active of $activeArr) {
      $(active).removeClass('active')
    }
  }

  hideAllTodos() {
    let $todos = $.makeArray($('tr'))
    for (let todo of $todos) {
      $(todo).hide()
    }
  }

  checkedToTheBottom() {
    let $checked = $('tr input[checked]')
    let $checkedArr = $.makeArray($checked)
    let $checkedSpan = $('span.check')
    let $checkedSpanArr = $.makeArray($checkedSpan)
    let $tbody = $('tbody')

    for (let $check of $checkedArr) {
      let $tr = $check.closest('tr')
      $tbody.append($tr)
    }

    // for (let $check of $checkedSpanArr) {
    //   let $tr = $check.closest('tr')
    //   $tbody.append($tr)
    // }
  }

  formatStartData(todoArr) {
    return todoArr.map(todo => this.parseResponseData(todo))
  }

  parseAddFormData(formData) {
    let dataObj = {completed: 'false'}
    for (let [key, value] of formData.entries()) {
      if (value) {
        dataObj[key] = value
      }
    }

    dataObj['day'] === 'Day' ? delete dataObj['day'] : dataObj['day']
    dataObj['month'] === 'Month' ? delete dataObj['month'] : dataObj['month']
    dataObj['year'] === 'Year' ? delete dataObj['year'] : dataObj['year']

    if (!dataObj['month'] || !dataObj['year']) {
      delete dataObj['day']
      delete dataObj['month']
      delete dataObj['year']
    }

    return dataObj
  }

  parseEditFormData(formData, id) {
    let prevData =  this.findTodoById(id)
    let dataObj = {}
    for (let [key, value] of formData.entries()) {
      if (value) {
        dataObj[key] = value
      }
    }

    if (dataObj['day'] === 'Day' && prevData.day) {
      dataObj['day'] = "00"
    }

    if (dataObj['month'] === 'Month' && prevData.month) {
      dataObj['month'] = "00"
    }

    if (dataObj['year'] === "Year" && prevData.year) {
      dataObj['year'] = "0000"
    }

    dataObj['day'] === 'Day' ? delete dataObj['day'] : dataObj['day']
    dataObj['month'] === 'Month' ? delete dataObj['month'] : dataObj['month']
    dataObj['year'] === 'Year' ? delete dataObj['year'] : dataObj['year']

    if (!dataObj['month'] || !dataObj['year']) {
      delete dataObj['month']
      delete dataObj['year']
    }

    return dataObj

  }

  parseResponseData(response) {
    let dateDue;

    if (response.month === "00" || response.year === "0000") {
      dateDue = 'No Due Date'
    } else if (!response.month || !response.year) {
      dateDue = 'No Due Date'
    } else {
      dateDue = `${response.month}/${response.year.slice(2)}`
    }

    return {id: response.id, title: response.title, 
      completed: response.completed, 
      due_date: dateDue,
      description: response.description,
      day: response.day,
      month: response.month,
      year: response.year}
  }

  filterCompleted(todoData) {
    return todoData.filter(todo => todo['completed'] === true)
  }

  parseDate(label) {
    let text = $(label).html()
    let date = text.split('-')[1].trim()
    return date
  }

  findTodoById(id) {
    return this.todoData.filter(todo =>  String(todo.id) === id)[0]
  }

  sortTodosByDate(data) {
    let dataCopySorted = [...data].sort((a, b) => {
      if (a.year !== b.year) {
        return Number(a.year) - Number(b.year)
      }
      return Number(a.month) - Number(b.month)     
    })
    
    let dataObj = {}

    dataCopySorted.forEach(todo => {
      dataObj[todo.due_date] ? dataObj[todo.due_date].push(todo) : dataObj[todo.due_date] = [todo]
    })
  
    return dataObj
  }

  validateAddTitle(title) {
    return title && title.length >= 3
  }

  validateEditTitle(title) {
    if (!title) return true

    return title.length >= 3
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  //let reset = await fetch('http://localhost:3000/api/reset')
  let request = await fetch("http://localhost:3000/api/todos")
  let todoData = await request.json()
  
  new App(todoData)
})


