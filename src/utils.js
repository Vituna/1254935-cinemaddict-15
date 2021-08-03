import dayjs from 'dayjs';

const CARD_COUNT = 5;

const InsertPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
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
  all: (films) => films.length,
  watchlist: (films) => films
    .filter((film) => film.userDetails.isToWatch)
    .length,
  history: (films) => films
    .filter((film) => film.userDetails.isWatched)
    .length,
  favorites: (films) => films
    .filter((film) => film.userDetails.isFavorite)
    .length,
};

const generateFilters = (films) => Object
  .entries(filterNameToCountFilms)
  .map(([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }));

const getFilterCountByName = (filters, filterName) => filters.find(({ name }) => name === filterName).count;


export {CARD_COUNT, InsertPosition, render, generateData, generateDate, getRandomInteger, getRandomNonRepeatingNumbers, getRandomFloat, getRandomComments, generateCountData, generateFilters, getFilterCountByName};
