import { FilmPropertyRelation, ViewActions, ViewType } from '../consts';
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

  init (film = this.#film, comments = this.#comments) {
    if (this.#popupComponent) {
      this.#popupComponent.deleteSaveCommentHandler();
    }

    const prevPopupComponent = this.#popupComponent;

    this.#film = film;
    this.#comments = comments;

    this.#popupComponent = new SiteFilmPopupView(this.#film, this.#comments, this.#changeData);

    this.#popupComponent.setPropertyClickHandler(this.#handleFilmPropertyClick);

    this.#popupComponent.setSaveCommentHandler(this.#changeData);
    this.#popupComponent.setClosePopupHandler(this.destroyComponent);

    if (prevPopupComponent === null) {
      render(this.#popupComponent, document.body);
      return;
    }
    const scrollPosition = prevPopupComponent.getScrollPosition();

    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);

    this.#popupComponent.setScrollPosition(scrollPosition);
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
    this.#changeData(ViewActions.FILM, { movie: this.#film, comments: this.#comments, }, ViewType.POPUP);
  };

  setShaking = (updateType, commentId) => {
    this.#popupComponent.setShaking(updateType, commentId);
  };
}
