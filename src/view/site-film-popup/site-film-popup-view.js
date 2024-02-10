import { CommentReactions } from '../../consts';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { createFilmPopup } from './site-film-popup.tpl';

const COMMENT_BLANK = {
  comment: '',
  emotion: null,
};

export default class SiteFilmPopupView extends AbstractStatefulView {
  #film = {};
  #comments = [];
  #emojiImageElement = null;

  constructor (film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
    this._state = COMMENT_BLANK;

    this.#setInnerHandlers();
  }

  get template () {
    return createFilmPopup(this.#film, this.#comments);
  }

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  setClosePopupHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupHandler);
  };

  #propertyClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.propertyChangeClick(evt.target, true);
  };

  setPropertyClickHandler = (callback) => {
    this._callback.propertyChangeClick = callback;

    this.element.querySelector('#watchlist').addEventListener('click', this.#propertyClickHandler);
    this.element.querySelector('#watched').addEventListener('click', this.#propertyClickHandler);
    this.element.querySelector('#favorite').addEventListener('click', this.#propertyClickHandler);
  };

  #saveCommentHandler = (evt) => {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      console.log('pressed');
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#changeCommentText);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#clickEmojiLabel);
    document.addEventListener('keydown', this.#saveCommentHandler);

  };

  #changeCommentText = (evt) => {
    evt.preventDefault();

    this._setState({
      comment: evt.target.value
    });
  };

  #clickEmojiLabel = (evt) => {
    evt.preventDefault();

    const addEmojiContainer = this.element.querySelector('.film-details__add-emoji-label');

    if (!this.#emojiImageElement) {
      this.#emojiImageElement = document.createElement('img');

      this.#emojiImageElement.style.width = '55px';
      this.#emojiImageElement.style.height = '55px';
      this.#emojiImageElement.setAttribute('id', 'emoji-image');
      addEmojiContainer.appendChild(this.#emojiImageElement);
    }

    this.#emojiImageElement.setAttribute('src', evt.target.src);

    this._setState({
      emotion: Object
        .keys(CommentReactions)
        .find((key) =>
          CommentReactions[key] === evt.target.getAttribute('src')
        )
        .toLowerCase(),
    });

    console.log(this._state);
  };
}
