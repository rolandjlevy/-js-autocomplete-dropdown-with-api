
const createElement = function(tag, className) {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  return element;
}

const getElement = function(selector) {
  return document.querySelector(selector);
}

const getAllElements = function(selector) {
  return document.querySelectorAll(selector);
}

export {
  createElement,
  getElement,
  getAllElements
};