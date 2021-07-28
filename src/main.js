import {InsertPosition, render} from './utils.js';
import {createMainMenuTemplate} from './view/main-menu.js';
import {createProfileTemplate} from './view/profile-user.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsTemplate} from './view/films.js';
import {createMoviesInsideTemplate} from './view/stats.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, createProfileTemplate(), InsertPosition.BEFOREEND);
render(siteMainElement, createMainMenuTemplate(), InsertPosition.AFTERBEGIN);
render(siteMainElement, createSortTemplate(), InsertPosition.BEFOREEND);
render(siteMainElement, createFilmsTemplate(), InsertPosition.BEFOREEND);
render(siteFooterStatisticsElement, createMoviesInsideTemplate(), InsertPosition.AFTERBEGIN);

