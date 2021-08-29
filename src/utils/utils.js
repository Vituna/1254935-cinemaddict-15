import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(relativeTime);

const CARD_COUNT = 5;

const InsertPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

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

const sortByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));

const sortByRating = (filmA, filmB) => (filmB.filmInfo.totalRating > filmA.filmInfo.totalRating) ? 1 : -1;

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

const CardMode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

const getRelativeTimeFromDate = (date) => dayjs(date).fromNow();

const FILMS_STEP = 5;

export {CARD_COUNT, InsertPosition, SortType, CardMode, FILMS_STEP, generateData, generateDate, getRandomInteger, getRandomNonRepeatingNumbers, getRandomFloat, getRandomComments, generateCountData, generateFilters, sortByDate, sortByRating, updateItem, isEscEvent, getRelativeTimeFromDate};
