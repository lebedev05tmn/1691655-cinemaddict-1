export default class FilmsModel {
  #films = null;
  #apiService = null;

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

  get films() {
    return this.#films;
  }
}
