import dayjs from 'dayjs';
import {createElement} from '../utils.js';

const createGenreMarkup = (genre) =>
  `<span class="film-details__genre">
    ${genre}
  </span>
  `;

const createPopupTemplate = (film) => {
  const {id, filmInfo} = film;

  const date = dayjs(filmInfo.release.date).format('D MMMM YYYY');

  const generateGenre = () => filmInfo.genre.map((nameGenre) => createGenreMarkup(nameGenre));

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
  </form>
</section>`;
};

export default class FilmPopup {
  constructor() {
    this._element = null;
  }

  getTemplate(film) {
    document.querySelector('body').classList.add('hide-overflow');

    return createPopupTemplate(film);
  }

  getElement(film) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(film));
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
