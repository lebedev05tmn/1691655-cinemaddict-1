import { FilterType, SortType } from '../consts';
import { render } from '../framework/render';
import SiteFilmListView from '../view/site-films-list/site-film-list-view';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import SiteSortView from '../view/site-sort/site-sort-view';

export default class MainPresenter {

  constructor(container) {
    this.container = container;
    // this.init();
  }

  init () {
    render(new SiteFiltersView(FilterType.ALL), this.container);
    render(new SiteSortView(SortType.DEFAULT), this.container);
    render(new SiteFilmListView(), this.container);
  }
}
