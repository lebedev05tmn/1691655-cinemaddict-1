import snakecaseKeys from 'snakecase-keys';
import { FetchMethod } from '../consts';
import ApiService from '../framework/api-service';

export default class FilmsApiService extends ApiService{

  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: FetchMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const parsedResponse = ApiService.parseResponse(response);

    return parsedResponse;
  };

  updateComment = async (update) => {
    const response = await this._load({
      url: `comments/${update.movie.id}`,
      method: FetchMethod.POST,
      body: JSON.stringify(this.#adaptToServer(update.newComment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return ApiService.parseResponse(response);
  };

  deleteComment = async (commentId) => {
    const responce = await this._load({
      url: `comments/${commentId}`,
      method: FetchMethod.DELETE,
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    return responce;
  };

  static parseResponse = (response) => response.json();

  getComments = (filmId) => this._load({url: `comments/${filmId}`})
    .then((response) => response.json());

  #adaptToServer = (film) => snakecaseKeys(film, {deep: true});
}
