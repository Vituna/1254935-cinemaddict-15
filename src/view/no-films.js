import AbstractView from './abstract';
import {FilterType} from '../utils/const.js';

const NoFilmsListTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

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
