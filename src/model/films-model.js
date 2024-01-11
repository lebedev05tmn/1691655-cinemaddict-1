export default class FilmsModel {
  #films = [];
  #apiService = null;
  #observers = new Set();

  constructor (apiService) {
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#films = await this.#apiService.films;
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

    try {
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1)
      ];

      this._notify(updatedFilm);
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

  get films() {
    return this.#films;
  }
}
