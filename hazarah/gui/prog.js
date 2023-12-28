const languages = [
  {
    name: 'Ruby',
    description: 'Ruby is a dynamic, reflective, object-oriented, ' +
    'general-purpose programming language. It was designed and developed in the mid-1990s ' +
    'by Yukihiro Matsumoto in Japan. According to its creator, Ruby was influenced by Perl, ' +
    'Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, ' +
    'including functional, object-oriented, and imperative. It also has a dynamic type ' +
    'system and automatic memory management.'
  },

  {
    name: 'JavaScript',
    description: 'JavaScript is a high-level, dynamic, untyped, and interpreted ' +
    'programming language. It has been standardized in the ECMAScript language ' +
    'specification. Alongside HTML and CSS, JavaScript is one of the three core ' +
    'technologies of World Wide Web content production; the majority of websites employ ' +
    'it, and all modern Web browsers support it without the need for plug-ins. JavaScript ' +
    'is prototype-based with first-class functions, making it a multi-paradigm language, ' +
    'supporting object-oriented, imperative, and functional programming styles.'
  },

  {
    name: 'Lisp',
    description: 'Lisp (historically, LISP) is a family of computer programming languages ' +
    'with a long history and a distinctive, fully parenthesized prefix notation. ' +
    'Originally specified in 1958, Lisp is the second-oldest high-level programming ' +
    'language in widespread use today. Only Fortran is older, by one year. Lisp has changed ' +
    'since its early days, and many dialects have existed over its history. Today, the best '+
    'known general-purpose Lisp dialects are Common Lisp and Scheme.'
  }
];

let app = {
  displayLanguages() {
    let $bigDiv = $('#languages')
    this.languages.forEach(language => {
      $bigDiv.append(this.createMarkup(language))
    })
  },
  createMarkup(language) {
    let $div = $('<div>')
    $div.attr('class', 'lang').attr('id', language.name)
    let $h2 = $('<h2>')
    $h2.html(language.name)
    let $p = $('<p>')
    let slice120 = language.description.slice(0, 120) + " ..."
    $p.html(slice120)
    let $a = $('<a>')
    $a.html('Show more')
    $a.attr('class', 'more')

    $div.append($h2)
    $div.append($p)
    $div.append($a)
    return $div
  },
  toggleShow(event) {
    let $a = $(event.target)
    let language = $a.parent().attr('id')
    let fullText = this.getText(language)
    let $p = $a.prev()

    if ($a.html() === 'Show more') {
      $a.html('Show less')
      $p.html(fullText)
      return
    }

    if ($a.html() === 'Show less') {
      $a.html('Show more')
      $p.html(fullText.slice(0, 120) + " ...")
      return
    }
  },
  getText(language) {
    let text;
    this.languages.forEach(lang => {
      if (lang.name === language) {
        text = lang.description
      }
    })
    return text
  },
  bindEvents() {
    $('a').click(this.toggleShow.bind(this))
  },
  init() {
    this.languages = languages
    this.displayLanguages()
    this.bindEvents()
  }
}

$(function() {
  app.init()
})