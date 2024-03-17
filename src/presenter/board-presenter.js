import { FilmCardsOnPage, SortType, UpdateType, ViewActions, FilmListTitles, TimeLimit, ViewType } from '../consts';
import { remove, render } from '../framework/render';
import { filter } from '../utils/filter';
import { sortTimeDescending } from '../utils/utils';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import UserView from '../view/site-user/site-user-view';
import SiteFilmsListContainerView from '../view/site-films-list-container/site-films-list-container-view';
import SiteFilmsListView from '../view/site-film-list/site-films-list-view';
import SiteFilmsContainerView from '../view/site-films-container/site-films-container-view';
import ShowMoreButtonView from '../view/site-show-more-button/site-show-more-button-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import SiteStatisticsView from '../view/site-statistics/site-statistics-view';
import FilmPresenter from './film-presenter';
import FilterPresenter from './filter-presenter';
import PopupPresenter from './popup-presenter';


export default class BoardPresenter {
  #filmsFromServer = [];

  #filmPresenters = new Map();
  #topRatedFilmsPresenters = new Map();
  #mostCommentedPresenters = new Map();
  #filterPresenter = null;
  #popupPresenter = null;

  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #boardContainer = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #headerComponent = null;
  #footerStatisticsComponent = null;

  #filmsContainerComponent = new SiteFilmsContainerView();

  #allFilmsList = new SiteFilmsListView();
  #topRatedFilmsList = new SiteFilmsListView();
  #mostCommentedFilmsList = new SiteFilmsListView();

  #allFilmsListContainer = new SiteFilmsListContainerView();
  #topRatedFilmsListContainer = new SiteFilmsListContainerView();
  #mostCommentedFilmsListContainer = new SiteFilmsListContainerView();

