import dayjs from 'dayjs';

export const sortTimeDown = (filmA, filmB) => {
  const {date: dateA} = filmA.film_info.release;
  const {date: dateB} = filmB.film_info.release;
  const durationInMinutesA = dayjs(dateA);
  const durationInMinutesB = dayjs(dateB);

  return durationInMinutesB - durationInMinutesA;
};
