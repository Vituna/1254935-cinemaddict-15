import {sortByDate, sortByRating, filter, filterStatsByWatchingDate, getUserRating} from '../utils/utils.js';
import {InsertPosition, SortType, FILMS_STEP, FilterType, Pages, StatsFilterType, UpdateType, UserAction} from '../utils/constants.js';
import {render, removeComponent} from '../utils/render.js';
import StatsScreenView from '../view/statistic';

import SortFilmList from '../view/sort.js';
import FilmSectionView from '../view/film-section';
import FilmListContainerView from '../view/film-list-container';
import FilmListView from '../view/film-list';
import FilmRated from '../view/film-extra-rated.js';
import FilmCommented from '../view/film-extra-commented.js';
import ShowMoreButton from '../view/button-show-more.js';
import FilmCardPresenter from '../presenter/film-card.js';
import NoFilms from '../view/no-films.js';
import PreloaderView from '../view/preloader';

export default class FilmsPresenter {
  constructor(siteMainElement, filmsModel, filterModel, api) {
    this.siteMainElement = siteMainElement;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmsCount = FILMS_STEP;
    this._currentScreen = Pages.FILMS;
    this._currentStatsFilter = StatsFilterType.ALL;

    this._isLoading = true;

    this._filmCardPresenter = new Map();
    this._ratedFilmCardPresenter = new Map();
    this._commentedFilmCardPresenter = new Map();

    this._filmsSection = new FilmSectionView();
    this._filmsList = new FilmListView();
    this._filmsListContainer = new FilmListContainerView();
    this._loadingComponent = new PreloaderView();

    this._sortFilmListComponent = null;
    this._showMoreButtonComponent = null;
    this._emptyListComponent = null;
    this._filmListRatedContainer = null;
    this._filmListRatedComponent = null;
    this._filmListCommentedContainer = null;
    this._filmListCommentedComponent = null;

    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._cardModeChangeHandler = this._cardModeChangeHandler.bind(this);
    this._statsFilterChangeHandler = this._statsFilterChangeHandler.bind(this);
  }

