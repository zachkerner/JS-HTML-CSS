class App {
  constructor(contacts) {
    this.contacts = this.processContactData(contacts)
    this.templates = this.initializeTemplates()

    this.renderContacts()
    this.initializeGUI()
  }

  processContactData(contactsArr) {
    let processedArr = contactsArr.map(contactObj => {
      if (!contactObj['tags']) return contactObj

      contactObj['tags'] = "#" + contactObj['tags'].split(',').join(' #')
      return contactObj
    })

    return processedArr
  }

  initializeTemplates() {
    let templatesObj = {}
    let templatesHTML = document.querySelectorAll('[type="text/x-handlebars-template"]')
    for (let template of templatesHTML) {
      templatesObj[template.id] = Handlebars.compile(template.innerHTML)
    }
    Handlebars.registerPartial('contact', document.querySelector('#contact_template').innerHTML)
    return templatesObj
  }

  renderContacts(arr=this.contacts) {
    console.log('triggered')
    let $existingContacts = $('.contact')
    for (let $contact of $existingContacts) {
      $contact.remove()
    }

    let ul = document.querySelector('#contacts_list')
    ul.innerHTML = this.templates['contacts_template']({contacts: arr})
  }

  initializeGUI() {
    //this.clearEventHandlers()
    this.addFormPopup()
    this.addContact()
    this.handleDelete()
    this.handleSearch()
  }

  handleSearch() {
    let searchBar = document.querySelector('#search')
    searchBar.addEventListener('keyup', event => {
      let searchTerm = event.target.value
      let regex = new RegExp(`^.*${searchTerm}.*$`, 'i')
      let filteredContacts = this.contacts.filter(contact => {
        return regex.test(contact['full_name'])
      })
      console.log(filteredContacts)
      this.renderContacts(filteredContacts)
      this.initializeGUI()
    })

  }

  clearEventHandlers() {
    let elements = document.querySelectorAll('*')
    for (let element of elements) {
      element.removeEventListener()
    }
  }

  handleDelete() {
    $('.delete').on('click', this.deleteContact.bind(this))
  }

  async deleteContact(event) {
    event.preventDefault()

    console.log(event.target)
    
    let id = $(event.target).closest('li').attr('data-id')
    let response = await fetch(`http://localhost:3000/api/contacts/${id}`, {method: 'DELETE'})
    let status = await response.status

    this.contacts = this.contacts.filter(contact => {
      return Number(contact['id']) !== Number(id)
    })
    this.renderContacts()
    this.initializeGUI()
  }

  addContact() {
    let $form = $('.add_form')
    $form.on('submit', this.submitData.bind(this))
  }

  async submitData(event) {
    event.preventDefault()
    let form = document.querySelector('.add_form')
    let obj = {}
    let data = new FormData(form)
    for (var [key, val] of data.entries()) {
      obj[key] = val
    }
    let object = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      body: JSON.stringify(obj)
    }

    let response = await fetch('http://localhost:3000/api/contacts', object)
    let contact = await response.json()

    let processedContact = this.processContactData([contact])

    this.contacts.push(processedContact[0])
    this.renderContacts()
    this.initializeGUI()
    $('.overlay_add').hide()
    form.reset()

  }

  addFormPopup() {
    let $addContact = $('.add')
    let $formDiv = $('.overlay_add')

    $addContact.on('click', this.showForm.bind(this))
    $formDiv.on('click', this.collapseForm.bind(this))
  }

  showForm(event) {
    let $formDiv = $('.overlay_add')
    $formDiv.show()
  }

  collapseForm(event) {
    if (event.target.classList.contains('overlay_add')) {
      $(event.target).hide()
    }
  }

}

document.addEventListener('DOMContentLoaded', async () => {
  let response = await fetch('http://localhost:3000/api/contacts', {method: 'GET'})
  let contacts = await response.json()

  new App(contacts)
})