import AbstractView from './abstract';

const createNoFilmsListTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class NoFilms extends AbstractView {
  getTemplate() {
    return createNoFilmsListTemplate();
  }
}
