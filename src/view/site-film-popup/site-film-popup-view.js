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

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  setClosePopupHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
  };

  #propertyClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.propertyChangeClick(evt.target, true);
  };

  setPropertyClickHandler = (callback) => {
    this._callback.propertyChangeClick = callback;

    this.element.querySelector('#watchlist').addEventListener('click', this.#propertyClickHandler);
    this.element.querySelector('#watched').addEventListener('click', this.#propertyClickHandler);
    this.element.querySelector('#favorite').addEventListener('click', this.#propertyClickHandler);
  };
}
