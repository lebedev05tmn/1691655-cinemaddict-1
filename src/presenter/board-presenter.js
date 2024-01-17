import { FilmCardsOnPage, FilterType, SortType } from '../consts';
import { remove, render } from '../framework/render';
import { sortTimeDescending } from '../utils/utils';
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
  #allFilmsContainer = null;

  #filmsModel = null;
  #apiService = null;

  #filtersComponent = null;
  #showMoreButtonComponent = null;
  #filmsContainerComponent = null;
  #sortComponent = null;
  #filmListContainerComponent = new SiteFilmListContainerView();

  #renderedFilmsNumber = FilmCardsOnPage.ALL_PER_STEP;
  #sortType = SortType.DEFAULT;

  constructor(boardContainer, filmsModel, apiService) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#apiService = apiService;
  }

  get films() {
    const films = Array.from(this.#filmsModel.films);

    switch (this.#sortType) {
      case SortType.RATING:
        return films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      case SortType.DATE:
        return films.sort(sortTimeDescending);
    }
    return films;
  }

  init () {
    this.#renderBoard();

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#sortType) {
      return;
    }
    this.#sortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SiteSortView(this.#sortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer);
  };

  #renderBoard () {
    const filmsCount = this.films.length;
    this.#filtersComponent = new SiteFiltersView(FilterType.ALL);

    render(this.#filtersComponent, this.#boardContainer);

    this.#allFilmsContainer = new SiteFilmsListView();
    this.#filmsContainerComponent = new SiteFilmsContainerView();

    if (filmsCount === 0) {
      render(this.#filmsContainerComponent, this.#boardContainer);

      this.#allFilmsContainer.init({title: FilterType.ALL, isEmptyList: true});
      render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

      return;
    }

    this.#renderSort();

    render(this.#filmsContainerComponent, this.#boardContainer);

    this.#renderFilms(this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsNumber)));
    this.#renderShowMoreButton();
  }

  #clearBoard () {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#filmsContainerComponent);
    remove(this.#sortComponent);
    remove(this.#filtersComponent);
    remove(this.#showMoreButtonComponent);
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
