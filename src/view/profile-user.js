import AbstractView from './abstract';
import { getUserRating } from '../utils/utils.js';

const createProfileTemplate = (watchedFilms) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRating(watchedFilms)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserProfile extends AbstractView {
  getTemplate() {
    return createProfileTemplate();
  }
}
