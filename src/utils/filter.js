import { FilterType } from '../consts';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite === true),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched === true),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist === true),
};
