import { createElement } from '../utils.js';


const createFilmCardTemplate = (film) => {
  const commentsLenght = film.comments.length;

  return `<article class="film-card" id = "${film.id}">
    <h3 class="film-card__title">${film.filmInfo.title}</h3>
    <p class="film-card__rating">${film.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year"></span>
      <span class="film-card__duration">${film.filmInfo.runtime}</span>
      <span class="film-card__genre">${film.filmInfo.genre}</span>
    </p>
    <img src="./images/posters/${film.filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.filmInfo.description}</p>
    <a class="film-card__comments">${commentsLenght}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(film) {
    this.film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
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
