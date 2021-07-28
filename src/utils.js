const CARD_COUNT = 5;

const InsertPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export {CARD_COUNT, InsertPosition, render};
