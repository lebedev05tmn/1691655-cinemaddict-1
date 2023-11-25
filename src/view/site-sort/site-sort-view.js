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
}
