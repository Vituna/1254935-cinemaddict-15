import {InsertPosition, render, generateFilters, getFilterCountByName} from './utils.js';
import {createMainMenuTemplate} from './view/main-menu.js';
import {createProfileTemplate} from './view/profile-user.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsTemplate} from './view/films.js';
import {createMoviesInsideTemplate} from './view/stats.js';
import {createPopupTemplate} from './view/popub.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {films} from './view/films.js';

const FILMS_STEP = 5;
const SORT_TYPES = ['default', 'date', 'rating'];

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filters = generateFilters(films);
const allFilmsAmount = getFilterCountByName(filters, 'all');

render(siteHeaderElement, createProfileTemplate(), InsertPosition.BEFOREEND);
render(siteMainElement, createMainMenuTemplate(filters, filters[0].name), InsertPosition.AFTERBEGIN);
render(siteMainElement, createSortTemplate(SORT_TYPES, SORT_TYPES[0]), InsertPosition.BEFOREEND);
render(siteMainElement, createFilmsTemplate(), InsertPosition.BEFOREEND);
render(siteFooterStatisticsElement, createMoviesInsideTemplate(allFilmsAmount), InsertPosition.AFTERBEGIN);
render(siteFooterStatisticsElement, createPopupTemplate(), InsertPosition.AFTEREND);

const siteMoreButtonElement = siteMainElement.querySelector('.films-list__show-more');
const filmsList = siteMainElement.querySelector('.films-list__container');

let renderedFilmsAmount = 0;

const onShowMoreButtonNodeClick = (evt) => {
  evt.preventDefault();

  films
    .slice(renderedFilmsAmount, renderedFilmsAmount + FILMS_STEP)
    .forEach((film) => render(filmsList, createFilmCardTemplate(film), InsertPosition.BEFOREEND));

  renderedFilmsAmount += FILMS_STEP;

  if (renderedFilmsAmount >= films.length) {
    siteMoreButtonElement.remove();
  }
};

siteMoreButtonElement.addEventListener('click', onShowMoreButtonNodeClick);

siteMoreButtonElement.click();
