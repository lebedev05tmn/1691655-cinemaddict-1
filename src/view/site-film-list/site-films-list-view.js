import AbstractView from '../../framework/view/abstract-view';
import { createFilmsListTemplate } from './site-films-list.tpl';

export default class SiteFilmsListView extends AbstractView {

  constructor (title = 'All movies. Upcoming', isExtra = false) {
    super();
    this.title = title;
    this.isExtra = isExtra;
  }

  get template () {
    return createFilmsListTemplate(this.title, this.isExtra);
  }

}
