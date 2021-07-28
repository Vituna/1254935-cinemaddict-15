import {createFilmCardTemplate} from './film-card';

const createNameExtraMarkup = () => (
  `<h2 class="films-list__title">Most commented</h2>

  <div class="films-list__container">
    ${createFilmCardTemplate()}
    ${createFilmCardTemplate()}
  </div>`
);


const createFilmExtraTemplate = () => (
  `<section class="films-list films-list--extra">
    ${createNameExtraMarkup()}
  </section>`
);

export {createFilmExtraTemplate};
