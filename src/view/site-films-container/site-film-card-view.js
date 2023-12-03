import AbstractView from '../../framework/view/abstract-view';
import { createFilmCard } from './site-film-card.tpl';

export default class SiteFilmCardView extends AbstractView {
  get template () {
    return createFilmCard();
  }
}
