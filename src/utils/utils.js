import dayjs from 'dayjs';

export const sortTimeDescending = (filmA, filmB) => {
  const {date: dateA} = filmA.filmInfo.release;
  const {date: dateB} = filmB.filmInfo.release;
  const durationInMinutesA = dayjs(dateA);
  const durationInMinutesB = dayjs(dateB);

  return durationInMinutesB - durationInMinutesA;
};
