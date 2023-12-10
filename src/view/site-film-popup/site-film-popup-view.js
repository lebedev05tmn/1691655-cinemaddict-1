import AbstractView from '../../framework/view/abstract-view';
import { createFilmPopup } from './site-film-popup.tpl';

export default class SiteFilmPopupView extends AbstractView {
  #film = {};

  constructor (film) {
    super();
    this.#film = film;
  }

  get template () {
    return createFilmPopup(this.#film);
  }
}
