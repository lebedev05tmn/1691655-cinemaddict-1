import { FilterType } from '../../consts';

const NoFilmsMessage = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

export const createFilmsListTemplate = (filterType, isEmptyList, isExtra) =>
  `<section class="films-list ${ isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${ !(isEmptyList || isExtra) ? 'visually-hidden' : ''}">${ NoFilmsMessage[filterType] }</h2>
  </section>`;

