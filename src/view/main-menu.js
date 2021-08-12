import { createElement } from '../utils.js';

const createFilterCountTemplate = (filters) => {
  const { name, count } = filters;

  const checkFilmCount = (filmCount) =>
    filmCount >= 0
      ? `<span class="main-navigation__item-count">${filmCount}</span>`
      : '';

  return (
    `<a href="#${name}" class="main-navigation__item">
      ${name}
      <!-- Не показывать счетчик фильмов у пункта "All movies" когда фильмов 0 -->
      ${name === 'All movies' ? '' : checkFilmCount(count)}
    </a>`
  );
};

const createMainMenuTemplate = (filtres) => {
  const filtersTemplate = filtres.map((item) => createFilterCountTemplate(item)).join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
