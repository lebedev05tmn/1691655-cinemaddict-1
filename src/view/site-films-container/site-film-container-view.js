import AbstractView from '../../framework/view/abstract-view';
import { createFilmsContainer } from './site-film-container.tpl';

export default class SiteFilmContainerView extends AbstractView {
  get template () {
    return createFilmsContainer();
  }
}
