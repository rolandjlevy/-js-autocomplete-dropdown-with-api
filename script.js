import { createElement, getElement, getAllElements } from './src/helpers.js';

const html = getElement('html');
const searchInput = getElement('#search-input');
searchInput.focus();
const autocomplete = getElement('#autocomplete');
const baseUrl = 'https://api.datamuse.com';
const max = 500;

['keyup', 'click'].forEach(event => {
  searchInput.addEventListener(event, (e) => {
    const str = e.target.value.toLowerCase();
    if (str) {
      getWords(str).then(list => {
        const sortedList = list.sort((a, b) => a.word.localeCompare(b.word));
        const found = findMatch(sortedList, str);
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
});

// close autocomplete

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
    }, true);
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

// Search links

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