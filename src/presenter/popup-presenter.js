import { FilmPropertyRelation, ViewActions } from '../consts';
import { remove, render, replace } from '../framework/render';
import SiteFilmPopupView from '../view/site-film-popup/site-film-popup-view';

export default class PopupPresenter {
  #film = null;
  #comments = null;

  #changeData = null;
  #removePopupPresenter = null;

  #popupComponent = null;

  constructor (changeData, removePopupPresenter) {
    this.#changeData = changeData;
    this.#removePopupPresenter = removePopupPresenter;
  }

  get popupFilmId () {
    return this.#film.id;
  }

  init (film, comments) {
    const prevPopupComponent = this.#popupComponent;

    this.#film = film;
    this.#comments = comments;

    this.#popupComponent = new SiteFilmPopupView(this.#film, this.#comments);

    this.#popupComponent.setPropertyClickHandler(this.#handleFilmPropertyClick);

    this.#popupComponent.setSaveCommentHandler(this.#changeData);
    this.#popupComponent.setDeleteCommentHandler(this.#changeData);
    this.#popupComponent.setClosePopupHandler(this.destroyComponent);

    if (prevPopupComponent === null) {
      render(this.#popupComponent, document.body);
      return;
    }
    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  }

  destroyComponent = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;

    this.#removePopupPresenter();
    document.body.classList.remove('hide-overflow');
  };

  #handleFilmPropertyClick = (changingPropertyTarget) => {
    const changingProperty = FilmPropertyRelation[changingPropertyTarget.id];

    this.#film.userDetails[changingProperty] = !this.#film.userDetails[changingProperty];
    this.#changeData(ViewActions.FILM, { movie: this.#film, comments: this.#comments, });
  };
}
