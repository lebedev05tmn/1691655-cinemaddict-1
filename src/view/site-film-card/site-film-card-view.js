import { FilmProperty } from '../../consts';
import AbstractView from '../../framework/view/abstract-view';
import { createFilmCard } from './site-film-card.tpl';

export default class SiteFilmCardView extends AbstractView {
  #film = null;
  #handleOpenPopup = null;
  #handleFilmPropertyClick = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template () {
    return createFilmCard(this.#film);
  }

  #propertyClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.propertyChangeClick(evt.target);
  };

  setPropertyClickHandler = (callback) => {
    this._callback.propertyChangeClick = callback;

    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#propertyClickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#propertyClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#propertyClickHandler);
  };

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  };

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupClickHandler);
  };
}
