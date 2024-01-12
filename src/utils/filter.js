import { FilterType } from '../consts';

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.user_details.favorite === true),
};
