import { FilterType } from '../../consts';

const createFiltersItem = (filterType, currentFilter) =>
  `<a
    href="#${filterType}"
    class="main-navigation__item ${filterType === currentFilter ? 'main-navigation__item--active' : ''}"
  >
    ${filterType}
    ${filterType !== FilterType.ALL ? '<span class="main-navigation__item-count">13</span>' : ''}
  </a>`;

export const createFiltersTemplate = (currentFilter) => {

  const filters = Object.values(FilterType).map((filter) => createFiltersItem(filter, currentFilter)).join('');

  return `<nav class="main-navigation">
            ${filters}
          </nav>`;
};
