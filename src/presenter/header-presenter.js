import { render } from '../framework/render';
import UserView from '../view/site-user/site-user-view';

export default class HeaderPresenter {
  constructor (container) {
    this.container = container;
  }

  init () {
    render(new UserView(), this.container);
  }
}
