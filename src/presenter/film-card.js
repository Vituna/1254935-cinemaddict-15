import {removeComponent, render, replace} from '../utils/render.js';
import {InsertPosition} from '../utils/utils.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/popup.js';
import CommentList from '../view/popup-comment.js';


export default class FilmCardPresenter {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._commentListComponent = null;

    this._switchViewedClickHadler = this._switchViewedClickHadler.bind(this);
    this._switchFavoriteClickHadler = this._switchFavoriteClickHadler.bind(this);
    this._switchWatchlistClickHadler = this._switchWatchlistClickHadler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._filmPopupComponent = new FilmPopupView(film);
    this._commentListComponent = new CommentList(film);
    this._popup = this._filmPopupComponent.getElement();

    this.body = document.body;

    this._filmCardComponent.setFilmCardClickHandler(() => {
      this._renderFilmPopup();
      document.addEventListener('keydown', this._closePopupEscKeyHandler);
    });
    this._filmCardComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmCardComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmCardComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);

    this._filmPopupComponent.setClosePopupClickHandler(() => {
      this._removeFilmPopup();
    });
    this._filmPopupComponent.setViewedClickHadler(this._switchViewedClickHadler);
    this._filmPopupComponent.setFavoriteClickHadler(this._switchFavoriteClickHadler);
    this._filmPopupComponent.setWatchlistClickHadler(this._switchWatchlistClickHadler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, InsertPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this.body.contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    removeComponent(prevFilmCardComponent);
  }

  destroy() {
    removeComponent(this._filmCardComponent);
  }

  _removeFilmPopup() {
    this.body.removeChild(this._popup);
    this.body.classList.remove('hide-overflow');
    this._filmPopupComponent.removeElement();
  }

  _renderFilmPopup() {
    if (document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
    }
    render(this._filmPopupComponent, this._commentListComponent, InsertPosition.BEFOREEND);
    this.body.appendChild(this._popup);
    this.body.classList.add('hide-overflow');
  }

  _closePopupEscKeyHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmPopup();
    }
  }

  _switchViewedClickHadler() {
    this._changeData({ ...this._film, alreadyWatched: !this._film.alreadyWatched });
  }

  _switchFavoriteClickHadler() {
    this._changeData({ ...this._film, favorite: !this._film.favorite });
  }

  _switchWatchlistClickHadler() {
    this._changeData({ ...this._film, watchlist: !this._film.watchlist });
  }

}
