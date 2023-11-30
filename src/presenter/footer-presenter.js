import { render } from '../framework/render';
import SiteStatisticsView from '../view/site-statistics/site-statistics-view';

export default class FooterPresenter {
  constructor (container) {
    this.container = container;
    // this.init();
  }

  init () {
    render(new SiteStatisticsView(), this.container);
  }
}
