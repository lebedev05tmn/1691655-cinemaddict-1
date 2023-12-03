import { FilmCardsOnPage, FilterType, SortType } from '../consts';
import { render } from '../framework/render';
import SiteFilmListView from '../view/site-film-list/site-film-list-view';
import SiteFilmContainerView from '../view/site-films-container/site-film-container-view';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import SiteSortView from '../view/site-sort/site-sort-view';

export default class BoardPresenter {

  filmsContainerComponent = new SiteFilmContainerView();

  constructor(boardContainer, filmsModel) {
    this.boardContainer = boardContainer;
    this.filmsModel = filmsModel;
  }

  init () {
    this.boardFilms = [...this.filmsModel.getFilms()];

    render(new SiteFiltersView(FilterType.ALL), this.boardContainer);
    render(new SiteSortView(SortType.DEFAULT), this.boardContainer);

    render(this.filmsContainerComponent, this.boardContainer);

    const allFilmsList = this.boardFilms.slice(0, FilmCardsOnPage.ALL);
    const filmListComponent = new SiteFilmListView(allFilmsList);
    const filmsContainer = document.querySelector('.films');

    render(filmListComponent, filmsContainer);
  }
}