  init() {
    this._renderFilmsSection();
    this._filmsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    this._currentProfileRating = getUserRating(filter[FilterType.HISTORY](films).length);

    if (this._filterType === FilterType.STATS) {
      this._currentScreen = Pages.STATS;
      return filtredFilms;
    }

    this._currentScreen = Pages.FILMS;

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortByDate);
      case SortType.RATING:
        return filtredFilms.sort(sortByRating);
    }

    return filtredFilms;
  }

  _viewActionHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .then(() => {
            this._rerenderPresenterPopup(this._filmCardPresenter, update);
            this._rerenderPresenterPopup(this._ratedFilmCardPresenter, update);
            this._rerenderPresenterPopup(this._commentedFilmCardPresenter, update);
          })
          .catch(() => {
            this._setShakeStatePresenter(this._filmCardPresenter, update);
            this._setShakeStatePresenter(this._ratedFilmCardPresenter, update);
            this._setShakeStatePresenter(this._commentedFilmCardPresenter, update);
          });
        break;
      case UserAction.UPDATE_POPUP:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .then(() => {
            this._updatePresenterComments(this._filmCardPresenter, update);
            this._updatePresenterComments(this._ratedFilmCardPresenter, update);
            this._updatePresenterComments(this._commentedFilmCardPresenter, update);
          });
        break;
    }
  }

  _initFilmCardPresenter(presenters, data) {
    if (presenters.has(data.id)) {
      presenters.get(data.id).init(data, data.comments);
    }
  }

  _updatePresenterComments(presenter, data) {
    if (presenter.has(data.id)) {
      return presenter.get(data.id).updateComments();
    }
  }

  _rerenderPresenterPopup(presenter, data) {
    if (presenter.has(data.id)) {
      return presenter.get(data.id).rerenderPopup();
    }
  }

  _setShakeStatePresenter(presenter, data) {
    if (presenter.has(data.id)) {
      return presenter.get(data.id).setShakeState();
    }
  }

  _modelEventHandler(updateType, data) {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[FilterType.HISTORY](films);

    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearFilmList({ resetFilmCounter: true, resetSortType: true });
        this._renderFilmsSection();
        break;
      case UpdateType.PATCH:
        this._initFilmCardPresenter(this._filmCardPresenter, data);
        this._initFilmCardPresenter(this._ratedFilmCardPresenter, data);
        this._initFilmCardPresenter(this._commentedFilmCardPresenter, data);
        break;
      case UpdateType.MINOR:
        this._clearFilmList({ resetFilmCounter: true });
        this._renderFilmsSection();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({ resetFilmCounter: true, resetSortType: true });

        switch (this._currentScreen) {
          case Pages.FILMS:
            this._renderFilmsSection();
            break;
          case Pages.STATS:
            this._currentStatsFilter = StatsFilterType.ALL;
            this._renderStatsScreen(filtredFilms);
            break;
        }
        break;
    }
  }

  _cardModeChangeHandler() {
    this._filmCardPresenter.forEach((presenter) => presenter.resetView());
    this._ratedFilmCardPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmCardPresenter.forEach((presenter) => presenter.resetView());
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList({ resetFilmCounter: true });
    this._renderFilmsSection();
  }

  _renderStatsScreen(films) {
    this._statsComponent = new StatsScreenView(
      this._currentProfileRating,
      this._currentStatsFilter,
      films,
    );
    this._statsComponent.setFilterTypeChangeHandler(this._statsFilterChangeHandler);
    render(this.siteMainElement, this._statsComponent, InsertPosition.BEFOREEND);
  }

  _statsFilterChangeHandler(value) {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[FilterType.HISTORY](films);
    this._currentStatsFilter = value;

    removeComponent(this._statsComponent);

    switch (this._currentStatsFilter) {
      case StatsFilterType.ALL:
        this._renderStatsScreen(filtredFilms);
        break;
      case StatsFilterType.TODAY:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'd'));
        break;
      case StatsFilterType.WEEK:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'w'));
        break;
      case StatsFilterType.MONTH:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'M'));
        break;
      case StatsFilterType.YEAR:
        this._renderStatsScreen(filterStatsByWatchingDate(filtredFilms, 'y'));
        break;
    }
  }

  _renderLoading() {
    render(this._filmsSection, this._loadingComponent, InsertPosition.BEFOREEND);
  }

  _renderSortFilmList() {
    if (this._sortFilmListComponent !== null) {
      this._sortFilmListComponent = null;
    }

    this._sortFilmListComponent = new SortFilmList(this._currentSortType);
    if (this._getFilms().length) {
      render(this.siteMainElement, this._sortFilmListComponent, InsertPosition.BEFOREEND);
      this._sortFilmListComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    }
  }

  _renderAllFilms() {
    const films = this._getFilms();

    const filmsCount = films.length;

    if (!filmsCount) {
      this._renderEmptyFilmsMessage();
      return;
    }

    render(this._filmsSection, this._filmsList, InsertPosition.AFTERBEGIN);
    render(this._filmsList, this._filmsListContainer, InsertPosition.BEFOREEND);

    this._renderFilmCards(
      this._filmsListContainer,
      films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)),
      this._filmCardPresenter,
    );

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderRatedFilms() {
    if (this._filmListRatedComponent !== null && this._filmListRatedContainer !== null) {
      removeComponent(this._filmListRatedComponent);
      removeComponent(this._filmListRatedContainer);
      this._filmListRatedContainer = null;
      this._filmListRatedComponent = null;
    }

    if (!this._getFilms().length) {
      return;
    }

    const films = [...this._filmsModel.getRatedFilms()];
    if (films[0].filmRating === 0) {
      return;
    }

    this._filmListRatedContainer = new FilmListContainerView();
    this._filmListRatedComponent = new FilmRated();

    render(this._filmsSection, this._filmListRatedComponent, InsertPosition.BEFOREEND);
    render(this._filmListRatedComponent, this._filmListRatedContainer, InsertPosition.BEFOREEND);

    this._renderFilmCards(this._filmListRatedContainer, films, this._ratedFilmCardPresenter);
  }

  _renderCommentedFilms() {
    if (this._filmListCommentedContainer !== null && this._filmListCommentedComponent !== null) {
      removeComponent(this._filmListCommentedComponent);
      removeComponent(this._filmListCommentedContainer);
      this._filmListCommentedContainer = null;
      this._filmListCommentedComponent = null;
    }

    if (!this._getFilms().length) {
      return;
    }

    const films = [...this._filmsModel.getCommentedFilms()];
    if (films[0].comments.length === 0) {
      return;
    }

    this._filmListCommentedContainer = new FilmListContainerView();
    this._filmListCommentedComponent = new FilmCommented();

    render(this._filmsSection, this._filmListCommentedComponent, InsertPosition.BEFOREEND);
    render(
      this._filmListCommentedComponent,
      this._filmListCommentedContainer,
      InsertPosition.BEFOREEND,
    );
    this._renderFilmCards(
      this._filmListCommentedContainer,
      films,
      this._commentedFilmCardPresenter,
    );
  }

  _renderFilmCard(container, film, filmCardPresenter) {
    const mainFilmCardPresenter = new FilmCardPresenter(
      container,
      this._viewActionHandler,
      this._cardModeChangeHandler,
      this._filterType,
      this._api,
    );
    filmCardPresenter.set(film.id, mainFilmCardPresenter);
    mainFilmCardPresenter.init(film, film.comments);
  }

  _renderFilmCards(container, films, filmCardPresenter) {
    films.forEach((film) => this._renderFilmCard(container, film, filmCardPresenter));
  }

  _renderEmptyFilmsMessage() {
    removeComponent(this._filmsList);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);

    this._emptyListComponent = new NoFilms(this._filterType);
    render(this._filmsSection, this._emptyListComponent, InsertPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButton();

    render(this._filmsList, this._showMoreButtonComponent, InsertPosition.BEFOREEND);
    this._showMoreButtonComponent.setLoadMoreClickHandler(this._showMoreButtonClickHandler);
  }

  _showMoreButtonClickHandler() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(
      filmsCount,
      this._renderedFilmsCount + FILMS_STEP,
    );
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilmCards(this._filmsListContainer, films, this._filmCardPresenter);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      removeComponent(this._showMoreButtonComponent);
    }
  }

  _clearCardPresenter(filmCardPresenter) {
    filmCardPresenter.forEach((presenter) => presenter.destroy());
    filmCardPresenter.clear();
  }

  _clearFilmList({ resetFilmCounter = false, resetSortType = false } = {}) {
    const filmsCount = this._getFilms().length;

    this._clearCardPresenter(this._filmCardPresenter);
    this._clearCardPresenter(this._ratedFilmCardPresenter);
    this._clearCardPresenter(this._commentedFilmCardPresenter);

    if (this._statsComponent) {
      removeComponent(this._statsComponent);
    }

    removeComponent(this._sortFilmListComponent);

    if (this._emptyListComponent) {
      removeComponent(this._emptyListComponent);
    }

    removeComponent(this._loadingComponent);
    removeComponent(this._showMoreButtonComponent);
    removeComponent(this._filmsList);
    removeComponent(this._filmListRatedComponent);
    removeComponent(this._filmListCommentedComponent);

    if (resetFilmCounter) {
      this._renderedFilmsCount = FILMS_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsSection() {
    if (this._isLoading) {
      render(this.siteMainElement, this._filmsSection, InsertPosition.BEFOREEND);
      this._renderLoading();
      return;
    }

    this._renderSortFilmList();
    render(this.siteMainElement, this._filmsSection, InsertPosition.BEFOREEND);

    this._renderAllFilms();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }
}
