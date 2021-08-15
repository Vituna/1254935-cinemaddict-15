import AbstractView from './abstract';

const filmRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container"></div>
  </section>`
);

export default class FilmRated extends AbstractView {
  getTemplate() {
    return filmRatedTemplate();
  }
}
