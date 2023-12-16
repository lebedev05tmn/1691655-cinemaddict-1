export default class CommentsModel {
  #comments = null;
  #filmId = null;
  #apiService = null;

  constructor(filmId, apiService) {
    this.#filmId = filmId;
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      this.#comments = await this.#apiService.getComments(this.#filmId);
    } catch {
      this.#comments = [];
    }
  };

  get comments() {
    return this.#comments;
  }
}
