import { remove, render } from '../framework/render';
import CommentsModel from '../model/comments-model';
import SiteFilmCardView from '../view/site-film-card/site-film-card-view';
import SiteFilmPopupView from '../view/site-film-popup/site-film-popup-view';

export default class FilmPresenter {
  #filmListContainer = null;

  #film = null;

  constructor ({filmListContainer}) {
    this.#filmListContainer = filmListContainer;
  }

  init(film) {
    this.#film = film;

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

    render(filmComponent, this.#filmListContainer);
  }
}
