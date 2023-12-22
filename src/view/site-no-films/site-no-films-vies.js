import AbstractView from '../../framework/view/abstract-view';
import { createNoFilmsView } from './site-no-films.tpl';

export default class NoFilmsTemplate extends AbstractView {
  #filterType = null;

  constructor ({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createNoFilmsView(this.#filterType);
  }
}
