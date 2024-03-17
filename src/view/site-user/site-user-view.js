import AbstractView from '../../framework/view/abstract-view';
import { createUserProfileTemplate } from './site-user.tpl';

export default class UserView extends AbstractView {
  #watchedFilmsCount = null;

  constructor (watchedFilmsCount) {
    super();
    this.#watchedFilmsCount = watchedFilmsCount;
  }

  get template() {
    return createUserProfileTemplate(this.#watchedFilmsCount);
  }
}
