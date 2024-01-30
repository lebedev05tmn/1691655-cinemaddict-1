import camelcaseKeys from 'camelcase-keys';

export default class FilmsModel {
  #films = [];
  #apiService = null;
  #observers = new Set();

  constructor (apiService) {
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

      this._notify(adaptedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  };

  addObserver = (observer) => {
    this.#observers.add(observer);
  };

  _notify(payload) {
    this.#observers.forEach((observer) => observer(payload));
  }

  #adaptToClient = (film) => camelcaseKeys(film, {deep: true});
}
