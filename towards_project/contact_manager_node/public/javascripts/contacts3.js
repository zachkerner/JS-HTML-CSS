const tagObj = {tags: ['work', 'school', 'engineering', 'marketing', 'family', 'management']}

class App {
  constructor(contactData) {
    this.contactData = this.parseContactData(contactData)
    this.tags = tagObj
    this.templates = this.initializeTemplates()
    this.renderContacts()
    this.initializeGUI()
  }

  parseContactData(contactData) {
    return contactData.map(contact => {
      if (contact['tags']) {
        contact['tags'] = contact['tags'].split(',')
      }
      return contact
    })
  }

  parseAddFormData(data) {
    let dataObj = {tags: []}
    for (var [key, value] of data.entries()) {
      if (key !== 'tags') {
        dataObj[key] = value
        continue
      }
      dataObj.tags.push(value)
    }
    dataObj.tags = dataObj.tags.join(',')
    return JSON.stringify(dataObj)
  }

  initializeTemplates() {
    let templates = {}
    let scripts = document.querySelectorAll('[type="text/x-handlebars-template"]')
    for (let script of scripts) {
      templates[script.id] = Handlebars.compile(script.innerHTML)
    }
    Handlebars.registerPartial('contact', document.querySelector('#contact_template').innerHTML)
    return templates
  }

  initializeGUI() {
    this.addContact()
    this.deleteContact()
    this.searchTags()
    this.searchNames()
    this.clearSearch()
  }

  clearSearch() {
    $('.clear').on('click', this.resetPage.bind(this))
  }

  resetPage(event) {
    if (event.target.tagName === 'A') {
      event.preventDefault()
    }
    let contacts = $('.contact')
    for (let contact of contacts) {
      $(contact).show()
    }
    let searchVal = $('.search').val('')
  }

  searchNames() {
    $('.search').on('keyup', this.showRelevant.bind(this))
  }

  showRelevant(event) {
    let textValue = $(event.target).val()
    if (!textValue) {
      this.resetPage(event)
    }
    let contacts = $('.contact')
    const regexExp = new RegExp(`.*${textValue}.*`)
    for (let contact of contacts) {
      $(contact).hide()
      let name = $(contact).children('h2').html()
      if (regexExp.test(name)) {
        $(contact).show()
      }
    }

  }

  searchTags() {
    $('.tag_link').on('click', this.searchByTag.bind(this))
  }

  searchByTag(event) {
    event.preventDefault()
    let tag = $(event.target).attr('data-tag')
    let allContacts = $('.contact')
    allContacts.hide()
    let allWithTag = $(`[data-tag=${tag}]`)
    for (let tag of allWithTag) {
      let parentLi = $(tag).parents('li')
      parentLi.show()
    }
  }

  deleteContact() {
    $('.delete').on('click', this.deleteContactFull.bind(this))
  }

  async deleteContactFull(event) {
    event.preventDefault()
    console.log()
    let contactId = $(event.target).parents('li').attr('data-id')
    
    let deleteRequest = await fetch(`http://localhost:3000/api/contacts/${contactId}`, {method: 'DELETE'})
    let response = await deleteRequest.status
    
    this.deleteContactFromData(contactId)
    this.deleteContactFromPage(contactId)
  }

  deleteContactFromData(contactId) {
    this.contactData = this.contactData.filter(contact => Number(contact['id']) !== Number(contactId))
  }

  deleteContactFromPage(contactId) {
    let contact = $(`[data-id=${contactId}]`)
    contact.remove()
  }

  addTagsToContactForm() {
    let $selectMenu = $($.parseHTML(this.templates['tags_template'](this.tags)))
    let $tagsLabel = $('#tags_label')
    $selectMenu.insertAfter($tagsLabel)
  }

  addContact() {
    this.handleAddFormPopup()
    this.handleAddFormCollapse()
    this.addTagsToContactForm()
    this.addContactToAPI()
  }

  addContactToAPI() {
    $('.add_form').on('submit', async event => {
      event.preventDefault()
      let form = event.target
      let data = this.parseAddFormData(new FormData(form))
      let request = await fetch('http://localhost:3000/api/contacts/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: data
      })
      let response = await request.json()
      
      let responseParsed = this.parseContactData([response])[0] //this is an object

      this.addContactToData([responseParsed]) //expects an array
      this.addContactToPage(responseParsed)


      form.reset()
      $('#add_overlay').hide()
    })
  }

  addContactToData(responseParsed) {
    this.contactData = this.contactData.concat(responseParsed)
  }

  addContactToPage(responseParsed) {
    let $contactsList = $('#contacts_list')
    $contactsList.append(this.templates['contact_template'](responseParsed))
  }

  handleAddFormPopup() {
    $('.add_contact').on('click', event => {
      event.preventDefault()
      let addOverlay = document.querySelector('#add_overlay')
      addOverlay.style.display = 'inline-block'
    })
  }

  handleAddFormCollapse() {
    $('#add_overlay').on('click', event => {
      if (event.target.id === 'add_overlay') {
        event.target.style.display = "none"
      }
    })
  }

  renderContacts() {
    this.clearContactsFromPage()
    let contactsUl = document.querySelector('#contacts_list')
    contactsUl.innerHTML = this.templates['contacts_template']({contacts: this.contactData})
  }

  clearContactsFromPage() {
    let contactsUl = document.querySelector('#contacts_list')
    contactsUl.innerHTML = ""
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  let request = await fetch("http://localhost:3000/api/contacts")
  let contactData = await request.json()
  new App(contactData)
})