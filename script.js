import { createElement, getElement, getAllElements } from './src/helpers.js';

const html = getElement('html');
const searchInput = getElement('#search-input');
searchInput.focus();
const autocomplete = getElement('#autocomplete');
const baseUrl = 'https://api.datamuse.com';
const max = 100;

searchInput.addEventListener('keyup', (e) => {
  const str = e.target.value.toLowerCase();
  if (str.length > 2) {
    getWords(str).then(list => {
      const found = findMatch(list, str);
      if (found.length) {
        autocomplete.innerHTML = found;
        autocomplete.classList.remove('hide');
        searchInput.classList.add('results');
        bindClickEvents();
      }
    });
  } else {
    autocomplete.classList.add('hide');
  }
}, true);

html.addEventListener('click', (e) => {
  if (e.target.tagName !== 'LI') {
    autocomplete.classList.add('hide');
  }
}, true);


function bindClickEvents() {
  const items = getAllElements('#autocomplete > ul > li');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      searchInput.value = e.target.textContent;
      searchInput.focus();
      autocomplete.classList.add('hide');
      searchInput.classList.remove('results');
    });
  });
}

function getWords(str) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/sug?s=${str}&max=${max}`;
    return fetch(url).then(response => {
      if (response.ok) {
        resolve(response.json())
      } else {
        reject(new Error('error'));
      }
    }, error => {
      reject(new Error(error.message))
    });
  });
}

function findMatch(arr, str) {
  const list = arr.reduce((acc, item) => {
    if (str === item.word.substring(0, str.length)) {
      acc += `<li>${item.word}</li>`;
    }
    return acc;
  }, '');
  return list.length ? `<ul>${list}</ul>` : false;
}

const searchLinks = {
  'google-search': 'https://www.google.com/search?q=',
  'youtube-search': 'https://www.youtube.com/results?search_query=',
  'instagram-search': 'https://www.instagram.com/',
  'twitter-search': 'https://twitter.com/',
  'facebook-search': 'https://www.facebook.com/search/?q=',
  'wiki-search': 'https://en.wikipedia.org/wiki/'
}

Object.keys(searchLinks).forEach(link => {
  getElement(`#${link}`).addEventListener('click', (e) => {  
    if (searchInput.value) {
      window.open(`${searchLinks[link]}${searchInput.value}`, '_blank');
    } else {
      console.log('No search terms');
    }
  });
});