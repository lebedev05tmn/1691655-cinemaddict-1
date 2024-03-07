import he from 'he';

import { CommentReactions, ENTER_CODE, ViewActions } from '../../consts';
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
    document.removeEventListener('keydown', this.#commentSaveHandler);
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

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteCommentClick(ViewActions.DELETE_COMMENT, evt.target);
  };

  setDeleteCommentHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element
      .querySelectorAll('.film-details__comment-delete')
      .forEach((deleteButton) =>
        deleteButton.addEventListener('click', this.#deleteCommentHandler)
      );
  };

  #commentSaveHandler = (evt) => {
    if (evt.keyCode === ENTER_CODE && evt.ctrlKey) {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#commentSaveHandler);
      if (this._state.comment.length !== 0 && this._state.emotion) {
        this._callback.saveCommentClick(
          ViewActions.UPDATE_COMMENT,
          {
            filmId: this.#film.id,
            newComment: {
              emotion: this._state.emotion,
              comment: he.encode(this._state.comment),
            }
          }
        );
      } else {
        // console.log('Input comment and emotion');
      }
    }
  };

  setSaveCommentHandler = (callback) => {
    this._callback.saveCommentClick = callback;
    document.addEventListener('keydown', this.#commentSaveHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#changeCommentText);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#clickEmojiLabel);
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
  };
}
