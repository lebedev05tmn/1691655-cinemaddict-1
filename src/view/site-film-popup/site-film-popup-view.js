import AbstractView from '../../framework/view/abstract-view';
import { createFilmPopup } from './site-film-popup.tpl';

export default class SiteFilmPopupView extends AbstractView {
  #film = {};
  #comments = [];

  constructor (film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template () {
    return createFilmPopup(this.#film, this.#comments);
  }
}
