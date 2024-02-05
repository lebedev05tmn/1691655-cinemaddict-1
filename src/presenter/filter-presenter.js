import { FilterType } from '../consts';
import { render } from '../framework/render';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import { filter } from '../utils/filter';

const FilteredFilmsCount = {
  ALL: 0,
  WATCHLIST: 0,
  HISTORY: 0,
  FAVORITES: 0,
};

export default class FilterPresenter {
  #container = null;
  #filterModel = null;
  #filmsModel = null;
  #filteredFilmsCount = null;

  constructor (container, filterModel, filmsModel) {
    this.#container = container;

    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filteredFilmsCount = FilteredFilmsCount;
  }

  init = () => {
    Object.keys(FilterType).map((key) => {
      this.#filteredFilmsCount[key] = filter[FilterType[key]](this.#filmsModel.films).length;
    });

    render(new SiteFiltersView(this.#filterModel.filter, this.#filteredFilmsCount), this.#container);
  };
}
