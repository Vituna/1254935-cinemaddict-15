import AbstractView from './abstract';

const createFilmCardTemplate = (film) => {
  const commentsLenght = film.comments.length;
  const {watchlist, favorite, alreadyWatched} = film;

  const watchlistClass = watchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const favoriteClass = favorite
    ? 'film-card__controls-item--favorite  film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  const viewedClass = alreadyWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';


  return `<article class="film-card" id = "${film.id}">
    <h3 class="film-card__title">${film.filmInfo.title}</h3>
    <p class="film-card__rating">${film.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year"></span>
      <span class="film-card__duration">${film.filmInfo.runtime}</span>
      <span class="film-card__genre">${film.filmInfo.genre}</span>
    </p>
    <img src="./images/posters/${film.filmInfo.poster}" alt="" class="film-card__poster" data-is-popup-open>
    <p class="film-card__description">${film.filmInfo.description}</p>
    <a class="film-card__comments">${commentsLenght}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${watchlistClass}" type="button">Add to watchlist </button>
      <button class="film-card__controls-item ${viewedClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favoriteClass}" type="button">Mark as favorite</button>
  </div>
  </article>`;
};

export default class FilmCard extends AbstractView  {
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
