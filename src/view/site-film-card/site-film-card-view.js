import AbstractView from '../../framework/view/abstract-view';
import { createFilmCard } from './site-film-card.tpl';

export default class SiteFilmCardView extends AbstractView {
  #film = null;
  #handleOpenPopup = null;

  constructor({ film, onFilmCardClick }) {
    super();
    this.#film = film;
    this.#handleOpenPopup = onFilmCardClick;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#openPopupClickHandler);
  }

  get template () {
    return createFilmCard(this.#film);
  }

  #openPopupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleOpenPopup();
  };
}
