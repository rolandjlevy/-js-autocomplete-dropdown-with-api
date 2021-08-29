const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  return element;
}

const getElement = (selector) => {
  return document.querySelector(selector);
}

const getAllElements = (selector) => {
  return document.querySelectorAll(selector);
}

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const sanitize = (str) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => (map[match]));
}

const isTag = (str) => {
  return /<[^>]*>/g.test(str);
}

let timeout;
const debounce = (func, delay) => {
  clearTimeout(timeout);
  timeout = setTimeout(func, delay);
};

export {
  $,
  $$,
  isTag,
  debounce
};