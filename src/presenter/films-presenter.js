import {InsertPosition, SortType, sortByDate, sortByRating, updateItem} from '../utils/utils.js';
import {render, removeComponent} from '../utils/render.js';

import Menu from '../view/main-menu.js';
import Profile from '../view/profile-user.js';
import SortFilmList from '../view/sort.js';
import FilmsList from '../view/films.js';
import FilmRated from '../view/film-extra-rated.js';
import FilmCommented from '../view/film-extra-commented.js';
import ShowMoreButton from '../view/button-show-more.js';
import FooterStats from '../view/footer-stats.js';
import NoFilms from '../view/no-films.js';
import FilmCardPresenter from '../presenter/film-card';

const FILMS_STEP = 5;

export default class FilmsPresenter {
  constructor(siteHeaderElement, siteMainElement, siteFooterElement, filters, films) {
    this._siteHeaderElement = siteHeaderElement;
    this._siteMainElement = siteMainElement;
    this._siteFooterElement = siteFooterElement;

    this._renderedTaskCount = FILMS_STEP;
    this._filmCardPresenter = new Map();
    this._ratedFilmCardPresenter = new Map();
    this._commentedFilmCardPresenter = new Map();


    this._userProfileComponent = new Profile();
    this._menuComponent = new Menu(filters);
    this._sortListComponent = new SortFilmList();
    this._filmsListComponent = new FilmsList();
    this._filmListRatedComponent = new FilmRated();
    this._filmListCommentedComponent = new FilmCommented();
    this._emptyListComponent = new NoFilms();
    this._filmStatsComponent = new FooterStats(films);
    this._showMoreButtonComponent = new ShowMoreButton();

    this._filmCardChangeHadler = this._filmCardChangeHadler.bind(this);
    this._showMoreFilmsClickHandler = this._showMoreFilmsClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  init(films) {
    this._dataFilms = [...films];
    this._defaultDataFilms = [...films];

    this._ratedFilmData = [...films]
      .filter((film) => film.filmInfo.totalRating > 6)
      .sort((a, b) => (b.filmInfo.totalRating > a.filmInfo.totalRating) ? 1 : -1)
      .slice(0, 2);
    this._commentedFilmData = [...films]
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);

    this._renderUserProfile();
    this._renderMenu();
    this._renderSortList();
    this._renderFilmsList();
    this._renderFilmsListRated();
    this._renderFilmsListCommented();
    this._renderShowMoreButton();
    this._renderFooterStats();
    this._renderFilms();
  }

  _filmCardChangeHadler(updatedFilm) {
    this._dataFilms = updateItem(this._dataFilms, updatedFilm);
    this._defaultDataFilms = updateItem(this._defaultDataFilms, updatedFilm);
    this._ratedFilmData = updateItem(this._ratedFilmData, updatedFilm);
    this._commentedFilmData = updateItem(this._commentedFilmData, updatedFilm);
    this._filmCardPresenter.get(updatedFilm.id).init(updatedFilm, []);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._dataFilms.sort(sortByDate);
        break;
      case SortType.RATING:
        this._dataFilms.sort(sortByRating);
        break;
      default:
        this._dataFilms = [...this._defaultDataFilms];
    }

    this._currentSortType = sortType;
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearMainFilmList();
    this._renderMainFilmCards();
  }


  _renderUserProfile() {
    render(this._siteHeaderElement, this._userProfileComponent, InsertPosition.BEFOREEND);
  }

  _renderMenu() {
    render(this._siteMainElement, this._menuComponent, InsertPosition.BEFOREEND);
  }

  _renderSortList() {
    render(this._siteMainElement, this._sortListComponent, InsertPosition.BEFOREEND);
    this._sortListComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderFilmsList() {
    render(this._siteMainElement, this._filmsListComponent, InsertPosition.BEFOREEND);
  }

  _renderFilmsListRated() {
    render(this._filmsListComponent, this._filmListRatedComponent, InsertPosition.BEFOREEND);
  }

  _renderFilmsListCommented() {
    render(this._filmsListComponent, this._filmListCommentedComponent, InsertPosition.BEFOREEND);
  }

  _renderFooterStats() {
    render(this._siteFooterElement, this._filmStatsComponent, InsertPosition.BEFOREEND);
  }

  _renderFilmCard(container, film, type = '') {
    const filmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHadler);
    filmCardPresenter.init(film);
    switch(type) {
      case 'rated' :
        this._ratedFilmCardPresenter.set(film.id, filmCardPresenter);
        break;
      case 'commented' :
        this._commentedFilmCardPresenter.set(film.id, filmCardPresenter);
        break;
      default:
        this._filmCardPresenter.set(film.id, filmCardPresenter);
    }
  }

  _renderFilmCards(container, filmsData, from, to, type) {
    filmsData
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film, type));
  }

  _renderShowMoreButton() {
    const filmsList = this._siteMainElement.querySelector('.films-list');
    render(filmsList, this._showMoreButtonComponent, InsertPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreFilmsClickHandler);
  }

  _showMoreFilmsClickHandler() {
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, this._renderedTaskCount, this._renderedTaskCount + FILMS_STEP);
    this._renderedTaskCount += FILMS_STEP;

    if (this._renderedTaskCount >= this._dataFilms.length) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _renderMainFilmCards() {
    this._mainFilmListInner = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, 0, Math.min(this._dataFilms.length, FILMS_STEP));

    if (this._dataFilms.length > FILMS_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilmCards() {
    this._filmListRatedInner = this._filmListRatedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListRatedInner, this._ratedFilmData, 0, 2, 'rated');
  }

  _renderCommentedFilmCards() {
    this._filmListCommentedInner = this._filmListCommentedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListCommentedInner, this._commentedFilmData, 0, 2, 'commented');
  }

  _clearMainFilmList() {
    this._filmCardPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardPresenter.clear();
    this._renderedTaskCount = FILMS_STEP;

    removeComponent(this._showMoreButtonComponent);
  }

  _renderEmptyFilmsMessage() {
    removeComponent(this._sortListComponent);
    removeComponent(this._filmsListComponent);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);
    removeComponent(this._showMoreButtonComponent);
    render(this._siteMainElement, this._emptyListComponent, InsertPosition.BEFOREEND);
  }

  _renderFilms() {
    if (!this._dataFilms.length) {
      this._renderEmptyFilmsMessage();
      return;
    }

    this._renderMainFilmCards();
    this._renderRatedFilmCards();
    this._renderCommentedFilmCards();
  }
}
