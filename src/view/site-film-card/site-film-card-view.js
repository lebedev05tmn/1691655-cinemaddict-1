import AbstractView from '../../framework/view/abstract-view';
import { createFilmCard } from './site-film-card.tpl';

export default class SiteFilmCardView extends AbstractView {
  constructor(film) {
    super();
    this.film = film;
  }

  get template () {
    return createFilmCard(this.film);
  }
}
