import { FilmPropertyRelation, ViewActions } from '../consts';
import { remove, render, replace } from '../framework/render';
import SiteFilmCardView from '../view/site-film-card/site-film-card-view';
import SiteFilmPopupView from '../view/site-film-popup/site-film-popup-view';

export default class FilmPresenter {
  #commentsModel = null;

  #filmListContainer = null;
  #film = null;
  #comments = [];

  #changeData = null;
  #removeOtherPopups = null;

  #filmComponent = null;
  #popupComponent = null;

  #apiService = null;

  constructor ({ film, filmListContainer, onFilmCardClick, changeData, apiService, commentsModel }) {
    this.#filmListContainer = filmListContainer;
    this.#removeOtherPopups = onFilmCardClick;
    this.#changeData = changeData;
    this.#apiService = apiService;
    this.#commentsModel = commentsModel;

    this.init(film);
  }

  init(film) {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new SiteFilmCardView(film);

    this.#filmComponent.setPropertyClickHandler(this.#handleFilmPropertyClick);
    this.#filmComponent.setFilmCardClickHandler(this.#handleFilmCardClick);

    if (prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }
    replace(this.#filmComponent, prevFilmComponent);
    remove(prevFilmComponent);

    if (this.#popupComponent !== null) {
      this.#renderPopup();
    }
  }

  destroy = () => {
    remove(this.#filmComponent);
  };

  removePopup = () => {
    if (this.#popupComponent) {
      document.body.classList.remove('hide-overflow');
      remove(this.#popupComponent);
      this.#popupComponent = null;
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.removePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #getComments = async () => {
    this.#comments = await this.#commentsModel.init(this.#film.id).then(() => this.#commentsModel.comments);
  };

  #renderPopup = () => {
    const prepPopupComponent = this.#popupComponent;

    this.#popupComponent = new SiteFilmPopupView(this.#film, this.#comments);
    this.#popupComponent.setPropertyClickHandler(this.#handleFilmPropertyClick);
    this.#popupComponent.setClosePopupHandler(this.removePopup);
    this.#popupComponent.setSaveCommentHandler(this.#handleCommentSave);

    if (prepPopupComponent === null) {
      render(this.#popupComponent, document.body);
      return;
    }
    replace(this.#popupComponent, prepPopupComponent);
    remove(prepPopupComponent);
  };

  #handleCommentSave = (comment) => {
    this.#changeData(ViewActions.UPDATE_COMMENT, comment);
  };

  #handleFilmPropertyClick = (changingPropertyTarget) => {
    const changingProperty = FilmPropertyRelation[changingPropertyTarget.id];

    this.#film.userDetails[changingProperty] = !this.#film.userDetails[changingProperty];
    this.#changeData(ViewActions.FILM, this.#film);
  };

  #handleFilmCardClick = async () => {
    this.#removeOtherPopups();
    await this.#getComments();

    this.#renderPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  };
}
