import {InsertPosition, generateFilters, renderElement} from './utils.js';
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
// import CommentList from './view/popup-comment.js';
// import NewCommentView from './view/film-comment-add.js';
import FooterStats from './view/footer-stats.js';

// import {films} from './view/films.js';

const FILMS_STEP = 5;
const SORT_TYPES = ['default', 'date', 'rating'];

const FILMS_LIST_COUNT = 20;

const films = new Array(FILMS_LIST_COUNT).fill().map((item, index) => generateFilmCard(index + 1));
// const comments = new Array(getRandomInteger(3, 20)).fill('').map(generateFilmCard());
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

renderElement(siteHeaderElement, new Profile().getElement(), InsertPosition.BEFOREEND);
renderElement(siteMainElement, new Menu(filters).getElement(), InsertPosition.BEFOREEND);
renderElement(siteMainElement, new SortFilmList(SORT_TYPES, SORT_TYPES[0]).getElement(), InsertPosition.BEFOREEND);
renderElement(siteMainElement, new FilmsList().getElement(), InsertPosition.BEFOREEND);

const filmContainer = siteMainElement.querySelector('.films');

renderElement(filmContainer, new FilmRated().getElement(), InsertPosition.BEFOREEND);
renderElement(filmContainer, new FilmCommented().getElement(), InsertPosition.BEFOREEND);

const filmsList = siteMainElement.querySelector('.films-list');
renderElement(filmsList, new ShowMoreButton().getElement(), InsertPosition.BEFOREEND);

const siteMoreButtonElement = siteMainElement.querySelector('.films-list__show-more');

const renderCard = (container, film) => {
  // const showFilmPopup = (filmData) => {
  //   renderElement(siteFooterStatisticsElement, new FilmPopup().getElement(filmData), InsertPosition.AFTEREND);


  //   const closePopupClickHandler = () => {
  //     document.querySelector('body').classList.remove('hide-overflow');
  //     new FilmPopup().removeElement();
  //   };

  //   const onEscKeyDown = (evt) => {
  //     if (evt.key === 'Escape' || evt.key === 'Esc') {
  //       evt.preventDefault();
  //       closePopupClickHandler();
  //       document.removeEventListener('keydown', onEscKeyDown);
  //     }
  //   };

  //   document.addEventListener('keydown', onEscKeyDown);

  //   new FilmPopup().getElement()
  //     .querySelector('.film-details__close-btn').addEventListener('click', closePopupClickHandler);
  // };

  const openPopupClickHandler = () => {
    new FilmPopup().removeElement();
    // showFilmPopup(film);
  };

  new FilmCard(film).getElement().querySelector('.film-card__poster')
    .addEventListener('click', openPopupClickHandler);

  return renderElement(container, new FilmCard(film).getElement(), InsertPosition.BEFOREEND);
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

const filmListRatedInner = new FilmRated().getElement().querySelector('.films-list__container');
ratedFilms.forEach((film) => {
  renderCard(filmListRatedInner, film);
});

const filmListCommentedInner = new FilmCommented().getElement().querySelector('.films-list__container');
commentedFilms.forEach((film) => {
  renderCard(filmListCommentedInner, film);
});

renderElement(siteFooterElement, new FooterStats(films).getElement(), InsertPosition.BEFOREEND);
