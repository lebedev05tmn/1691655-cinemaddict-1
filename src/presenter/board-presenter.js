import { FilmCardsOnPage, FilterType, SortType } from '../consts';
import { remove, render } from '../framework/render';
import CommentsModel from '../model/comments-model';
import SiteFilmCardView from '../view/site-film-card/site-film-card-view';
import SiteFilmListContainerView from '../view/site-film-list-container/site-film-list-container-view';
import SiteFilmsListView from '../view/site-film-list/site-films-list-view';
import SiteFilmPopupView from '../view/site-film-popup/site-film-popup-view';
import SiteFilmsContainerView from '../view/site-films-container/site-films-container-view';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import NoFilmsTemplate from '../view/site-no-films/site-no-films-vies';
import ShowMoreButtonView from '../view/site-show-more-button/site-show-more-button-view';
import SiteSortView from '../view/site-sort/site-sort-view';

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #showMoreButtonComponent = null;
  #noFilmsComponent = null;
  #filmsContainerComponent = new SiteFilmsContainerView();
  #allFilmsContainer = null;
  #filmListContainerComponent = new SiteFilmListContainerView();

  #renderedFilmsNumber = FilmCardsOnPage.ALL_PER_STEP;
  #filterType = FilterType.ALL;

  constructor(boardContainer, filmsModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    return this.#filmsModel.films;
  }

  init () {
    this.#renderBoard();
  }

  #renderNoFilms () {
    this.#noFilmsComponent = new NoFilmsTemplate({
      filterType: this.#filterType,
    });

    render(this.#noFilmsComponent, this.#filmListContainerComponent.element);
  }

  #renderBoard () {
    render(new SiteFiltersView(FilterType.ALL), this.#boardContainer);
    render(new SiteSortView(SortType.DEFAULT), this.#boardContainer);

    render(this.#filmsContainerComponent, this.#boardContainer);

    const films = this.films;
    // const films = [];
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this.#allFilmsContainer = new SiteFilmsListView({title: FilterType.ALL, isEmptyList: true});
      render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

      return;
    }

    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmsNumber)));
    this.#renderShowMoreButton();
  }

  #renderFilms (films) {
    this.#allFilmsContainer = new SiteFilmsListView();

    render(this.#filmListContainerComponent, this.#allFilmsContainer.element);
    render(this.#allFilmsContainer, this.#filmsContainerComponent.element);

    films.forEach((film) => this.#renderFilm(film));
  }

  #renderFilm (film) {
    let filmPopup = null;

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function removePopup() {
      document.body.classList.remove('hide-overflow');
      remove(filmPopup);
    }

    const renderPopup = () => {
      const commentsModel = new CommentsModel(film.id);
      commentsModel.init().finally(() => {
        const comments = commentsModel.comments;

        filmPopup = new SiteFilmPopupView(film, comments);
        filmPopup.setClosePopupHandler(removePopup);
        render(filmPopup, document.body);
      });
    };

    const filmComponent = new SiteFilmCardView({
      film,
      onFilmCardClick: () => {
        renderPopup();
        document.addEventListener('keydown', escKeyDownHandler);
        document.body.classList.add('hide-overflow');
      }
    });

    render(filmComponent, this.#filmListContainerComponent.element);
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
}
