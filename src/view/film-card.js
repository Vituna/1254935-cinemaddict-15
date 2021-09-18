import AbstractView from './abstract';
import {getFormatDate, getDurationTime, getDescription} from '../utils/utils.js';

const createFilmCardTemplate = (film) => {
  const {
    comments,
    title,
    description,
    poster,
    filmRating,
    genres,
    runtime,
    releaseDate,
    isFavorite,
    isWatchlist,
    isViewed,
  } = film;

  const watchlistClass = isWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const favoriteClass = isFavorite
    ? 'film-card__controls-item--favorite  film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  const viewedClass = isViewed
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  return `<article class="film-card">
      <h3 class="film-card__title"  data-is-popup-open>${title}</h3>
      <p class="film-card__rating">${filmRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getFormatDate(releaseDate, 'YYYY')}</span>
        <span class="film-card__duration">${getDurationTime(runtime, 'minute')}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="${title}" class="film-card__poster"  data-is-popup-open>
      <p class="film-card__description">${getDescription(description)}</p>
      <a class="film-card__comments" data-is-popup-open>${comments.length} comments</a>
      <div class="film-card__controls">
      <button class="film-card__controls-item ${watchlistClass}" type="button">Add to watchlist </button>
      <button class="film-card__controls-item ${viewedClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favoriteClass}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._viewedClickHandler = this._viewedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _filmCardClickHandler(evt) {
    const target = evt.target.dataset.isPopupOpen;

    if (typeof target !== 'undefined') {
      this._callback.click();
    }
  }

  _viewedClickHandler(evt) {
    evt.preventDefault();
    this._callback.viewedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setFilmCardClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._filmCardClickHandler);
  }

  setViewedClickHandler(callback) {
    this._callback.viewedClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._viewedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }
}
