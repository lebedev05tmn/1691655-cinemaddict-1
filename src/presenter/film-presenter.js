import { remove, render } from '../framework/render';
import CommentsModel from '../model/comments-model';
import SiteFilmCardView from '../view/site-film-card/site-film-card-view';
import SiteFilmPopupView from '../view/site-film-popup/site-film-popup-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #film = null;

  #changeData = null;
  #removeOtherPopups = null;

  #filmComponent = null;

  constructor ({ film, filmListContainer, onFilmCardClick, changeData }) {
    this.#filmListContainer = filmListContainer;
    this.#removeOtherPopups = onFilmCardClick;
    this.#changeData = changeData;

    this.init(film);
  }

  removePopup = () => {
    if (this._filmPopup) {
      document.body.classList.remove('hide-overflow');
      remove(this._filmPopup);
      this._filmPopup = null;
    }
  };

  init(film) {
    this.#film = film;

    this.#filmComponent = new SiteFilmCardView(film);

    this.#filmComponent.setPropertyClickHandler(this.#handleFilmPropertyClick);
    this.#filmComponent.setFilmCardClickHandler(this.#handleFilmCardClick);

    render(this.#filmComponent, this.#filmListContainer);
  }

  #handleFilmPropertyClick = (changingProperty) => {
    this.#changeData(
      {...this.#film, },
      changingProperty
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.removePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #renderPopup = () => {
    const commentsModel = new CommentsModel(this.#film.id);
    commentsModel.init().finally(() => {
      const comments = commentsModel.comments;

      this._filmPopup = new SiteFilmPopupView(this.#film, comments);
      this._filmPopup.setClosePopupHandler(this.removePopup);
      render(this._filmPopup, document.body);
    });
  };

  #handleFilmCardClick = () => {
    this.#removeOtherPopups();
    this.#renderPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  };
}
