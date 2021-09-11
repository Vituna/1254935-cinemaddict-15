import AbstractView from './abstract';

const filmCommentedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

  </section>`
);

export default class FilmCommented extends AbstractView {
  getTemplate() {
    return filmCommentedTemplate();
  }
}
