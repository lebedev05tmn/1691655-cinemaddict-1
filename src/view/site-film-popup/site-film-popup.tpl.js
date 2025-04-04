import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { RelativeTime } from '../../utils/consts';

const getReadbleDate = (date) => {
  dayjs.extend(relativeTime);
  dayjs.extend(updateLocale);

  dayjs.updateLocale('en', {
    relativeTime: RelativeTime,
  });

  return dayjs(date).fromNow();
};

export const createFilmPopup = (film, comments, state) => {
  const createCommentsList = () => {
    const commentsList = comments.map(
      (commentData) => {
        const { id, author, comment, emotion, date } = commentData;

        return `<li class="film-details__comment" id=${ id }>
                  <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${ emotion }.png" width="55" height="55" alt="emoji-${ emotion }">
                </span>
                <div>
                  <p class="film-details__comment-text">${ comment }</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${ author }</span>
                    <span class="film-details__comment-day">${ getReadbleDate(date) }</span>
                    <button class="film-details__comment-delete" id="${id}">${ state.isDeleting === id ? 'Deleting' : 'Delete' }</button>
                  </p>
                </div>
              </li>`;
      }
    ).join('');

    return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${ comments.length }</span></h3>
            <ul class="film-details__comments-list">
              ${ commentsList }
            </ul>`;
  };

  const { title, totalRating, poster, ageRating, director, writers, actors, release, duration: filmDuration, genre, description } = film.filmInfo;
  const releaseDate = dayjs(release.date).format('DD MMMM YYYY');
  const userDetails = film.userDetails;
  const genreList = genre.map((el) => `<span class="film-details__genre">${el}</span>`).join('');

  dayjs.extend(duration);

  return `<section class="film-details" id=${film.id}>
            <div class="film-details__inner">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${ poster }" alt="">

                    <p class="film-details__age">${ ageRating }+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${ title }</h3>
                        <p class="film-details__title-original">${ title }</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${ totalRating }</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${ director }</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${ writers.join(', ') }</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${ actors.join(', ') }</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${ releaseDate }</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Duration</td>
                        <td class="film-details__cell">${ dayjs.duration(filmDuration, 'minutes').format('H[h] mm[m]') }</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${ release.releaseCountry }</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">
                          ${ genre.length > 1 ? 'Genres' : 'Genre'}
                        </td>
                        <td class="film-details__cell">
                          ${ genreList }
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${ description }
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button
                    type="button"
                    class="
                      film-details__control-button
                      film-details__control-button--watchlist
                      ${ userDetails.watchlist ? 'film-details__control-button--active' : '' }"
                    id="watchlist"
                    name="watchlist"
                  >
                    Add to watchlist
                  </button>
                  <button
                    type="button"
                    class="
                      film-details__control-button
                      film-details__control-button--watched
                      ${ userDetails.alreadyWatched ? 'film-details__control-button--active' : '' }
                    "
                    id="watched"
                    name="watched"
                  >
                    Already watched
                  </button>
                  <button
                    type="button"
                    class="
                      film-details__control-button
                      film-details__control-button--favorite
                      ${ userDetails.favorite ? 'film-details__control-button--active' : '' }
                    "
                    id="favorite"
                    name="favorite"
                  >
                    Add to favorites
                  </button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">

                  ${ createCommentsList() }

                  <form class="film-details__new-comment" action="" method="get">
                    <div class="film-details__add-emoji-label"></div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </section>`;
};
