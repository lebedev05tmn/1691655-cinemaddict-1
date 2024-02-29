import AbstractView from '../../framework/view/abstract-view';
import { createFilmsListContainer } from './site-films-list-container.tpl';

export default class SiteFilmsListContainerView extends AbstractView {
  constructor() {
    super();
  }

  get template () {
    return createFilmsListContainer();
  }
}
