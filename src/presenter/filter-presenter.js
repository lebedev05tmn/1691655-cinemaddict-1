import { FilterType, FilteredFilmsCount } from '../consts';
import { RenderPosition, remove, render } from '../framework/render';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import { filter } from '../utils/filter';

export default class FilterPresenter {
  #container = null;
  #filterComponent = null;

  #filterModel = null;
  #filmsModel = null;
  #filteredFilmsCount = null;

  constructor (container, filterModel, filmsModel) {
    this.#container = container;
    this.#filterComponent = null;

    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filteredFilmsCount = FilteredFilmsCount;
  }

  init = () => {
    Object.keys(FilterType).map((key) => {
      this.#filteredFilmsCount[key] = filter[FilterType[key]](this.#filmsModel.films).length;
    });

    this.#filterComponent = new SiteFiltersView(this.#filterModel.filter, this.#filteredFilmsCount);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    render(this.#filterComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  destroy = () => {
    remove(this.#filterComponent);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType.id) {
      return;
    }
    this.#filterModel.setFilter(filterType.id);
  };
}
