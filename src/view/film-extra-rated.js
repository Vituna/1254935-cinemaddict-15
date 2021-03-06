import AbstractView from './abstract';

const createRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

  </section>`
);

export default class FilmRated extends AbstractView {
  getTemplate() {
    return createRatedTemplate();
  }
}
