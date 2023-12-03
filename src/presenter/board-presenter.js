import { FilterType, SortType } from '../consts';
import { render } from '../framework/render';
import SiteFilmView from '../view/site-films-container/site-film-card-view';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import SiteSortView from '../view/site-sort/site-sort-view';

export default class BoardPresenter {

  filmsContainerComponent = new

  constructor(boardContainer, filmsModel) {
    this.boardContainer = boardContainer;
    this.filmsModel = filmsModel;
  }

  init () {
    this.boardFilms = [...this.filmsModel.getFilms()];

    render(new SiteFiltersView(FilterType.ALL), this.boardContainer);
    render(new SiteSortView(SortType.DEFAULT), this.boardContainer);

    for (let i = 0; i < this.boardFilms.length; i++) {
      render(new SiteFilmView({film: this.boardFilms[i]}), fil);
    }
  }
}
