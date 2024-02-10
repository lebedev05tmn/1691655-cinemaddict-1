import { FilmCardsOnPage, FilterType, SortType, UpdateType, UserAction } from '../consts';
import { remove, render } from '../framework/render';
import { filter } from '../utils/filter';
import { sortTimeDescending } from '../utils/utils';
import SiteFilmListContainerView from '../view/site-film-list-container/site-film-list-container-view';
import SiteFilmsListView from '../view/site-film-list/site-films-list-view';
import SiteFilmsContainerView from '../view/site-films-container/site-films-container-view';
import SiteFilmsLoadingView from '../view/site-films-loading/site-films-loading-view';
import ShowMoreButtonView from '../view/site-show-more-button/site-show-more-button-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import FilmPresenter from './film-presenter';
import FilterPresenter from './filter-presenter';

export default class BoardPresenter {
  #filmPresenters = new Map();
  #filterPresenter = null;

  #filmsModel = null;
  #filterModel = null;
  #apiService = null;
  #commentsModel = null;

  #boardContainer = null;
  #filtersComponent = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;

  #filmListContainerComponent = new SiteFilmListContainerView();
  #filmsLoadingComponent = new SiteFilmsLoadingView();
  #allFilmsContainer = new SiteFilmsListView();
  #filmsContainerComponent = new SiteFilmsContainerView();

  #renderedFilmsNumber = FilmCardsOnPage.ALL_PER_STEP;
  #sortType = SortType.DEFAULT;

  #isLoading = true;

  constructor(boardContainer, filmsModel, filterModel, apiService, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#apiService = apiService;
    this.#commentsModel = commentsModel;

    this.#filterPresenter = new FilterPresenter(
      boardContainer,
      filterModel,
      filmsModel
    );
  }

  get films() {
    const filterType = this.#filterModel.filter;
    const films = Array.from(this.#filmsModel.films);
    const filteredFilms = filter[filterType](films);

    switch (this.#sortType) {
      case SortType.RATING:
        return filteredFilms.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      case SortType.DATE:
        return filteredFilms.sort(sortTimeDescending);
    }
    return filteredFilms;
  }

  init () {
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  #renderBoard () {
    render(this.#filmsContainerComponent, this.#boardContainer);
    render(this.#filmListContainerComponent, this.#filmsContainerComponent.element);

    this.#filterPresenter.init();

    if (this.#isLoading) {
      this.#renderLoading();

      return;
    }

    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      this.#allFilmsContainer.removeElement();
      this.#allFilmsContainer.init({filterType: this.#filterModel.filter, isEmptyList: true});
      render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

      return;
    }

    this.#renderSort();
    render(this.#filmsContainerComponent, this.#boardContainer);
    this.#renderFilms(this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsNumber)));
  }

  #clearBoard () {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#filmsContainerComponent);
    remove(this.#sortComponent);
    this.#filterPresenter.destroy();
    remove(this.#showMoreButtonComponent);
  }

  #reRenderBoard () {
    this.#clearBoard();
    this.#renderBoard();
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#sortType) {
      return;
    }
    this.#sortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderLoading = () => {
    render(this.#filmsLoadingComponent, this.#filmListContainerComponent.element);
  };

  #renderSort = () => {
    this.#sortComponent = new SiteSortView(this.#sortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer);
  };

  #renderFilms (films) {
    this.#allFilmsContainer.removeElement();
    this.#allFilmsContainer.init();

    render(this.#allFilmsContainer, this.#filmsContainerComponent.element);
    render(this.#filmListContainerComponent, this.#allFilmsContainer.element);

    films.forEach((film) => this.#renderFilm(film));

    if (this.#renderedFilmsNumber < this.films.length) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilm (film) {
    const filmPresenter = new FilmPresenter({
      film: film,
      filmListContainer: this.#filmListContainerComponent.element,
      onFilmCardClick: this.#handleFilmCardClick,
      changeData: this.#handleViewAction,
      apiService: this.#apiService,
      commentsModel: this.#commentsModel,
    });

    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #renderShowMoreButton () {
    this.#showMoreButtonComponent = new ShowMoreButtonView({onClick: this.#handleShowMoreButtonClick});
    render(this.#showMoreButtonComponent, this.#filmListContainerComponent.element);
  }

  #handleShowMoreButtonClick = () => {
    const newRenderedFilmsCount = Math.min(this.#renderedFilmsNumber + FilmCardsOnPage.ALL_PER_STEP, this.films.length);
    const films = this.films.slice(this.#renderedFilmsNumber, newRenderedFilmsCount);

    remove(this.#showMoreButtonComponent);

    this.#renderedFilmsNumber = newRenderedFilmsCount;
    this.#renderFilms(films);
  };

  #handleFilmCardClick = () => {
    this.#filmPresenters.forEach((presenter) => presenter.removePopup());
  };

  #handleViewAction = async (update) => {
    await this.#filmsModel.updateFilm(update);
  };

  #handleModelEvent = (updateType, data) => {
    console.log('board-presenter ', updateType);

    switch (updateType) {
      case UpdateType.PATCH:
        this.#filterPresenter.destroy();
        this.#filterPresenter.init();
        this.#filmPresenters.get(data.id).init(data);
        this.#reRenderBoard();
        break;
      case UpdateType.MINOR:
        this.#sortType = SortType.DEFAULT;
        this.#reRenderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#filterPresenter.destroy();
        remove(this.#filmsLoadingComponent);
        this.#renderBoard();
        break;
    }
  };

}
