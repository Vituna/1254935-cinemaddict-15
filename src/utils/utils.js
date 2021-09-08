import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import duration from 'dayjs/plugin/duration.js';
import {FilmDurationFormat, FilterType, ZERO_FILMS_COUNT, MIN_FILMS_COUNT, MAX_FILMS_COUNT, ProfileRank, TIME_COUNT} from './const.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateData = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);
  return data[randomIndex];
};

const generateDate = () => {
  const maxDaysGap = 50;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const getRandomNonRepeatingNumbers = (min, max) => {
  const previousValues = [];
  let currentValue = getRandomInteger(min, max);
  if (previousValues.length >= (max - min + 1)) {
    throw new Error(`Перебраны все числа из диапазона от ${  min  } до ${  max}`);
  }
  while (previousValues.includes(currentValue)) {
    currentValue = getRandomInteger(min, max);
  }
  previousValues.push(currentValue);
  return currentValue;
};

const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

const getRandomComments = (arr) => {
  const sortedComments = arr.sort(() => .5 - Math.random());
  const numberComments = sortedComments.slice(0, getRandomInteger(1, 5));
  return numberComments;
};

const generateCountData = (limit, component, date) => {
  let filmCardList = '';
  for (let i = 0; i < limit; i++) {
    filmCardList += component(date[i]);
  }
  return filmCardList;
};

const filterNameToCountFilms = {
  'All movies': (films) => films.length,
  'Watchlist': (films) => films
    .filter((film) => film.watchlist)
    .length,
  'History': (films) => films
    .filter((film) => film.alreadyWatched)
    .length,
  'Favorites': (films) => films
    .filter((film) => film.favorite)
    .length,
};

const generateFilters = (films) => Object
  .entries(filterNameToCountFilms)
  .map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }));

const sortByDate = (filmA, filmB) => dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));

const sortByRating = (filmA, filmB) => (filmB.filmRating > filmA.filmRating) ? 1 : -1;

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isViewed),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [FilterType.STATS]: (films) => films,
};
export const getTotalFilmsDuration = (films, format) => {
  const totalDuration = films.reduce((acc, rec) => acc + rec.runtime, 0);
  switch (format) {
    case FilmDurationFormat.HOUR:
      return dayjs.duration(totalDuration, 'm').format('H');
    case FilmDurationFormat.MINUTE:
      return dayjs.duration(totalDuration, 'm').format('m');
    case FilmDurationFormat.DAY:
      return dayjs.duration(totalDuration, 'm').format('D');
  }
};

export const getGenres = (films) => {
  const genres = new Set();
  films.forEach((film) => film.genres.forEach((genre) => genres.add(genre)));
  return genres;
};

export const countGenres = (films) => {
  const allFilmsGenres = [];
  films.forEach((film) => allFilmsGenres.push(...film.genres));
  const genres = [];

  getGenres(films).forEach((genre) =>
    genres.push({
      genre: genre,
      count: allFilmsGenres.filter((allMoviesgenre) => allMoviesgenre === genre).length,
    }),
  );
  return genres;
};

export const getGenresCount = (films) => {
  const count = [];
  countGenres(films).forEach((genre) => count.push(genre.count));
  return count;
};

export const getTopGenre = (films) => {
  const topGenre = countGenres(films);
  topGenre.sort((prev, next) => next.count - prev.count);
  return topGenre[0].genre;
};
export const getFormatDate = (date, format) => dayjs(date).format(format);
export const getDurationTime = (time, type) => {
  const { hours, minutes } = dayjs.duration(time, type).$d;

  return `${hours}h ${minutes}m`;
};
export const getListFromArr = (arr) => arr.join(', ');

export const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

export const getUserRating = (watchedCount) => {
  const isNoviceRank = watchedCount > ZERO_FILMS_COUNT && watchedCount <= MIN_FILMS_COUNT;
  const isFanRank = watchedCount > MIN_FILMS_COUNT && watchedCount <= MAX_FILMS_COUNT;
  const isMovieBuffRank = watchedCount > MAX_FILMS_COUNT;

  switch (watchedCount) {
    case isNoviceRank:
      return ProfileRank.NOVICE;
    case isFanRank:
      return ProfileRank.FAN;
    case isMovieBuffRank:
      return ProfileRank.MOVIE_BUFF;
    default:
      return '';
  }
};

export const filterStatsByWatchingDate = (films, period) => {
  const deadline = dayjs().subtract(TIME_COUNT, period);
  return films.filter((movie) => dayjs(movie.watchingDate).diff(deadline, 'minute') > 0);
};
export {generateData, generateDate, getRandomInteger, getRandomNonRepeatingNumbers, getRandomFloat, getRandomComments, generateCountData, generateFilters, sortByDate, sortByRating, updateItem, isEscEvent};