  #renderedFilmsNumber = FilmCardsOnPage.ALL_PER_STEP;
  #sortType = SortType.DEFAULT;
  #isLoading = true;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor(boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#filterPresenter = new FilterPresenter(
      boardContainer,
      filterModel,
      filmsModel
    );
  }

  get films() {
    const filterType = this.#filterModel.filter;
    this.#filmsFromServer = Array.from(this.#filmsModel.films);
    const filteredFilms = filter[filterType](this.#filmsFromServer);

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
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  #renderHeader = () => {
    if (this.#headerComponent) {
      remove(this.#headerComponent);
    }
    this.#headerComponent = new UserView(this.#filmsModel.watchedFilmsCount);
    render(this.#headerComponent, document.querySelector('.header'));
  };

  #renderFooterStatistics = () => {
    if (this.#footerStatisticsComponent) {
      remove(this.#footerStatisticsComponent);
    }
    this.#footerStatisticsComponent = new SiteStatisticsView(this.films.length);
    render(this.#footerStatisticsComponent, document.querySelector('.footer__statistics'));
  };

  #renderAllFilmsContainer = () => {
    this.#allFilmsList.init({ titleName: FilmListTitles.ALL_FILMS });

    render(this.#allFilmsList, this.#filmsContainerComponent.element);
    render(this.#allFilmsListContainer, this.#allFilmsList.element);
  };

  #renderExtraFilmsContainers = () => {
    if (this.#filmsModel.extraFilms.topRated.length !== 0) {
      this.#topRatedFilmsList.init({ titleName: FilmListTitles.TOP_RATED, isExtra: true });
      render(this.#topRatedFilmsList, this.#filmsContainerComponent.element);
      render(this.#topRatedFilmsListContainer, this.#topRatedFilmsList.element);
    }
    if (this.#filmsModel.extraFilms.mostCommented.length !== 0) {
      this.#mostCommentedFilmsList.init({ titleName: FilmListTitles.MOST_COMMENTED, isExtra: true });
      render(this.#mostCommentedFilmsList, this.#filmsContainerComponent.element);
      render(this.#mostCommentedFilmsListContainer, this.#mostCommentedFilmsList.element);
    }
  };

  #renderBoard () {
    const filmsCount = this.films.length;

    if (!this.#isLoading) {
      this.#renderSort();
    }
    render(this.#filmsContainerComponent, this.#boardContainer);
    this.#filterPresenter.init();

    if (this.#isLoading) {
      this.#allFilmsList.init({ titleName: FilmListTitles.LOADING, isEmptyList: true });
      render(this.#allFilmsList, this.#filmsContainerComponent.element);
      return;
    }

    if (filmsCount === 0) {
      this.#allFilmsList.removeElement();
      this.#allFilmsList.init({titleName: FilmListTitles[this.#filterModel.filter], isEmptyList: true});
      render(this.#allFilmsList, this.#filmsContainerComponent.element);
      return;
    }
    this.#renderAllFilmsContainer();
    this.#renderExtraFilmsContainers();

    this.#renderFilms(this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsNumber)), this.#allFilmsListContainer);
    if (this.#filmsModel.extraFilms.topRated.length !== 0) {
      this.#renderFilms(this.#filmsModel.extraFilms.topRated, this.#topRatedFilmsListContainer);
    }
    if (this.#filmsModel.extraFilms.mostCommented.length !== 0) {
      this.#renderFilms(this.#filmsModel.extraFilms.mostCommented, this.#mostCommentedFilmsListContainer);
    }
  }

  #clearBoard () {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#topRatedFilmsPresenters.forEach((presenter) => presenter.destroy());
    this.#mostCommentedPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    this.#topRatedFilmsPresenters.clear();
    this.#mostCommentedPresenters.clear();

    remove(this.#filmsContainerComponent);
    remove(this.#sortComponent);
    this.#filterPresenter.destroy();
    remove(this.#showMoreButtonComponent);
  }

  #reRenderBoard () {
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderFilms (films, filmsContainer) {
    films.forEach((film) => this.#renderFilm({film, filmsContainer}));

    if (this.#renderedFilmsNumber < this.films.length && filmsContainer === this.#allFilmsListContainer) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilm ({ film, filmsContainer }) {
    const filmPresenter = new FilmPresenter({
      filmListContainer: filmsContainer.element,
      openPopup: this.#handleFilmCardClick,
      changeData: this.#handleViewAction,
    });
    filmPresenter.init(film);
    if (filmsContainer === this.#topRatedFilmsListContainer) {
      this.#topRatedFilmsPresenters.set(film.id, filmPresenter);
    } else if (filmsContainer === this.#mostCommentedFilmsListContainer) {
      this.#mostCommentedPresenters.set(film.id, filmPresenter);
    } else {
      this.#filmPresenters.set(film.id, filmPresenter);
    }
  }

  #renderShowMoreButton () {
    this.#showMoreButtonComponent = new ShowMoreButtonView({onClick: this.#handleShowMoreButtonClick});
    render(this.#showMoreButtonComponent, this.#allFilmsList.element);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#sortType) {
      return;
    }
    this.#sortType = sortType;
    this.#reRenderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SiteSortView(this.#sortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#boardContainer);
  };

  #handleShowMoreButtonClick = () => {
    const newRenderedFilmsCount = Math.min(this.#renderedFilmsNumber + FilmCardsOnPage.ALL_PER_STEP, this.films.length);
    const films = this.films.slice(this.#renderedFilmsNumber, newRenderedFilmsCount);

    remove(this.#showMoreButtonComponent);
    this.#renderedFilmsNumber = newRenderedFilmsCount;
    this.#renderFilms(films, this.#allFilmsListContainer);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#popupPresenter.destroyComponent();
    }
  };

  #removePopupPresenter = () => {
    this.#popupPresenter = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFilmCardClick = async (film) => {
    if (this.#popupPresenter && this.#popupPresenter.popupFilmId === film.id) {
      return;
    }
    const comments = await this.#commentsModel.init(film.id).then(() => this.#commentsModel.comments);

    if (!this.#popupPresenter) {
      this.#popupPresenter = new PopupPresenter(this.#handleViewAction, this.#removePopupPresenter);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.body.classList.add('hide-overflow');
    }
    this.#popupPresenter.init(film, comments);
  };

  #handleViewAction = async (updateType, update, viewType) => {
    this.#uiBlocker.block();
    try {
      switch (updateType) {
        case ViewActions.FILM:
          await this.#filmsModel.updateFilmProperty(update);
          break;
        case ViewActions.UPDATE_COMMENT:
          this.#filmsModel.updateAfterAddComment(
            await this.#commentsModel.updateComment(update)
          );
          break;
        case ViewActions.DELETE_COMMENT:
          this.#filmsModel.updateAfterDeleteComment(
            await this.#commentsModel.deleteComment(update.commentId)
          );
          break;
      }
    } catch(err) {
      if (viewType === ViewType.POPUP) {
        this.#popupPresenter.setShaking(updateType, update.commentId);
      }
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.#renderHeader();
        this.#filterPresenter.destroy();
        this.#filterPresenter.init();
        this.#reRenderBoard();
        if (this.#popupPresenter) {
          this.#popupPresenter.init(data.movie, data.comments);
        }
        break;
      case UpdateType.MINOR:
        this.#sortType = SortType.DEFAULT;
        this.#reRenderBoard();
        break;
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.movie.id).init(data.movie);
        this.#popupPresenter.init(data.movie, data.comments);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#filterPresenter.destroy();
        remove(this.#allFilmsList);
        this.#renderHeader();
        this.#renderBoard();
        this.#renderFooterStatistics();
        break;
    }
  };
}
