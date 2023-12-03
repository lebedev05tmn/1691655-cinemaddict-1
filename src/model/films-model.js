import { mockFilms } from '../mock/films';

export default class FilmsModel {

  constructor() {
    this.films = mockFilms;
  }

  getFilms() {
    return this.films;
  }
}
