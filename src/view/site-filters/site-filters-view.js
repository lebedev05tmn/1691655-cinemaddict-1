import AbstractView from '../../framework/view/abstract-view';
import { createFiltersTemplate } from './site-filters.tpl';

export default class SiteFiltersView extends AbstractView {
  #filter = null;
  #filteredFilmsCount = null;

  constructor (currentFilter, filteredFilmsCount) {
    super();
    this.#filter = currentFilter;
    this.#filteredFilmsCount = filteredFilmsCount;
  }

  get template () {
    return createFiltersTemplate(this.#filter, this.#filteredFilmsCount);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target);
  };
}
