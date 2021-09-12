import {UpdateType, END_POINT, AUTHORIZATION, InsertPosition} from './utils/constants.js';
import {render} from './utils/render.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Filter from './presenter/filter.js';
import FooterStats from './view/footer-stats.js';
import FilmsPresenter from './presenter/films-presenter.js';
import Api from './api.js';

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

new Filter(siteHeaderElement, siteMainElement, filterModel, filmsModel).init();
new FilmsPresenter(siteMainElement, filmsModel, filterModel, api).init();

api.getFilmsData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteFooterElement, new FooterStats(filmsModel.getFilms()), InsertPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
