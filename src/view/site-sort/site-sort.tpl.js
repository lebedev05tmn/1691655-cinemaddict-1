import { SortType } from '../../consts';

const createSortItemTemplate = (sortType, currentSort) =>
  `<li>
    <a
      href="#"
      class="sort__button ${sortType === currentSort ? 'sort__button--active' : ''}"
    >
      Sort by ${sortType}
    </a>
  </li>`;

export const createSortTemplate = (currentSort) => {
  let sortList = '';

  Object.keys(SortType).forEach(
    (key) => {
      sortList += createSortItemTemplate(SortType[key], currentSort);
    }
  );

  return `<ul class="sort">
            ${sortList}
          </ul>`;
};
