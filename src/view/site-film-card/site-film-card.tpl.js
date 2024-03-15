import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DESRIPTION_MAX_SYMBOLS } from '../../consts';

export const createFilmCard = (film) => {
  const getDescription = (desc) => {
    if (desc.length < DESRIPTION_MAX_SYMBOLS) {
      return desc;
    } else {
      const arr = desc.split(' ');
      let result = '';
      for (const word of arr) {
        result += ` ${word}`;
        if (result.length > DESRIPTION_MAX_SYMBOLS) {
          return `${ result.slice(0, result.length - word.length) }...`;
        }
      }
    }
  };
  const { title, totalRating, duration: filmDuration, genre, description, poster } = film.filmInfo;
  const releaseYear = new Date(film.filmInfo.release.date).getFullYear();
  const userDetails = film.userDetails;

  dayjs.extend(duration);

  return `<article class="film-card">
            <a class="film-card__link">
              <h3 class="film-card__title">${ title }</h3>
              <p class="film-card__rating">${ totalRating }</p>
              <p class="film-card__info">
                <span class="film-card__year">${ releaseYear }</span>
                <span class="film-card__duration">${ dayjs.duration(filmDuration, 'minutes').format('H[h] mm[m]') }</span>
                <span class="film-card__genre">${ genre[0] }</span>
              </p>
              <img src="${ poster }" alt="" class="film-card__poster">
              <p class="film-card__description">${ getDescription(description) }</p>
              <span class="film-card__comments">${ film.comments.length } comments</span>
            </a>
            <div class="film-card__controls">
              <button
                class="
                  film-card__controls-item
                  film-card__controls-item--add-to-watchlist
                  ${ userDetails.watchlist ? 'film-card__controls-item--active' : '' }
                "
                id="watchlist"
                type="watchlis"
                title="watchlist"
              >
                  Add to watchlist
              </button>
              <button
                class="
                  film-card__controls-item
                  film-card__controls-item--mark-as-watched
                  ${ userDetails.alreadyWatched ? 'film-card__controls-item--active' : '' }
                "
                id="watched"
                type="button"
                title="already watched"
              >
                Mark as watched
              </button>
              <button
                class="
                  film-card__controls-item
                  film-card__controls-item--favorite
                  ${ userDetails.favorite ? 'film-card__controls-item--active' : '' }
                "
                type="button"
                id="favorite"
                title="favorite"
              >
                Mark as favorite
              </button>
            </div>
          </article>`;
};
