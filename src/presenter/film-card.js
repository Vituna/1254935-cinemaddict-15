import {removeComponent, render, replace} from '../utils/render.js';
import {InsertPosition, isEscEvent, CardMode} from '../utils/utils.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/popup.js';
import CommentList from '../view/popup-comment.js';

export default class FilmCardPresenter {
  constructor(filmContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._commentListComponent = null;

    this._switchViewedClickHandler = this._switchViewedClickHandler.bind(this);
    this._switchFavoriteClickHandler = this._switchFavoriteClickHandler.bind(this);
    this._switchWatchlistClickHandler = this._switchWatchlistClickHandler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    this._mode = CardMode.CLOSE;
    this.body = document.querySelector('body');
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setFilmCardClickHandler(() => this._renderFilmPopup(film));

    this._filmCardComponent.setViewedClickHandler(this._switchViewedClickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._switchFavoriteClickHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._switchWatchlistClickHandler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, InsertPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    removeComponent(prevFilmCardComponent);
  }

  resetView() {
    if (this._mode !== CardMode.CLOSE) {
      this._hidePopup();
    }
  }

  destroy() {
    removeComponent(this._filmCardComponent);
  }

  _renderFilmPopup(film) {
    if (this._filmPopupComponent) {
      this._hidePopup();
    }
    this._filmPopupComponent = new FilmPopupView(film);
    this._commentListComponent = new CommentList(film);

    this._showPopup();

    this._filmPopupComponent.setClosePopupClickHandler(this._hidePopup);
    this._filmPopupComponent.setViewedClickHandler(this._switchViewedClickHandler);
    this._filmPopupComponent.setFavoriteClickHandler(this._switchFavoriteClickHandler);
    this._filmPopupComponent.setWatchlistClickHandler(this._switchWatchlistClickHandler);
  }

  _hidePopup() {
    removeComponent(this._filmPopupComponent);
    document.removeEventListener('keydown', this._closePopupEscKeyHandler);
    this.body.classList.remove('hide-overflow');
    this._mode = CardMode.CLOSE;
  }

  _showPopup() {
    render(this.body, this._filmPopupComponent, InsertPosition.BEFOREEND);
    render(this._filmPopupComponent, this._commentListComponent, InsertPosition.BEFOREEND);

    document.addEventListener('keydown', this._closePopupEscKeyHandler);
    this._changeMode();
    this.body.classList.add('hide-overflow');
    this._mode = CardMode.OPEN;
  }

  _closePopupEscKeyHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._filmPopupComponent.getElement().querySelector('.film-details__inner').reset();
      this._hidePopup();
    }
  }

  _switchViewedClickHandler() {
    this._changeData({ ...this._film, alreadyWatched: !this._film.alreadyWatched });
    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset(this._film);
      this._commentListComponent.reset(this._film);
    }
  }

  _switchFavoriteClickHandler() {
    this._changeData({ ...this._film, favorite: !this._film.favorite });
    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset(this._film);
      this._commentListComponent.reset(this._film);
    }
  }

  _switchWatchlistClickHandler() {
    this._changeData({ ...this._film, watchlist: !this._film.watchlist });
    if (this._filmPopupComponent) {
      this._filmPopupComponent.reset(this._film);
      this._commentListComponent.reset(this._film);
    }
  }
}
