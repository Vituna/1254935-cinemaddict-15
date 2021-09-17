export const CARD_COUNT = 5;
export const FILMS_STEP = 5;
export const EXTRA_FILM_CARDS_COUNT = 2;
export const TOP_RATED_COUNT = 8;
export const BAR_HEIGHT_SIZE = 50;
export const TIME_COUNT = 1;
export const ZERO_FILMS_COUNT = 0;
export const MIN_FILMS_COUNT = 20;
export const MAX_FILMS_COUNT = 20;
export const MAX_DESCRIPTION_LENGTH = 139;


export const InsertPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREEND: 'beforeend',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const CardMode = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
};

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATS: 'Stats',
};

export const UpdateType = {
  INIT: 'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const ProfileRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  UPDATE_POPUP: 'UPDATE_POPUP',
};

export const StatsFilterType = {
  ALL: 'all-time',
  YEAR: 'year',
  MONTH: 'month',
  WEEK: 'week',
  TODAY: 'today',
};

export const Pages = {
  FILMS: 'films',
  STATS: 'stats',
};

export const FilmDurationFormat = {
  MINUTE: 'minute',
  HOUR: 'hour',
  DAY: 'day',
};

export const emojis = ['angry', 'sleeping', 'puke', 'smile'];

export const AUTHORIZATION = 'Basic hfgyenhgsqfrtnm456934yh1';
export const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const NoFilmsListTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};
