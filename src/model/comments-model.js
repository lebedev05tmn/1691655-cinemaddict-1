import Observable from '../framework/observable';
import camelcaseKeys from 'camelcase-keys';

export default class CommentsModel extends Observable {
  #comments = null;
  #filmId = null;
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async (filmId) => {
    try {
      this.#comments = await this.#apiService.getComments(filmId);
    } catch(err) {
      this.#comments = [];
    }
  };

  get comments() {
    return this.#comments;
  }

  updateComment = async (update) => {
    const updatedFilm = await this.#apiService.updateComment(update);

    // eslint-disable-next-line no-console
    console.log('updated film ', updatedFilm);

    // const adaptedFilm = this.#adaptToClient(updatedFilm);

    // try {
    //   this.#films = [
    //     ...this.#films.slice(0, index),
    //     adaptedFilm,
    //     ...this.#films.slice(index + 1)
    //   ];

    //   this._notify(UpdateType.MAJOR, adaptedFilm);
    // } catch (err) {
    //   throw new Error('Can\'t update film');
    // }
  };

  #adaptToClient = (film) => camelcaseKeys(film, {deep: true});

}
