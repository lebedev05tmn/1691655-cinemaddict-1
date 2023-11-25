import AbstractView from '../../framework/view/abstract-view';
import { createFilmCardsTemplate } from './site-film-card.tpl';

export default class SiteFilmListView extends AbstractView {
  get template () {
    return createFilmCardsTemplate();
  }
}
