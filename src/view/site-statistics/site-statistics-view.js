import AbstractView from '../../framework/view/abstract-view';
import { createStatisticsTemplate } from './site-statistics.tpl';

export default class SiteStatisticsView extends AbstractView {
  constructor () {
    super();
  }

  get template () {
    return createStatisticsTemplate();
  }
}
