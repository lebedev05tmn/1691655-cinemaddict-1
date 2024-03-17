import camelcaseKeys from 'camelcase-keys';
import { EXTRA_FILMS_NUMBER, UpdateType } from '../consts';
import Observable from '../framework/observable';

export default class FilmsModel extends Observable {
  #films = [];
  #extraFilms = {
    topRated: [],
    mostCommented: [],
  };

  #apiService = null;

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  get extraFilms() {
    this.#extraFilms.topRated = this.films
      .filter((film) => film.filmInfo.totalRating > 0)
      .sort((film1, film2) => film2.filmInfo.totalRating - film1.filmInfo.totalRating)
      .slice(0, EXTRA_FILMS_NUMBER);
    this.#extraFilms.mostCommented = this.films
      .filter((film) => film.comments.length > 0)
      .sort((film1, film2) => film2.comments.length - film1.comments.length)
      .slice(0, EXTRA_FILMS_NUMBER);

    return this.#extraFilms;
  }

  get watchedFilmsCount() {
    return this.films.filter((film) => film.userDetails.alreadyWatched).length;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;

      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilmProperty = async (update) => {
    const index = this.#films.findIndex((film) => film.id === update.movie.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const updatedFilm = await this.#apiService.updateFilm(update.movie);
    const adaptedFilm = this.#adaptToClient(updatedFilm);

    try {
      this.#films = [
        ...this.#films.slice(0, index),
        adaptedFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(UpdateType.MAJOR, { movie: adaptedFilm, comments: update.comments, });
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  updateAfterAddComment = (data) => {
    const currentFilm = data.movie;
    const index = this.#films.findIndex((film) => film.id === currentFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      this.#films = [
        ...this.#films.slice(0, index),
        currentFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(UpdateType.PATCH, data);
    } catch (err) {
      throw new Error('Can\'t update');
    }
  };

  updateAfterDeleteComment = (data) => {
    const currentFilm = this.#films.find((film) => film.id === data.filmId);

    currentFilm.comments = data.comments.map((comment) => comment.id);

    this._notify(UpdateType.PATCH, {movie: currentFilm, comments: data.comments});
  };

  #adaptToClient = (film) => camelcaseKeys(film, {deep: true});
}
