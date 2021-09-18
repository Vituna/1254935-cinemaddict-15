import {UpdateType, END_POINT, AUTHORIZATION, InsertPosition, STORE_NAME} from './utils/constants.js';
import {render} from './utils/render.js';
import {showToast} from './utils/toast.js';

import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Filter from './presenter/filter.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FooterStatsView from './view/footer-stats.js';
import Api from './api/api.js';
import Store from './api/store';
import Provider from './api/provider';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();


new Filter(siteHeaderElement, siteMainElement, filterModel, filmsModel).init();
new FilmsPresenter(siteMainElement, filmsModel, filterModel, apiWithProvider).init();

apiWithProvider.getFilmsData()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(siteFooterElement, new FooterStatsView(filmsModel.getFilms()), InsertPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
  showToast('Internet connection restored!!!');

});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  showToast('Internet connection is disconnected!!!');
});
