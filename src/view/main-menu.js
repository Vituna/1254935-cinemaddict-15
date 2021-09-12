import AbstractView from './abstract';
import {FilterType} from '../utils/constants.js';

const createFilterCountTemplate = (filter, currentFilterType) => {
  const { type, value, count } = filter;

  const getFilmsCountTemplate = (filmCount) =>
    filmCount >= 0 ? `<span class="main-navigation__item-count">${filmCount}</span>` : '';

  return `<a
      href="#${value}"
      class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
      data-filter-type="${type}"
    >
      ${type}
      ${type === FilterType.ALL ? '' : getFilmsCountTemplate(count)}
    </a>`;
};

const createMainMenuTemplate = (menuItems, currentFilterType) => {
  const menuItemsTemplate = menuItems
    .map((item) => createFilterCountTemplate(item, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${menuItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional
    ${currentFilterType === FilterType.STATS ? 'main-navigation__item--active' : ''}"
      data-filter-type="Stats"
    >
      Stats
    </a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._statsScreenClickHandler = this._statsScreenClickHandler.bind(this);
  }

  getTemplate() {
    return createMainMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    const target = evt.target;

    if (target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(target.dataset.filterType);
  }

  _statsScreenClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setStatsScreenClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement()
      .querySelector('.main-navigation__additional')
      .addEventListener('click', this._statsScreenClickHandler);
  }
}
