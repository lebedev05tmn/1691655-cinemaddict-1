import { remove, render } from '../framework/render';
import CommentsModel from '../model/comments-model';
import SiteFilmCardView from '../view/site-film-card/site-film-card-view';
import SiteFilmPopupView from '../view/site-film-popup/site-film-popup-view';

export default class FilmPresenter {
  #filmListContainer = null;
  #film = null;
  #handleClick = null;

  _filmPopup = null;

  constructor ({
    filmListContainer,
    onClick,
  }) {
    this.#filmListContainer = filmListContainer;
    this.#handleClick = onClick;
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

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.removePopup();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const renderPopup = () => {
      const commentsModel = new CommentsModel(film.id);
      commentsModel.init().finally(() => {
        const comments = commentsModel.comments;

        this._filmPopup = new SiteFilmPopupView(film, comments);
        this._filmPopup.setClosePopupHandler(this.removePopup);
        render(this._filmPopup, document.body);
      });
    };

    const filmComponent = new SiteFilmCardView({
      film,
      onFilmCardClick: () => {
        this.#handleClick();
        renderPopup();
        document.addEventListener('keydown', escKeyDownHandler);
        document.body.classList.add('hide-overflow');
      }
    });

    render(filmComponent, this.#filmListContainer);
  }
}
