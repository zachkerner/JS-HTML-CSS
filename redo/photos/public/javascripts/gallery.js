class App {
  constructor(photoData, commentsData) {
    this.photoData = photoData
    this.commentsData = commentsData
    this.templates = this.initializeTemplates()
    this.renderPhotos()
    this.renderComments("1")
    this.bindEvents()
  }

  bindEvents() {
    $('.next').on('click', this.nextPhoto.bind(this))
    $('.previous').on('click', this.prevPhoto.bind(this))
    $('.like').on('click', this.likePhoto.bind(this))
    $('.favorite').on('click', this.favoritePhoto.bind(this))
    $('#comments form').on('submit', this.submitComment.bind(this))
  }

  initializeTemplates() {
    let templates = {}
    let scripts = document.querySelectorAll('[type="text/x-handlebars"]')

    for (let script of scripts) {
      templates[script.id] = Handlebars.compile(script.innerHTML)
    }

    Handlebars.registerPartial('photo_comment', document.querySelector('#photo_comment').innerHTML)

    return templates
  }

  serializeCommentForm(data) {
    let strDataArr = []
    for (let [key, value] of data.entries()) {
      strDataArr.push(`${key}=${encodeURIComponent(value)}`)
    }
    return strDataArr.join('&')
  }

  async submitComment(event) {
    event.preventDefault()
    let form = event.target
    let serializedData = this.serializeCommentForm(new FormData(form))
    form.reset()

    let request = await fetch('http://localhost:3000/comments/new', {
      method: "POST",
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      body: serializedData
    })
    let response = await request.json()
    
    this.renderNewComment(response)
  }

  renderNewComment(data) {
    let commentsList = document.querySelector('#comments ul')
    let HTML = this.templates['photo_comment'](data)
    let newCommentElement = $($.parseHTML(HTML))
    $(commentsList).append(newCommentElement)
  }

  async likePhoto(event) {
    event.preventDefault()
    let likeButton = event.target
    let id = $(likeButton).attr('data-id')
    let request = await fetch('http://localhost:3000/photos/like',
     {method: 'POST',
     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, 
     body: "photo_id=" + id
    })
    let response = await request.json()
    
    likeButton.textContent = `♡ ${response['total']} Likes`
  }

  async favoritePhoto(event) {
    event.preventDefault()
    let favoriteButton = event.target
    let id = $(favoriteButton).attr('data-id')
    let request = await fetch('http://localhost:3000/photos/favorite', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      body: 'photo_id=' + id
    })
    let response = await request.json()

    favoriteButton.textContent = `☆ ${response['total']} Favorites`
  }

  findNextPrevId(currentId, bool) {
    let idArray = this.createOrderedIdArray()
    let currentIdIdx;
    for (let i = 0; i < idArray.length; i ++) {
      if (idArray[i] === currentId) {
        currentIdIdx = i
      }
    }

    let nextId = idArray[currentIdIdx + 1] || idArray[0]
    let prevId = idArray[currentIdIdx - 1] || idArray[idArray.length - 1]

    return bool ? nextId : prevId
  }

  findIdFromElement(element) {
    return Number($(element).attr('data-id'))
  }

  switchPhotoFromId(nextId, currentPhoto) {
    let nextPhoto = $(`[data-id=${nextId}]`)
    nextPhoto.insertBefore($(currentPhoto))
    this.renderComments(nextId)
  }

  nextPhoto(event) {
    event.preventDefault()
    let currentPhoto = document.querySelector('#slides figure')
    let currentId = this.findIdFromElement(currentPhoto)
    let nextId = this.findNextPrevId(currentId, true)
    
    this.switchPhotoFromId(nextId, currentPhoto)
  }

  prevPhoto(event) {
    event.preventDefault()
    let currentPhoto = document.querySelector('#slides figure')
    let currentId = this.findIdFromElement(currentPhoto)
    let prevId = this.findNextPrevId(currentId, false)

    this.switchPhotoFromId(prevId, currentPhoto)
  }

  createOrderedIdArray() {
    let orderedArray = []
    this.photoData.forEach(photo => orderedArray.push(photo['id']))

    return orderedArray.sort((a, b) => a - b)
  }

  renderPhotos() {
    let slideDiv = document.querySelector('#slides')
    slideDiv.innerHTML = this.templates['photos']({photos: this.photoData})
    this.renderPhotoInformation('1')
  }

  renderPhotoInformation(id) {
    let photoDiv = document.querySelector('section > header')
    let matchingPhoto = this.photoData.find(photo => photo['id'] === Number(id))
    photoDiv.innerHTML = this.templates['photo_information'](matchingPhoto)
  }

  renderComments(id) {
    let commentsDivUl = document.querySelector('#comments ul')
    let matchingComments = []
    
    for (let comment of this.commentsData) {
      if (comment['photo_id'] === Number(id)) {
        matchingComments.push(comment)
      }
    }
    commentsDivUl.innerHTML = this.templates['photo_comments']({comments: matchingComments})
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  let photoRequest = await fetch('http://localhost:3000/photos')
  let photoData = await photoRequest.json()
  let commentData = []
  for (let photo of photoData) {
    let id = photo['id']
    let commentRequest = await fetch(`http://localhost:3000/comments?photo_id=${id}`)
    let commentDataSingle = await commentRequest.json()
   
    commentData.push(commentDataSingle)
  }

  new App(photoData, commentData.flat())
})