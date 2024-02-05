import { FilterType } from '../consts';
import { render } from '../framework/render';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import { filter } from '../utils/filter';

const FilterStatus = {
  WATCHLIST: true,
  HISTORY: true,
  FAVORITES: true,
};

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #filmsModel = null;
  #filterStatus = null;

  constructor (container, filterModel, filmsModel) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#filterStatus = FilterStatus;
    this.#filmsModel = filmsModel;
  }

  init = () => {
    Object.keys(FilterStatus).map((key) => {
      this.#filterStatus[key] = filter[FilterType[key]](this.#filmsModel.films).length > 0;
    });

    render(new SiteFiltersView(FilterType.ALL), this.#container);
  };
}
