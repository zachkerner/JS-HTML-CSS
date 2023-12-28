let obj = 
  {
    description: 'Ruby is a dynamic, reflective, object-oriented, \
    general-purpose programming language. It was designed and developed in the mid-1990s \
    by Yukihiro Matsumoto in Japan. According to its creator, Ruby was influenced by Perl, \
    Smalltalk, Eiffel, Ada, and Lisp. It supports multiple programming paradigms, \
    including functional, object-oriented, and imperative. It also has a dynamic type \
    system and automatic memory management.'
}
obj['description'].replace(/\s{2,}/g, ' ');

console.log(obj['description'])