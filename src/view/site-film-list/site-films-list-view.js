import AbstractView from '../../framework/view/abstract-view';
import { createFilmsListTemplate } from './site-films-list.tpl';

export default class SiteFilmsListView extends AbstractView {
  #filterType = null;

  constructor () {
    super();
  }

  init ({
    filterType,
    isEmptyList = false,
    isExtra = false,
  } = {}) {
    this.#filterType = filterType;
    this.isEmptyList = isEmptyList;
    this.isExtra = isExtra;
  }

  get template () {
    return createFilmsListTemplate(this.#filterType, this.isEmptyList, this.isExtra);
  }
}
