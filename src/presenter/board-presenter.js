import { FilmCardsOnPage, FilterType, SortType } from '../consts';
import { remove, render } from '../framework/render';
import SiteFilmListContainerView from '../view/site-film-list-container/site-film-list-container-view';
import SiteFilmsListView from '../view/site-film-list/site-films-list-view';
import SiteFilmsContainerView from '../view/site-films-container/site-films-container-view';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import ShowMoreButtonView from '../view/site-show-more-button/site-show-more-button-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import FilmPresenter from './film-presenter';

export default class BoardPresenter {
  #filmPresenters = new Map();

  #boardContainer = null;
  #filmsModel = null;
  #apiService = null;

  #showMoreButtonComponent = null;
  #noFilmsComponent = null;

  #allFilmsContainer = null;
  #filmsContainerComponent = null;
  #filmListContainerComponent = new SiteFilmListContainerView();

  #renderedFilmsNumber = FilmCardsOnPage.ALL_PER_STEP;
  #filterType = FilterType.ALL;

  constructor(boardContainer, filmsModel, apiService) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#apiService = apiService;
  }

  get films() {
    return this.#filmsModel.films;
    // return [];
  }

  init () {
    this.#renderBoard();

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  #renderBoard () {
    const filmsCount = this.films.length;
    const filtersComponent = new SiteFiltersView(FilterType.ALL);

    render(filtersComponent, this.#boardContainer);

    this.#allFilmsContainer = new SiteFilmsListView();
    this.#filmsContainerComponent = new SiteFilmsContainerView();

    if (filmsCount === 0) {
      render(this.#filmsContainerComponent, this.#boardContainer);

      this.#allFilmsContainer.init({title: FilterType.ALL, isEmptyList: true});
      render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

      return;
    }

    const sortComponent = new SiteSortView(SortType.DEFAULT);
    render(sortComponent, this.#boardContainer);

    render(this.#filmsContainerComponent, this.#boardContainer);

    this.#renderFilms(this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsNumber)));
    this.#renderShowMoreButton();
  }

  #renderFilms (films) {
    this.#allFilmsContainer.init();
    render(this.#allFilmsContainer, this.#filmsContainerComponent.element);
    render(this.#filmListContainerComponent, this.#allFilmsContainer.element);

    films.forEach((film) => this.#renderFilm(film));
  }

  #renderFilm (film) {
    const filmPresenter = new FilmPresenter({
      film: film,
      filmListContainer: this.#filmListContainerComponent.element,
      onFilmCardClick: this.#handleFilmCardClick,
      changeData: this.#handleViewAction,
      apiService: this.#apiService,
    });

    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #renderShowMoreButton () {
    this.#showMoreButtonComponent = new ShowMoreButtonView({onClick: this.#handleShowMoreButtonClick});
    render(this.#showMoreButtonComponent, this.#filmListContainerComponent.element);
  }

  #handleShowMoreButtonClick = () => {
    const filmsNumber = this.films.length;
    const newRenderedFilmsCount = Math.min(this.#renderedFilmsNumber + FilmCardsOnPage.ALL_PER_STEP, filmsNumber);
    const films = this.films.slice(this.#renderedFilmsNumber, newRenderedFilmsCount);

    remove(this.#showMoreButtonComponent);
    this.#renderFilms(films);

    this.#renderedFilmsNumber = newRenderedFilmsCount;
    if (this.#renderedFilmsNumber < filmsNumber) {
      this.#renderShowMoreButton();
    }
  };

  #handleFilmCardClick = () => {
    this.#filmPresenters.forEach((presenter) => presenter.removePopup());
  };

  #handleViewAction = async (update) => {
    await this.#filmsModel.updateFilm(update);
  };

  #handleModelEvent = (data) => {
    this.#filmPresenters.get(data.id).init(data);
  };
}
