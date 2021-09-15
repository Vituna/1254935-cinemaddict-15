import AbstractView from './abstract';
import {NoFilmsListTextType} from '../utils/constants.js';

const createNoFilmsListTemplate = (filterType) => {
  const noFilmsText = NoFilmsListTextType[filterType];

  return (
    `<h2 class="films-list__title">${noFilmsText}</h2>`
  );
};

export default class NoFilms extends AbstractView {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createNoFilmsListTemplate(this._data);
  }
}
