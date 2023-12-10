import { AUTHORIZATION, END_POINT, FetchMethod } from '../consts';

export default class CommentsModel {
  #filmId = null;
  #comments = [];

  constructor (filmId) {
    this.#filmId = filmId;
  }

  init = async () => {
    this.#comments = await this.#load({url: `comments/${this.#filmId}`}).then((res)=>res.json());
  };

  get comments() {
    return this.#comments;
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
}
