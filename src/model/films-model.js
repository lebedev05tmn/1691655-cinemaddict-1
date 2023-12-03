import { FilmCardsOnPage } from '../consts';
import { mockFilms } from '../mock/films';

export default class FilmsModel {

  constructor() {
    this.films = mockFilms.slice(0, FilmCardsOnPage.MAIN);
  }

  getFilms() {

    return this.films;
  }
}
