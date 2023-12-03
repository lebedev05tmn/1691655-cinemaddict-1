import AbstractView from '../../framework/view/abstract-view';
import { createFilmListTemplate } from './site-film-card.tpl';

export default class SiteFilmListView extends AbstractView {

  constructor (filmList) {
    super();
    this.filmList = filmList;
  }

  get template () {
    return createFilmListTemplate(this.filmList);
  }

}
