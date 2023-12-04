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

    const allFilmsList = this.boardFilms
      .slice(0, FilmCardsOnPage.ALL);
    const topRatedList = this.boardFilms
      .sort(() => Math.random - 0.5)
      .sort((filmA, filmB) => filmB.film_info.total_rating - filmA.film_info.total_rating)
      .slice(0, FilmCardsOnPage.TOP_RATED);
    const recommendedFilmList = this.boardFilms
      .sort(() => Math.random - 0.5)
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length)
      .slice(0, FilmCardsOnPage.RECOMMENDED);

    const allFilmListComponent = new SiteFilmListView(allFilmsList);
    const topRatedListComponent = new SiteFilmListView(topRatedList, true);
    const recommendedFilmListComponent = new SiteFilmListView(recommendedFilmList, true);

    const filmsContainer = document.querySelector('.films');

    render(allFilmListComponent, filmsContainer);
    render(topRatedListComponent, filmsContainer);
    render(recommendedFilmListComponent, filmsContainer);
  }
}
