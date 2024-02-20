import AbstractView from '../../framework/view/abstract-view';
import { createStatisticsTemplate } from './site-statistics.tpl';

export default class SiteStatisticsView extends AbstractView {
  #filmsNumber = null;

  constructor (filmsNumber) {
    super();
    this.#filmsNumber = filmsNumber;
  }

  get template () {
    return createStatisticsTemplate(this.#filmsNumber);
  }
}
