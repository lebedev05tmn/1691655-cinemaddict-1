import { FilmPropertyRelation, ViewActions } from '../consts';
import { remove, render, replace } from '../framework/render';
import SiteFilmCardView from '../view/site-film-card/site-film-card-view';

export default class FilmPresenter {
  #prevFilmComponent = null;
  #filmListContainer = null;
  #topRatedFilmsContainer = null;
  #film = null;

  #changeData = null;
  #openPopupCallback = null;

  #filmComponent = null;

  constructor ({ filmListContainer, topRatedFilmsContainer, openPopup, changeData }) {
    this.#filmListContainer = filmListContainer;
    this.#topRatedFilmsContainer = topRatedFilmsContainer;
    this.#changeData = changeData;
    this.#openPopupCallback = openPopup;
  }

  init(film) {
    this.#prevFilmComponent = this.#filmComponent;

    this.#film = film;
    this.#filmComponent = new SiteFilmCardView(film);

    this.#filmComponent.setPropertyClickHandler(this.#handleFilmPropertyClick);
    this.#filmComponent.setFilmCardClickHandler(this.#openPopupCallback);
  }

  renderInCommonList = () => {
    if (this.#prevFilmComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
      return;
    }
    replace(this.#filmComponent, this.#prevFilmComponent);
    remove(this.#prevFilmComponent);
  }

  renderInTopRated = () => {
    if (this.#prevFilmComponent === null) {
      render(this.#filmComponent, this.#topRatedFilmsContainer);
      return;
    }
    replace(this.#filmComponent, this.#prevFilmComponent);
    remove(this.#prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  };

  #handleFilmPropertyClick = (changingPropertyTarget) => {
    const changingProperty = FilmPropertyRelation[changingPropertyTarget.id];

    this.#film.userDetails[changingProperty] = !this.#film.userDetails[changingProperty];
    this.#changeData(ViewActions.FILM, { movie: this.#film, comments: [], });
  };
}
