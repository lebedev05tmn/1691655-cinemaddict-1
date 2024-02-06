import camelcaseKeys from 'camelcase-keys';
import { UpdateType } from '../consts';
import Observable from '../framework/observable';

export default class FilmsModel extends Observable {
  #films = [];
  #apiService = null;
  #observers = new Set();

  constructor (apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
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

  updateFilm = async (update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const updatedFilm = await this.#apiService.updateFilm(update);
    const adaptedFilm = this.#adaptToClient(updatedFilm);

    try {
      this.#films = [
        ...this.#films.slice(0, index),
        adaptedFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(UpdateType.PATCH, adaptedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => camelcaseKeys(film, {deep: true});
}
