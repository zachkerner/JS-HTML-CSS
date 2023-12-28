const languages = [
  {
    name: 'Ruby',
    id: '1',
    description: 'Ruby is a dynamic, reflective, object-oriented, ' +
    'general-purpose programming language. It was designed and developed in the mid-1990s ' +
    'by Yukihiro Matsumoto in Japan. According to its creator, Ruby was influenced by Perl, ' +
    'Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, ' +
    'including functional, object-oriented, and imperative. It also has a dynamic type ' +
    'system and automatic memory management.'
  },

  {
    name: 'JavaScript',
    id: '2',
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
    id: '3',
    description: 'Lisp (historically, LISP) is a family of computer programming languages ' +
    'with a long history and a distinctive, fully parenthesized prefix notation. ' +
    'Originally specified in 1958, Lisp is the second-oldest high-level programming ' +
    'language in widespread use today. Only Fortran is older, by one year. Lisp has changed ' +
    'since its early days, and many dialects have existed over its history. Today, the best '+
    'known general-purpose Lisp dialects are Common Lisp and Scheme.'
  },
  {
    name: 'PHP',
    id: '4',
    description: 'PHP is a general-purpose scripting language geared toward web development.' +
    'It was originally created by Danish-Canadian programmer Rasmus Lerdorf in 1993 and released in 1995.' +
     'The PHP reference implementation is now produced by The PHP Group. PHP was originally an abbreviation of' +
     'Personal Home Page, but it now stands for the recursive initialism PHP: Hypertext Preprocessor.'
  }
];

const languagesWithSlice = languages.map(obj => {
  let description120 = obj['description'].slice(0, 121) + " " + '...'
  obj.description120 = description120
  return obj
})

document.addEventListener('DOMContentLoaded', event => {
  let languageTemplate = Handlebars.compile($('#lang').html())
  let section = $('section')
  section.html(languageTemplate({languages: languagesWithSlice}))

  let buttons = document.querySelectorAll('button')
  buttons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      let p = button.previousElementSibling
      let id = Number(p.getAttribute('data-id') - 1)
      if (button.classList.contains('more')) {
        button.classList.remove('more')
        button.classList.add('less')
        button.textContent = 'Show Less'
        p.textContent = languagesWithSlice[id]['description']
        console.log(id)
        return
      }
      if (button.classList.contains('less')) {
        button.classList.remove('less');
        button.classList.add('more');
        button.textContent = 'Show More'
        p.textContent = languagesWithSlice[id]['description120']
        console.log(id)
      }
    })
  })
})