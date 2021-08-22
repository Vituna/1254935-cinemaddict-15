import AbstractView from './abstract';

const createMoviesInsideTemplate = (films = []) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>`
);

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMoviesInsideTemplate(this._films);
  }
}
