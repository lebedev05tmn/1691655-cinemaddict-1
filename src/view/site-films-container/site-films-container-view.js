import AbstractView from '../../framework/view/abstract-view';
import { createFilmsContainer } from './site-films-container.tpl';

export default class SiteFilmsContainerView extends AbstractView {
  get template () {
    return createFilmsContainer();
  }
}
