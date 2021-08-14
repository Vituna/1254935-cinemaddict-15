import {createElement} from '../utils.js';

const SORT_ITEM_ACTIVE = 'sort__button--active';

const isActiveClassName = (condition) => condition ? SORT_ITEM_ACTIVE : '';

const createSortItemTemplate = (sortType, isChecked) => `
  <li>
    <a href="#${sortType}" class="sort__button ${isActiveClassName(isChecked)}">Sort by ${sortType}</a>
  </li>
`;

const createSortTemplate = (sortTypes = [], activeSortType) => {
  const sortItemsTemplate = sortTypes.map((sortType) => createSortItemTemplate(sortType, sortType === activeSortType)).join('');
  return `<ul class="sort">${sortItemsTemplate}</ul>`;
};

export default class SortFilmList {
  constructor(SORT_TYPES) {
    this.sort = SORT_TYPES;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this.sort, this.sort[0]);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    if (this._element) {
      this._element.parentNode.removeChild(this._element);
    }

    this._element = null;
  }
}
