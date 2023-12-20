
import AbstractView from '../../framework/view/abstract-view';
import { createShowMoreButtonTemplate } from './site-show-more-button.tpl';

export default class ShowMoreButtonView extends AbstractView {
  #handleClick = null;

  constructor ({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createShowMoreButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
