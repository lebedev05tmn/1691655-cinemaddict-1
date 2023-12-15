import { AUTHORIZATION, END_POINT, FetchMethod } from '../consts';

export default class FilmsModel {
  #films = [];

  init = async () => {
    this.#films = await this.#load({url: 'movies'})
      .then(
        (res) => res.json()
      );
  };

  get films() {
    return this.#films;
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
