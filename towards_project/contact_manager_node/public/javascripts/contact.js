let app = {
  displayAddForm(event) {
    event.preventDefault()
    let $formDiv = $('.overlay_add')
    $formDiv.show()
  },
  collapseAddForm(event) {
    let $formDiv = $('.overlay_add')
    if ($(event.target).attr('class') === 'overlay_add') {
      $formDiv.hide()
    }
  },
  displayEditForm(event){
    event.preventDefault()
    let $formDiv = $('.overlay_edit')
    let $parentLi = $(event.target).closest('li')
    let id = $parentLi.attr('data-id')
    $formDiv.show()
    //this.populateEditPlaceholderValues(id)
  },
  populateEditPlaceholderValues() {

  },
  collapseEditForm(event) {
    let $formDiv = $('.overlay_edit')
    if ($(event.target).attr('class') === 'overlay_edit') {
      $formDiv.hide()
    }
  },
  getContacts() {
    let request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:3000/api/contacts')
    
    request.addEventListener('load', e => {
      console.log(request.response)
    })
    request.send()
  },
  editContact(event) {
    event.preventDefault()
    let data = this.serializeDataToString(new FormData())
    let id = $(event.target).closest('li').attr('data-id')
    data = `id=${id}&` + data

    let request = new XMLHttpRequest()
    request.open('PUT', `http://localhost:3000/api/contacts/${id}`)

    request.addEventListener('load', event => {
      let obj = JSON.parse(request.response)
      let contact = $(`data-id=${id}`)
      let $fullName = contact.children('.full_name')
      let $phone = contact.children('.phone_number')
      let $email = contact.children('.email')

      $fullName.html(obj['full_name'])
      $phone.html(obj['phone_number'])
      $email.html(obj['email'])
    })

    request.send(data)
  },
  deleteContact(event) {
    event.preventDefault()
    let $parentLi = $(event.target).closest('li')
    let id = $parentLi.attr('data-id')
    
    let request = new XMLHttpRequest()
    request.open('DELETE', `http://localhost:3000/api/contacts/${id}`)

    request.addEventListener('load', event => {
      if (request.status === '204') {
        this.deleteContactFromPage(id)
      }
    })
    request.send()
  },
  addContact(event) {
    event.preventDefault()
    let $formDiv = $('.overlay_add')
    $formDiv.hide()

    let form = document.querySelector('.add_form')
    //let data = this.serializeDataToString(new FormData(form))
    let data = this.serializeDataToObject(new FormData(form))
    let request = new XMLHttpRequest()
    request.open('POST', 'http://localhost:3000/api/contacts/')
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.addEventListener('load', event => {
      
      //this.addContactToPage(response)
      //console.log(request.status)
    })
    request.send(data)
  },
  serializeDataToString(data) {
    let string = ""
    for (var [key, value] of data.entries()) {
      string += `${key}=${encodeURIComponent(value)}&`
    }
    return string.slice(0, string.length - 1)
  },
  serializeDataToObject(data) {
    let obj = {}
    for (var [key, value] of data.entries()) {
      obj[key] = value
    }

    return obj
  },
  addContactToPage(dataObj) {
    let contactTemplate = Handlebars.compile($('#contact_template').html())
    let $contactUl = $('#contacts_list')
    $contactUl.append(contactTemplate(dataObj))
  },
  deleteContactFromPage(id) {
    let $contact = $(`[data-id=${id}]`)
    $contact.remove()
  },
  populateContacts() {
    let request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:3000/api/contacts')
    
    request.addEventListener('load', e => {
      let contacts = JSON.parse(request.response)
      contacts.forEach(contact => {
        let tags = contact['tags'] || ""
        let tagsArr = tags.split(',')
        tagsArr[0] !== "" ? contact['tags'] = tagsArr : contact['tags'] = null
        console.log(contact['tags'])
      })

      let contactsTemplate = Handlebars.compile($('#contacts_template').html())
      Handlebars.registerPartial('contact_template', $('#contact_template').html())
      let $contactsList = $('#contacts_list')
      $contactsList.append(contactsTemplate({contacts: contacts}))
      $('.edit').on('click', this.displayEditForm.bind(this))
      $('.delete').on('click', this.deleteContact.bind(this))
    })
    request.send()
  },
  search(e) {
    let $searchString = $(e.target).val().toLowerCase()
    if (!$searchString) {
      this.populateContacts()
    }
    let request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:3000/api/contacts')

    request.addEventListener('load', event => {
      let data = JSON.parse(request.response)
      let filteredContacts = data.filter(obj => {
        return /$searchString/.test(obj['full_name'].toLowerCase())
      })
      this.clearPage()
      let contactsTemplate = Handlebars.compile($('#contacts_template').html())
      Handlebars.registerPartial('contact_template', $('#contact_template').html())
      let $contactsList = $('#contacts_list')
      $contactsList.append(contactsTemplate({contacts: filteredContacts}))
      $('.edit').on('click', this.displayEditForm.bind(this))
      $('.delete').on('click', this.deleteContact.bind(this))
    })

    request.send()
  },
  clearPage() {
    let $contactsDiv = $('#contacts_list')
    $contactsDiv.html("")
  },
  bindEvents() {
    $('.add').on('click', this.displayAddForm.bind(this))
    $('.overlay_add').on('click', this.collapseAddForm.bind(this))
    $('.add_form').on('submit', this.addContact.bind(this))
    $('.overlay_edit').on('click', this.collapseEditForm.bind(this))
    $('.edit_form').on('submit', this.editContact.bind(this))
    $('#search').on('keypress', this.search.bind(this))
  },
  init() {
    this.bindEvents()
    //this.getContacts()
    this.populateContacts()
    
  }
}


$(function() {
  app.init()
})