import {createElement} from '../utils.js';

const filmControlsTemplate = (film) => {
  const {userDetails} = film;

  const watchlistClass = userDetails.watchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const viewedClass = userDetails.alreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClass = userDetails.favorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return (
    `<section class="film-details__controls">
    <button type="button" class="film-details__control-button ${watchlistClass}" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${viewedClass}" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${favoriteClass}" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
};

export default class FilmControls {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return filmControlsTemplate(this._film);
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
