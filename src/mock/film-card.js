import {generateData, generateDate, getRandomInteger, getRandomFloat, getRandomComments} from '../utils.js';

const titleMock = [
  'All movies. Upcoming',
  'Sagebrush Trail',
  'The Dance of Life',
  'The Man with the Golden Arm',
  'The Great Flamarion',
  'Santa Claus Conquers the Martians',
  'Made for Each Other',
];

const posterMock = [
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'the-dance-of-life.jpg',
  'the-man-with-the-golden-arm.jpg',
  'the-great-flamarion.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'made-for-each-other.png',
];

const genreMock = [
  'Cartoon',
  'Western',
  'Musical',
  'Drama',
  'Comedy',
];

const directorMock = [
  'Tom Ford',
  'Pic Puk',
  'Gosha',
  'VVP',
];

const countryMock = [
  'Finland',
  'Russia',
  'Serbia',
  'Brazil',
];

const descriptionMock = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const commentsMock = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const autorMock = [
  'Ilya',
  'Petya',
  'Vova',
  'Nina',
  'Katya',
];

export const emojiMock = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const createComment = (id) => ({
  id,
  author: generateData(autorMock),
  comment: generateData(commentsMock),
  date: '2019-05-11T16:12:32.554Z',
  emotion: generateData(emojiMock),
});

const getIndexes = (count) => [...Array(count).keys()];

const generateFilmCard = (id) => {
  const dueData = generateDate();
  const similarComments = getIndexes(getRandomInteger(0, 5)).map(createComment);

  return {
    id,
    comments: similarComments,
    filmInfo: {
      title: generateData(titleMock),
      alternativeTitle: generateData(titleMock),
      totalRating: getRandomFloat(1, 10).toFixed(1),
      poster: generateData(posterMock),
      ageRating: getRandomInteger(0, 18) ,
      director: generateData(directorMock),
      writers: [
        'Takeshi Kitano',
      ],
      actors: [
        'Morgan Freeman',
      ],
      release: {
        date: dueData,
        releaseCountry: generateData(countryMock),
      },
      runtime: `${getRandomInteger(0, 3)}h ${0, 59}m`,
      genre: genreMock,
      description: getRandomComments(descriptionMock).join(''),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: dueData,
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};

export {generateFilmCard, createComment};
