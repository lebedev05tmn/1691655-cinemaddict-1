import AbstractView from '../../framework/view/abstract-view';
import { createFilmsLoadingComponent } from './site-films-loading.tpl';

export default class SiteFilmsLoadingView extends AbstractView {
  get template () {
    return createFilmsLoadingComponent();
  }
}
