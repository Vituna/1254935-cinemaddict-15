import {removeComponent, render, replace} from '../utils/render.js';
import {isEscEvent} from '../utils/utils.js';
import {InsertPosition, UpdateType, UserAction, CardMode} from '../utils/const.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/popup.js';
import CommentsModel from '../model/comments.js';

export const State = {
  UPDATING: 'UPDATING',
  ABORTING: 'ABORTING',
};

export default class FilmCardPresenter {
  constructor(filmContainer, changeData, changeMode, filterType, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterType = filterType;
    this._api = api;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._commentsModel = new CommentsModel();

    this._switchViewedClickHandler = this._switchViewedClickHandler.bind(this);
    this._switchFavoriteClickHandler = this._switchFavoriteClickHandler.bind(this);
    this._switchWatchlistClickHandler = this._switchWatchlistClickHandler.bind(this);
    this._closePopupEscKeyHandler = this._closePopupEscKeyHandler.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);

    this._mode = CardMode.CLOSE;
    this.body = document.querySelector('body');
  }

  init(film) {
    this._film = film;

    this._api.getCommentsList(this._film).then((response) => {
      if (this._film.comments) {
        this._commentsModel.setComments(response);
      }
    }).catch(() => {
      this._commentsModel.setComments(null);
    });

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setFilmCardClickHandler(() => this._renderFilmPopup(
      film,
      this._commentsModel.getComments(),
    ));
    this._filmCardComponent.setViewedClickHandler(this._switchViewedClickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._switchFavoriteClickHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._switchWatchlistClickHandler);

    if (prevFilmCardComponent === null) {
      render(this._filmContainer, this._filmCardComponent, InsertPosition.BEFOREEND);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmCardComponent.getElement())) {
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

    if (this._filmPopupComponent !== null) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
      this._filmPopupComponent = null;
    }

    this._filmPopupComponent = new FilmPopupView(film, this._commentsModel.getComments());

    this._showPopup();
    this.body.classList.add('hide-overflow');
    this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);

    this._filmPopupComponent.setClosePopupClickHandler(this._hidePopup);
    this._filmPopupComponent.setViewedClickHandler(this._switchViewedClickHandler);
    this._filmPopupComponent.setFavoriteClickHandler(this._switchFavoriteClickHandler);
    this._filmPopupComponent.setWatchlistClickHandler(this._switchWatchlistClickHandler);
    this._filmPopupComponent.setCommentDeleteClickHandler(this._commentDeleteClickHandler);
    this._filmPopupComponent.setCommentSubmitHandler(this._commentSubmitHandler);
  }

  _hidePopup() {
    removeComponent(this._filmPopupComponent);
    document.removeEventListener('keydown', this._closePopupEscKeyHandler);
    this.body.classList.remove('hide-overflow');
    this._filmPopupComponent = null;
    this._mode = CardMode.CLOSE;
  }

  _showPopup() {
    render(this.body, this._filmPopupComponent, InsertPosition.BEFOREEND);
    document.addEventListener('keydown', this._closePopupEscKeyHandler);
    this._changeMode();
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
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }
    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'History';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isViewed: !this._film.isViewed,
        wathingDate: this._film.isViewed ? new Date() : null,
      },
      () => {
        if (this._filmPopupComponent) {
          this._renderFilmPopup(this._film, this._commentsModel.getComments());
          this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);
        }
      },
    );
  }

  _switchFavoriteClickHandler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }
    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'Favorites';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isFavorite: !this._film.isFavorite,
      },
      () => {
        if (this._filmPopupComponent) {
          this._renderFilmPopup(this._film, this._commentsModel.getComments());
          this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);
        }
      },
    );
  }

  _switchWatchlistClickHandler() {
    if (this._filmPopupComponent) {
      this._scrollPosition = this._filmPopupComponent.getScrollPosition();
    }

    const currentFilterType = this._filterType === 'All movies' || this._filterType !== 'Watchlist';

    if (!currentFilterType && this._filmPopupComponent) {
      this._hidePopup();
    }

    this._changeData(
      UserAction.UPDATE_FILM,
      currentFilterType ? UpdateType.PATCH : UpdateType.MINOR,
      {
        ...this._film,
        isWatchlist: !this._film.isWatchlist,
      },
      () => {
        if (this._filmPopupComponent) {
          this._renderFilmPopup(this._film, this._commentsModel.getComments());
          this._filmPopupComponent.getElement().scrollTo(0, this._scrollPosition);
        }
      },
    );
  }

  _commentDeleteClickHandler(id, data, button, buttonList) {
    button.textContent = 'Deleting...';
    buttonList.forEach((btn) => {
      btn.disabled = true;
    });

    this._api.deleteComment(id).then(() => {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        this._film,
        () => {
          this._api.getCommentsList(this._film).then((response) => {
            this._commentsModel.setComments(response);
            this._renderFilmPopup(this._film, this._commentsModel.getComments());
            this._filmPopupComponent.getElement().scrollTo(0, data.scrollPosition);

            buttonList.forEach((btn) => {
              btn.disabled = false;
            });
          });
        },
      );
    }).catch(() => {
      button.textContent = 'Delete';
      buttonList.forEach((btn) => {
        btn.disabled = false;
      });
    });  }

  _commentSubmitHandler(data, input, emotionList) {
    if (!data.emotion || !data.commentText) {
      return;
    }

    const newComment = {
      emotion: data.emotion,
      comment: data.commentText,
    };

    input.setAttribute('disabled', 'disabled');
    emotionList.forEach((emotionItem) => {
      emotionItem.disabled = true;
    });

    this._api.addComment(this._film, newComment).then((response) => {
      this._commentsModel.addComment(response);
    })
      .then(() => {
        this._changeData(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          this._film,
          () => {
            this._api.getCommentsList(this._film).then((response) => {
              this._commentsModel.setComments(response);
              this._renderFilmPopup(this._film, this._commentsModel.getComments());
              this._filmPopupComponent.getElement().scrollTo(0, data.scrollPosition);
            });
          },
        );
      })
      .catch(() => {
        input.removeAttribute('disabled');
        emotionList.forEach((emotionItem) => {
          emotionItem.disabled = false;
        });
      });
  }
}
