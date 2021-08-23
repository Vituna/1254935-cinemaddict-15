import {generateFilters} from './utils/utils.js';
import {generateFilmCard} from './mock/film-card.js';

import FilmsPresenter from './presenter/films-presenter.js';

const FILMS_LIST_COUNT = 20;

const films = new Array(FILMS_LIST_COUNT).fill().map((item, index) => generateFilmCard(index + 1));
const filters = generateFilters(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

new FilmsPresenter(siteHeaderElement, siteMainElement, siteFooterElement, filters, films).init(films);
