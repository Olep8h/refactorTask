import React, { useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';
import NavigationBar from './NavigationBar';
import TimeList from './TimeList';
import useLocalStorage from './hooks/useLocalStorage';

interface Day {
  date: string;
  formattedDate: string;
}

interface TimeSlot {
  Time: string;
  Capacity: number;
  OriginalCapacity: number;
}

const generateDaysAheadFromNow = (daysAhead: number): Day[] => {
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

const generateRandomTimeSlots = (): TimeSlot[] => {
  return [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ].map((time) => {
    const originalCapacity = 2;
    const capacity = Math.floor(Math.random() * originalCapacity);
    return {
      Time: time,
      Capacity: capacity,
      OriginalCapacity: originalCapacity,
    };
  });
};

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>(
    generateDaysAheadFromNow(2)[0].date,
  );
  const [timeSlots, setTimeSlots] = useLocalStorage<TimeSlot[]>(
    `timeSlots-${selectedDay}`,
    [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const days = generateDaysAheadFromNow(5);

  useEffect(() => {
    const storedSlots = localStorage.getItem(`timeSlots-${selectedDay}`);
    if (storedSlots) {
      setTimeSlots(JSON.parse(storedSlots));
    } else {
      const newTimeSlots = generateRandomTimeSlots();
      setTimeSlots(newTimeSlots);
    }
  }, [selectedDay]);

  const handleDayChange = (date: string) => {
    setSelectedDay(date);
  };

  const handleSlotClick = (time: string) => {
    const updatedSlots = timeSlots.map((slot) =>
      slot.Time === time
        ? slot.Capacity === 1
          ? { ...slot, Capacity: 0 }
          : slot.Capacity === 0 && slot.OriginalCapacity === 2
            ? slot
            : { ...slot, Capacity: 1 }
        : slot,
    );

    setTimeSlots(updatedSlots);

    const selectedSlot = updatedSlots.find((slot) => slot.Time === time);
    if (selectedSlot) {
      if (selectedSlot.Capacity === 0) {
        showNotification({
          title: 'Reservation Successful',
          message: `You have successfully reserved the slot at ${time}.`,
          color: 'green',
          icon: <Check size={14} />,
          autoClose: 3000,
          styles: (theme) => ({
            root: {
              borderColor: theme.colors.green[6],
              backgroundColor: theme.colors.dark[8],
              color: theme.colors.gray[0],
              padding: '10px',
              fontSize: '12px',
              borderRadius: '8px',
              width: '250px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
            },
            title: { fontSize: '14px', fontWeight: 600 },
            description: { fontSize: '12px' },
            closeButton: {
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'transparent',
              color: theme.colors.gray[0],
              border: `1px solid ${theme.colors.gray[0]}`,
              position: 'absolute',
              top: '8px',
              right: '8px',
              '&:hover': {
                backgroundColor: theme.colors.gray[0],
                color: theme.colors.dark[8],
              },
            },
            icon: {
              marginRight: '8px',
            },
          }),
          position: 'top-right',
        });
      }
    }
  };

  return (
    <Box
      style={{
        backgroundColor: '#0E1A2B',
        padding: '2rem',
        borderRadius: '10px',
        color: 'white',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
      }}
    >
      <NavigationBar
        days={days}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onDayChange={handleDayChange}
        selectedDay={selectedDay}
      />
      <TimeList timeSlots={timeSlots} onSlotClick={handleSlotClick} />
    </Box>
  );
};

export default Calendar;
