import dayjs from 'dayjs';
import {createComentsTemplate} from './popub-comment.js';
import {generateCountData} from '../utils.js';
import {films} from './films.js';

const createGenreMarkup = (genre) => {
  const {customObject} = genre;
  return `<span class="film-details__genre">
    ${customObject}
  </span>
  `;
};

const createPopupTemplate = () => {
  const {id, filmInfo, comments} = films[0];
  const date = dayjs(filmInfo.release.date).format('D MMMM YYYY');

  const genreObject = () => {
    const customArr = [];
    for (let i = 0; i < filmInfo.genre.length; i++) {
      const customObject = filmInfo.genre[i];
      customArr.push({customObject});
    }
    return customArr;
  };

  const generateGenre = () =>  generateCountData(filmInfo.genre.length, createGenreMarkup, genreObject());

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

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    ${createComentsTemplate(comments)}
  </form>
</section>`;
};

export {createPopupTemplate};
