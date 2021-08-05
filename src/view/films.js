import {createFilmCardTemplate} from './film-card.js';
import {createButtonShowMoreTemplate} from './button-show-more.js';
import {createFilmExtraTemplate} from './film-extra.js';
import {generateFilmCard} from '../mock/film-card.js';
import {generateCountData} from '../utils.js';

const FILMS_LIST_COUNT = 20;
const EXTRA_FILMS_LIST_COUNT = 2;

const films = new Array(FILMS_LIST_COUNT).fill().map(generateFilmCard);

const generateExtraFilmsList = () =>  generateCountData(EXTRA_FILMS_LIST_COUNT, createFilmCardTemplate, films);

const createFilmsTemplate = () =>
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
      ${createButtonShowMoreTemplate()}
    </section>
      ${createFilmExtraTemplate()}
      ${createFilmExtraTemplate()}
  </section>`;


export {createFilmsTemplate, generateExtraFilmsList, films};
