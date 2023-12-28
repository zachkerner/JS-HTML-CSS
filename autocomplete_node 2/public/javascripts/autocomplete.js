const Autocomplete = {
  wrapInput: function() {
    let wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  },

  createUI: function() {
    let listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    let overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = `${this.input.clientWidth}px`;

    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  },

  init: function() {
    this.input = document.querySelector('input');
    this.url = '/countries?matching=';

    this.listUI = null
    this.overlay = null
    
    this.wrapInput();
    this.createUI();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Autocomplete.init();
});