import {InsertPosition, generateFilters} from './utils/utils.js';
import {render, removeComponent} from './utils/render.js';
import {generateFilmCard} from './mock/film-card.js';

import Menu from './view/main-menu.js';
import Profile from './view/profile-user.js';
import SortFilmList from './view/sort.js';
import FilmsList from './view/films.js';
import FilmCard from './view/film-card.js';
import FilmRated from './view/film-extra-rated.js';
import FilmCommented from './view/film-extra-commented.js';
import ShowMoreButton from './view/button-show-more.js';
import FilmPopup from './view/popup.js';
import FilmControls from './view/film-details-control.js';
import FooterStats from './view/footer-stats.js';
import CommentList from './view/popup-comment';
import NoFilms from './view/no-films.js';

const FILMS_STEP = 5;
const SORT_TYPES = ['default', 'date', 'rating'];

const FILMS_LIST_COUNT = 20;

const films = new Array(FILMS_LIST_COUNT).fill().map((item, index) => generateFilmCard(index + 1));
const filters = generateFilters(films);

const ratedFilms = films
  .filter((film) => film.filmInfo.totalRating > 8)
  .sort((a, b) => (b.totalRating > a.totalRating) ? 1 : -1)
  .slice(0, 2);

const commentedFilms = films
  .slice()
  .sort((a, b) => b.comments.length - a.comments.length)
  .slice(0, 2);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new Profile().getElement(), InsertPosition.BEFOREEND);
render(siteMainElement, new Menu(filters, films).getElement(), InsertPosition.BEFOREEND);
const sortFilmListComponent = new SortFilmList(SORT_TYPES, SORT_TYPES[0]);
render(siteMainElement, sortFilmListComponent.getElement(), InsertPosition.BEFOREEND);
const filmListComponent = new FilmsList();
render(siteMainElement, filmListComponent.getElement(), InsertPosition.BEFOREEND);

const filmContainer = siteMainElement.querySelector('.films');

const filmListRated = new FilmRated();
const filmListCommented = new FilmCommented();
render(filmContainer, filmListRated.getElement(), InsertPosition.BEFOREEND);
render(filmContainer, filmListCommented.getElement(), InsertPosition.BEFOREEND);

const filmsList = siteMainElement.querySelector('.films-list');
render(filmsList, new ShowMoreButton().getElement(), InsertPosition.BEFOREEND);

const siteMoreButtonElement = siteMainElement.querySelector('.films-list__show-more');

const filmPopupComponent = new FilmPopup();
const renderFilmPopup = (filmData) => filmPopupComponent.getElement(filmData);

const renderCard = (container, film) => {
  const filmComponent = new FilmCard(film);
  const filmControlsComponent = new FilmControls(film);
  const commentListComponent = new CommentList(film);

  const removeFilmPopup = () => {
    document.querySelector('body').classList.remove('hide-overflow');
    filmPopupComponent.removeElement();
  };


  const showFilmPopup = (filmData) => {
    render(siteFooterElement, renderFilmPopup(filmData), InsertPosition.AFTEREND);

    const filmDetailsContainer = filmPopupComponent.getElement().querySelector('.film-details__inner');
    render(filmDetailsContainer, filmControlsComponent.getElement(), InsertPosition.BEFOREEND);
    render(filmDetailsContainer, commentListComponent.getElement(), InsertPosition.BEFOREEND);

    filmPopupComponent.setClosePopupClickHandler(() => {
      removeFilmPopup();
    });

    document.querySelector('body').classList.remove('hide-overflow');
  };


  const closePopupEscKeyHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      removeFilmPopup();
    }
  };

  filmComponent.setFilmCardClickHandler(() => {
    document.addEventListener('keydown', closePopupEscKeyHandler);
    removeFilmPopup();

    showFilmPopup(film);
  });

  return render(container, filmComponent, InsertPosition.BEFOREEND);
};

let renderedFilmsAmount = 0;

const onShowMoreButtonNodeClick = (evt) => {
  const filmListContainer = siteMainElement.querySelector('.films-list__container');

  evt.preventDefault();

  films
    .slice(renderedFilmsAmount, renderedFilmsAmount + FILMS_STEP)
    .forEach((film) => renderCard(filmListContainer, film));

  renderedFilmsAmount += FILMS_STEP;

  if (renderedFilmsAmount >= films.length) {
    siteMoreButtonElement.remove();
  }
};

siteMoreButtonElement.addEventListener('click', onShowMoreButtonNodeClick);

siteMoreButtonElement.click();

const filmListRatedInner = filmListRated.getElement().querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  renderCard(filmListRatedInner, film);
});

const filmListCommentedInner = filmListCommented.getElement().querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  renderCard(filmListCommentedInner, film);
});

render(siteFooterElement, new FooterStats(films).getElement(), InsertPosition.BEFOREEND);

// if (films.length <= 0) {
//   sortFilmListComponent.removeElement();
//   filmListRated.removeElement();
//   filmListCommented.removeElement();
//   filmListComponent.removeElement();
//   render(siteMainElement, new NoFilms().getElement(), InsertPosition.BEFOREEND);
// }
const showEmptyDatabaseMessage = () => {
  removeComponent(sortFilmListComponent);
  removeComponent(filmListRated);
  removeComponent(filmListCommented);
  removeComponent(filmListComponent);

  render(siteMainElement, new NoFilms(), InsertPosition.BEFOREEND);
};

if (!films.length) {
  showEmptyDatabaseMessage();
}
