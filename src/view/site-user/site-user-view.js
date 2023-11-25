import AbstractView from '../../framework/view/abstract-view';
import { createUserProfileTemplate } from './site-user.tpl';

export default class UserView extends AbstractView {
  constructor () {
    super();
  }

  get template() {
    return createUserProfileTemplate();
  }
}
