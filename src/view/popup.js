import AbstractView from './abstract';
import dayjs from 'dayjs';
import {createElement} from '../utils/render.js';

const createGenreMarkup = (genre) =>
  `<span class="film-details__genre">
    ${genre}
  </span>
  `;

const createPopupTemplate = (film) => {
  const {id, filmInfo, watchlist, favorite, alreadyWatched} = film;

  const date = dayjs(filmInfo.release.date).format('D MMMM YYYY');

  const generateGenre = () => filmInfo.genre.map((nameGenre) => createGenreMarkup(nameGenre)).join('');

  const watchlistClass = watchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const viewedClass = alreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClass = favorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return `<section class="film-details" id="${id}">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmInfo.runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${(filmInfo.genre.length > 1) ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                ${generateGenre()}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${filmInfo.description}
        </div>
      </div>
    </div>
    <section class="film-details__controls">
      <button type="button" class="film-details__control-button ${watchlistClass}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button ${viewedClass}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button ${favoriteClass}" id="favorite" name="favorite">
        Add to favorites
      </button>
    </section>

  </form>
</section>`;
};

export default class FilmPopup extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._viewedClickHadler = this._viewedClickHadler.bind(this);
    this._favoriteClickHadler = this._favoriteClickHadler.bind(this);
    this._watchlistClickHadler = this._watchlistClickHadler.bind(this);
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._film = null;
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();

    this.removeElement();
    this._callback.click();
  }

  setClosePopupClickHandler(callback) {
    const closeButton = this.getElement().querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', this._closePopupClickHandler);

    this._callback.click = callback;
  }

  _viewedClickHadler(evt) {
    evt.preventDefault();
    this._callback.viewedClick();
  }

  _favoriteClickHadler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _watchlistClickHadler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setViewedClickHadler(callback) {
    this._callback.viewedClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._viewedClickHadler);
  }

  setFavoriteClickHadler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._favoriteClickHadler);
  }

  setWatchlistClickHadler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._watchlistClickHadler);
  }
}
