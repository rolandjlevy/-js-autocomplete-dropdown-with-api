import { createElement, getElement, getAllElements } from './src/helpers.js';
import { badwords } from './src/badwords.js';

const html = getElement('html');
const searchInput = getElement('#search-input');
const searchButton = getElement('#menu > .search-btn');
searchInput.focus();
const autocomplete = getElement('#autocomplete');
const menuList = getElement('#menu > ul.list');
const baseUrl = 'https://api.datamuse.com';
const max = 500;

// Events to generate dropdown
['keyup', 'click'].forEach(event => {
  searchInput.addEventListener(event, (e) => {
    const str = e.target.value.toLowerCase();
    if (str) {
      searchButton.classList.remove('hide');
      menuList.classList.remove('hide');
      searchInput.classList.remove('badword');
      if (badWordExists(str)) {
        badwordsInput();
      }
      getWords(str).then(list => {
        const sortedList = list.sort((a, b) => a.word.localeCompare(b.word));
        const found = findMatch(sortedList, str);
        if (found.length && !badWordExists(str)) {
          autocomplete.innerHTML = found;
          autocomplete.classList.remove('hide');
          searchInput.classList.add('results');
          bindClickEvents();
        }
      });
    } else {
      emptyInput();
    }
  }, true);
});

function emptyInput() {
  autocomplete.classList.add('hide');
  searchInput.classList.remove('results');
  searchButton.classList.add('hide');
  menuList.classList.add('hide');
}

function badwordsInput() {
  autocomplete.classList.add('hide');
  searchInput.classList.add('badword');
  searchInput.classList.remove('results');
  searchButton.classList.add('hide');
  menuList.classList.add('hide');
}

// Event to close dropdown
html.addEventListener('click', (e) => {
  if (e.target.tagName !== 'LI') {
    autocomplete.classList.add('hide');
    searchInput.classList.remove('results');
  }
}, true);

// Events to fill input from dropdown
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

// Get data from API
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

// Generate HTML for dropdown
function findMatch(arr, str) {
  const list = arr.reduce((acc, item) => {
    if (str === item.word.substring(0, str.length)) {
      acc += `<li>${item.word}</li>`;
    }
    return acc;
  }, '');
  return list.length ? `<ul>${list}</ul>` : false;
}

// Search links data
const searchLinks = {
  'google-icon': 'https://www.google.com/search?q=',
  'youtube-icon': 'https://www.youtube.com/results?search_query=',
  'twitch-icon': 'https://www.twitch.tv/search?term=',
  'instagram-icon': 'https://www.instagram.com/',
  'twitter-icon': 'https://twitter.com/',
  'soundcloud-icon': 'https://soundcloud.com/search?q=',
  'facebook-icon': 'https://www.facebook.com/search/?q=',
  'wiki-icon': 'https://en.wikipedia.org/wiki/'
}

Object.keys(searchLinks).forEach(link => {
  getElement(`.${link}`).addEventListener('click', (e) => {  
    if (searchInput.value) {
      window.open(`${searchLinks[link]}${searchInput.value}`, '_blank');
    } else {
      console.log('No search terms');
    }
  });
});

function badWordExists(inputString) {
  const inputArray = inputString.split(' ');
  return inputArray.some(item => badwords.includes(item));
}