import AbstractView from '../../framework/view/abstract-view';
import { createFilmListTemplate } from './site-film-card.tpl';

export default class SiteFilmListView extends AbstractView {

  constructor (filmList, isExtra = false) {
    super();
    this.filmList = filmList;
    this.isExtra = isExtra;
  }

  get template () {
    return createFilmListTemplate(this.filmList, this.isExtra);
  }

}
