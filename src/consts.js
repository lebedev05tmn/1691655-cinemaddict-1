export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const FilmListTitles = {
  LOADING: 'Loading...',
  ALL_FILMS: 'All movies. Upcoming',
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  TOP_RATED: 'Top Rated',
  MOST_COMMENTED: 'Most Commented',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const ViewActions = {
  FILM: 'FILM',
  UPDATE_COMMENT: 'UPDATE',
  DELETE_COMMENT: 'DELETE',
};

export const CommentReactions = {
  SMILE: './images/emoji/smile.png',
  SLEEPING: './images/emoji/sleeping.png',
  PUKE: './images/emoji/puke.png',
  ANGRY: './images/emoji/angry.png',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const FilmCardsOnPage = {
  ALL_PER_STEP: 5,
  TOP_RATED: 2,
  RECOMMENDED: 2
};

export const FilteredFilmsCount = {
  ALL: 0,
  WATCHLIST: 0,
  HISTORY: 0,
  FAVORITES: 0,
};

export const FilmPropertyRelation = {
  favorite: 'favorite',
  watchlist: 'watchlist',
  watched: 'alreadyWatched',
};

export const FetchMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const filmsContainerName = {
  COMMON_LIST: 'COMMON_LIST',
  TOP_RATED_FILMS: 'TOP_RATED_FILMS',
  MOST_COMMENTED_FILMS: 'MOST_COMMENTED_FILMS',
};

export const END_POINT = 'https://20.objects.htmlacademy.pro/cinemaddict/';
export const AUTHORIZATION = 'Basic dmV0cm92Nzg6dmV0cm92Nzg=';
export const ENTER_CODE = 13;
export const EXTRA_FILMS_NUMBER = 2;
