import AbstractView from '../../framework/view/abstract-view';
import { createFilmListContainer } from './site-film-list-container.tpl';

export default class SiteFilmListContainerView extends AbstractView {
  constructor() {
    super();
  }

  get template () {
    return createFilmListContainer();
  }
}
