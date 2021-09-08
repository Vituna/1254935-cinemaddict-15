import {UpdateType, END_POINT, AUTHORIZATION} from './utils/const.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Filter from './presenter/filter.js';
import FilmsPresenter from './presenter/films-presenter.js';
import Api from './api.js';

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

new Filter(siteHeaderElement, siteMainElement, filterModel, filmsModel).init();
new FilmsPresenter(siteMainElement, siteFooterElement, filmsModel, filterModel, api).init();

api.getFilmsData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
