import AbstractView from '../../framework/view/abstract-view';
import { createSortTemplate } from './site-sort.tpl';

export default class SiteSortView extends AbstractView {
  #currentSort = null;

  constructor (currentSort) {
    super();
    this.#currentSort = currentSort;
  }

  get template() {
    return createSortTemplate(this.#currentSort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
