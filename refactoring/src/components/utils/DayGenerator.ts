interface Day {
  date: string;
  formattedDate: string;
}

export const generateDaysAheadFromNow = (daysAhead: number): Day[] => {
  const now = new Date();
  const days: Day[] = [];
  for (let i = 0; i < daysAhead; i++) {
    const dayDate = new Date(now);
    dayDate.setDate(dayDate.getDate() + i);

    const day = dayDate.getDate();
    const month = dayDate.getMonth() + 1;
    const year = dayDate.getFullYear();
    const formattedDate = `${day}.${month}.`;

    const formattedDay = {
      date: `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`,
      formattedDate:
        i === 0
          ? `Dnes ${formattedDate}`
          : i === 1
            ? `Zítra ${formattedDate}`
            : formattedDate,
    };
    days.push(formattedDay);
  }
  return days;
};
