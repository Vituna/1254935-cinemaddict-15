import AbstractView from './abstract';

const createFilterCountTemplate = (filters) => {
  const {name, count} = filters;

  const checkFilmCount = (filmCount) =>
    filmCount >= 0
      ? `<span class="main-navigation__item-count">${filmCount}</span>`
      : '';

  return (
    `<a href="#${name}" class="main-navigation__item">
      ${name}
      ${name === 'All movies' ? '' : checkFilmCount(count)}
    </a>`
  );
};

const createMainMenuTemplate = (filters, films) => {
  const filtersTemplate = filters.map((item) => createFilterCountTemplate(item, films)).join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters);
  }
}
