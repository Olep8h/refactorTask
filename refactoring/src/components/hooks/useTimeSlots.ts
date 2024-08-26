import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateRandomTimeSlots, TimeSlot } from '../utils/TimeSlotGenerator';

export const useTimeSlots = (selectedDay: string) => {
  const [timeSlots, setTimeSlots] = useLocalStorage<TimeSlot[]>(
    `timeSlots-${selectedDay}`,
    [],
  );

  useEffect(() => {
    const storedSlots = localStorage.getItem(`timeSlots-${selectedDay}`);
    if (storedSlots) {
      setTimeSlots(JSON.parse(storedSlots));
    } else {
      const newTimeSlots = generateRandomTimeSlots();
      setTimeSlots(newTimeSlots);
    }
  }, [selectedDay]);

  return [timeSlots, setTimeSlots] as const;
};
