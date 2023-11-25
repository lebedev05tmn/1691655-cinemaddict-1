import AbstractView from '../../framework/view/abstract-view';
import { createFiltersTemplate } from './site-filters.tpl';

export default class SiteFiltersView extends AbstractView {

  constructor (currentFilter) {
    super();
    this.filter = currentFilter;
  }

  get template () {

    return createFiltersTemplate(this.filter);
  }
}
