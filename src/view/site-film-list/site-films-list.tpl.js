export const createFilmsListTemplate = (titleName, isEmptyList, isExtra) =>
  `<section class="films-list ${ isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${ !(isEmptyList || isExtra) ? 'visually-hidden' : ''}">${ titleName }</h2>
  </section>`;

