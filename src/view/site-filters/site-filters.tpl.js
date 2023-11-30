import { FilterType } from '../../consts';

const createFiltersItem = (filterType, currentFilter) =>
  `<a
    href="#${filterType}"
    class="main-navigation__item ${filterType === currentFilter ? 'main-navigation__item--active' : ''}"
  >
    All movies
    ${filterType !== FilterType.ALL ? '<span class="main-navigation__item-count">13</span>' : ''}
  </a>`;

export const createFiltersTemplate = (currentFilter) => {
  let filters = '';

  Object.keys(FilterType).forEach ((key) => {
    filters += createFiltersItem(FilterType[key], currentFilter);
  });

  return `<nav class="main-navigation">
            ${filters}
          </nav>`;
};
