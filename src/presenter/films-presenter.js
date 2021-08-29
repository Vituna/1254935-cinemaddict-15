import {InsertPosition, SortType, sortByDate, sortByRating, updateItem, FILMS_STEP} from '../utils/utils.js';
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
import FilmCardPresenter from '../presenter/film-card.js';

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

    this._filmCardChangeHandler = this._filmCardChangeHandler.bind(this);
    this._showMoreFilmsClickHandler = this._showMoreFilmsClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._cardModeChangeHandler = this._cardModeChangeHandler.bind(this);
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

  _filmCardChangeHandler(updatedFilm) {
    this._dataFilms = updateItem(this._dataFilms, updatedFilm);
    this._defaultDataFilms = updateItem(this._defaultDataFilms, updatedFilm);
    const initFilmCardPresenter = (presenters) => {
      if (presenters.has(updatedFilm.id)) {
        presenters.get(updatedFilm.id).init(updatedFilm);
      }
    };

    initFilmCardPresenter(this._filmCardPresenter);
    initFilmCardPresenter(this._ratedFilmCardPresenter);
    initFilmCardPresenter(this._commentedFilmCardPresenter);
  }

  _cardModeChangeHandler() {
    this._filmCardPresenter.forEach((presenter) => presenter.resetView());
    this._ratedFilmCardPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmCardPresenter.forEach((presenter) => presenter.resetView());
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

  _renderFilmCard(container, film, filmCardPresenter) {
    const mainFilmCardPresenter = new FilmCardPresenter(container, this._filmCardChangeHandler, this._cardModeChangeHandler);
    mainFilmCardPresenter.init(film);
    filmCardPresenter.set(film.id, mainFilmCardPresenter);
  }

  _renderFilmCards(container, filmsData, from, to, filmCardPresenter) {
    filmsData
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(container, film, filmCardPresenter));
  }

  _renderShowMoreButton() {
    const filmsList = this._siteMainElement.querySelector('.films-list');
    render(filmsList, this._showMoreButtonComponent, InsertPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreFilmsClickHandler);
  }

  _showMoreFilmsClickHandler() {
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, this._renderedTaskCount, this._renderedTaskCount + FILMS_STEP, this._filmCardPresenter);
    this._renderedTaskCount += FILMS_STEP;

    if (this._renderedTaskCount >= this._dataFilms.length) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _renderMainFilmCards() {
    this._mainFilmListInner = this._filmsListComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this._mainFilmListInner, this._dataFilms, 0, Math.min(this._dataFilms.length, FILMS_STEP), this._filmCardPresenter);

    if (this._dataFilms.length > FILMS_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilmCards() {
    this._filmListRatedInner = this._filmListRatedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListRatedInner, this._ratedFilmData, 0, 2, this._ratedFilmCardPresenter);
  }

  _renderCommentedFilmCards() {
    this._filmListCommentedInner = this._filmListCommentedComponent.getElement().querySelector('.films-list__container');
    this._renderFilmCards(this._filmListCommentedInner, this._commentedFilmData, 0, 2, this._commentedFilmCardPresenter);
  }

  _clearCardPresenter(filmCardPresenter) {
    filmCardPresenter.forEach((presenter) => presenter.destroy());
    filmCardPresenter.clear();
  }

  _clearMainFilmList() {
    this._clearCardPresenter(this._filmCardPresenter);
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
