import {createFilmCardTemplate} from './film-card.js';
import {createButtonShowMoreTemplate} from './button-show-more.js';
import {createFilmExtraTemplate} from './film-extra.js';

const createFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
        ${createFilmCardTemplate()}
        ${createFilmCardTemplate()}
        ${createFilmCardTemplate()}
        ${createFilmCardTemplate()}
        ${createFilmCardTemplate()}
      </div>
      ${createButtonShowMoreTemplate()}
    </section>
      ${createFilmExtraTemplate()}
      ${createFilmExtraTemplate()}
  </section>`
);

export {createFilmsTemplate};
