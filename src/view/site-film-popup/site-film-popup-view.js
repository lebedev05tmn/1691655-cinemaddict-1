import he from 'he';

import { CommentReactions, ENTER_CODE, TimeOutDelay, ViewActions, ViewType } from '../../consts';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { createFilmPopup } from './site-film-popup.tpl';

export default class SiteFilmPopupView extends AbstractStatefulView {
  #film = {};
  #comments = [];
  #emojiImageElement = null;

  constructor (film, comments, onDeleteClick) {
    super();
    this.#film = film;
    this.#comments = comments;
    this._setState(SiteFilmPopupView.parseCommentToState());

    this._callback.deleteCommentClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template () {
    return createFilmPopup(this.#film, this.#comments, this._state);
  }

  static parseCommentToState() {
    return {
      comment: null,
      emotion: null,
      isDisabled: false,
      isDeleting: null,
    };
  }

  _restoreHandlers = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#changeCommentText);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#clickEmojiLabel);
    this.element.addEventListener('scroll', this.#scrollPositionHandler);
    this.element
      .querySelectorAll('.film-details__comment-delete')
      .forEach((deleteButton) =>
        deleteButton.addEventListener('click', this.#deleteCommentHandler)
      );
  };

  getScrollPosition() {
    return this._state.scrollPosition;
  }

  setScrollPosition(scrollPosition) {
    this.element.scrollTo(0, scrollPosition);
  }

  #scrollPositionHandler = () => {
    this._setState({scrollPosition: this.element.scrollTop});
  };

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
    this._callback.deleteCommentClick(
      ViewActions.DELETE_COMMENT,
      {
        movie: {
          id: this.#film.id,
        },
        commentId: evt.target.id,
      },
      ViewType.POPUP,
    );
    this.updateElement({
      isDeleting: evt.target.id,
    });
    this.element.scrollTo(0, this._state.scrollPosition);
  };

  #commentSaveHandler = (evt) => {
    if (evt.keyCode === ENTER_CODE && evt.ctrlKey) {
      evt.preventDefault();

      if (this._state.comment && this._state.emotion) {
        this._callback.saveCommentClick(
          ViewActions.UPDATE_COMMENT,
          {
            movie: {
              id: this.#film.id,
            },
            newComment: {
              emotion: this._state.emotion,
              comment: he.encode(this._state.comment),
            }
          },
          ViewType.POPUP
        );
      } else {
        this.shakeNewComment();
      }
    }
  };

  setSaveCommentHandler = (callback) => {
    this._callback.saveCommentClick = callback;
    document.addEventListener('keydown', this.#commentSaveHandler);
  };

  shakeNewComment = () => {
    this.shake.call({element: document.querySelector('.film-details__new-comment')});
  };

  shakeComment = (commentId) => {
    this.shake.call({element: document.querySelector(`#${ commentId }`)});
  };

  setShaking = (updateType, commentId) => {
    switch (updateType) {
      case ViewActions.FILM:
        setTimeout(() => this.shake.call({element: document.querySelector('.film-details__controls')}), TimeOutDelay);
        break;
      case ViewActions.UPDATE_COMMENT:
        setTimeout(() => this.shakeNewComment(), TimeOutDelay);
        break;
      case ViewActions.DELETE_COMMENT:
        setTimeout(() => this.shake.call({ element: document.getElementById(commentId) }), TimeOutDelay);
        this.updateElement({ isDeleting: null, });
        this.element.scrollTo(0, this._state.scrollPosition);
        break;
    }
  };

  deleteSaveCommentHandler = () => {
    document.removeEventListener('keydown', this.#commentSaveHandler);
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
