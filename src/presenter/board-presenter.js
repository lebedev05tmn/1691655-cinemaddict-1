import { FilmCardsOnPage, FilterType, SortType } from '../consts';
import { remove, render } from '../framework/render';
import { filter } from '../utils/filter';
import SiteFilmListContainerView from '../view/site-film-list-container/site-film-list-container-view';
import SiteFilmsListView from '../view/site-film-list/site-films-list-view';
import SiteFilmsContainerView from '../view/site-films-container/site-films-container-view';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import NoFilmsTemplate from '../view/site-no-films/site-no-films-vies';
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
  #filmsContainerComponent = new SiteFilmsContainerView();
  #allFilmsContainer = null;
  #filmListContainerComponent = new SiteFilmListContainerView();

  #renderedFilmsNumber = FilmCardsOnPage.ALL_PER_STEP;
  #filterType = FilterType.ALL;
  #currentSortType = SortType.DEFAULT;

  constructor(boardContainer, filmsModel, apiService) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#apiService = apiService;
  }

  get films() {
    const films = this.#filmsModel.films;
    const filteredFilms = filter[FilterType.ALL](films);

    switch (this.#currentSortType) {
      case SortType.RATING:
        return filteredFilms.sort((a, b) => b.film_info.total_rating - a.film_info.total_rating);
    }

    return filteredFilms;
  }

  init () {
    this.#renderBoard();

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  #renderNoFilms () {
    this.#noFilmsComponent = new NoFilmsTemplate({
      filterType: this.#filterType,
    });

    render(this.#noFilmsComponent, this.#filmListContainerComponent.element);
  }

  #renderSort () {
    render(new SiteSortView(this.#currentSortType), this.#boardContainer);
  }

  #renderBoard () {
    render(new SiteFiltersView(FilterType.ALL), this.#boardContainer);

    render(this.#filmsContainerComponent, this.#boardContainer);

    const filmsCount = this.films.length;
    const isEmptyList = filmsCount === 0;
    const filterType = this.#filterType;

    this.#allFilmsContainer = new SiteFilmsListView({ filterType, isEmptyList });

    if (isEmptyList) {
      render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

      return;
    }

    this.#renderFilms(this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsNumber)));
    this.#renderShowMoreButton();
  }

  #renderFilms (films) {
    render(this.#filmListContainerComponent, this.#allFilmsContainer.element);
    render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

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
