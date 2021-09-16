import {FilmDurationFormat, FilterType, ZERO_FILMS_COUNT, MIN_FILMS_COUNT, MAX_FILMS_COUNT, ProfileRank, TIME_COUNT} from './constants.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const sortByDate = (filmA, filmB) => dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));

export const sortByRating = (filmA, filmB) => (filmB.filmRating > filmA.filmRating) ? 1 : -1;

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isCtrlEnterEvent = (evt) => evt.ctrlKey && evt.key === 'Enter';

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

export const getListFromArr = (items) => items.join(', ');

export const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

export const getUserRating = (watchedFilmsCount) => {
  const isNoviceRank = watchedFilmsCount > ZERO_FILMS_COUNT && watchedFilmsCount <= MIN_FILMS_COUNT;
  const isFanRank = watchedFilmsCount > MIN_FILMS_COUNT && watchedFilmsCount <= MAX_FILMS_COUNT;
  const isMovieBuffRank = watchedFilmsCount > MAX_FILMS_COUNT;

  if (isNoviceRank) {
    return ProfileRank.NOVICE;
  } else if (isFanRank) {
    return ProfileRank.FAN;
  } else if (isMovieBuffRank) {
    return ProfileRank.MOVIE_BUFF;
  } else {
    return '';
  }
};

export const filterStatsByWatchingDate = (films, period) => {
  const deadline = dayjs().subtract(TIME_COUNT, period);
  return films.filter((movie) => dayjs(movie.watchingDate).diff(deadline, 'minute') > 0);
};

export const isOnline = () => window.navigator.onLine;
