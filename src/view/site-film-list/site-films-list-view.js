import AbstractView from '../../framework/view/abstract-view';
import { createFilmsListTemplate } from './site-films-list.tpl';

export default class SiteFilmsListView extends AbstractView {
  constructor () {
    super();
  }

  init ({
    titleName,
    isEmptyList = false,
    isExtra = false,
  } = {}) {
    this.titleName = titleName;
    this.isEmptyList = isEmptyList;
    this.isExtra = isExtra;
  }

  get template () {
    return createFilmsListTemplate(this.titleName, this.isEmptyList, this.isExtra);
  }
}
