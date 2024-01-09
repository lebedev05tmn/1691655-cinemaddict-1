import { AUTHORIZATION, END_POINT, FetchMethod } from '../consts';

export default class ApiService {

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  #load = async({
    url,
    method = FetchMethod.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', AUTHORIZATION);

    const response = await fetch(
      `${END_POINT}${url}`,
      {method, body, headers}
    );

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    } else {
      return response;
    }
  };

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: FetchMethod.PUT,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = ApiService.parseResponse(response);

    return parsedResponse;
  };

  static parseResponse = (response) => response.json();

  getComments = (filmId) => this.#load({url: `comments/${filmId}`})
    .then((response) => response.json());
}
