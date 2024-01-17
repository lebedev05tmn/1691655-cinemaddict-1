import AbstractView from '../../framework/view/abstract-view';
import { createFilmsListTemplate } from './site-films-list.tpl';

export default class SiteFilmsListView extends AbstractView {

  constructor () {
    super();
  }

  init ({
    title = 'All movies. Upcoming',
    isEmptyList = false,
    isExtra = false,
  } = {}) {
    this.title = title;
    this.isEmptyList = isEmptyList;
    this.isExtra = isExtra;
  }

  get template () {
    return createFilmsListTemplate(this.title, this.isEmptyList, this.isExtra);
  }
}
