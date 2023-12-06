// import { mockFilms } from '../mock/films';
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const END_POINT = 'https://20.ecmascript.pages.academy/cinemaddict/';
const AUTHORIZATION = 'Basic dmV0cm92Nzg6dmV0cm92Nzg=';

export default class FilmsModel {
  #films = [];

  init = async () => {
    this.#films = await this.#load({url: 'movies'}).then((res)=>res.json());
  };

  get films() {
    return this.#films;
  }

  #load = async({
    url,
    method = Method.GET,
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
}
