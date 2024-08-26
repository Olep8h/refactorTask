import React, { useState } from 'react';
import { Box } from '@mantine/core';
import NavigationBar from './NavigationBar';
import TimeList from './TimeList';
import { notifySlotReservation } from './Notification';
import { generateDaysAheadFromNow } from './utils/DayGenerator';
import { useTimeSlots } from './hooks/useTimeSlots';

const Calendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>(
    generateDaysAheadFromNow(2)[0].date,
  );
  const [timeSlots, setTimeSlots] = useTimeSlots(selectedDay);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const days = generateDaysAheadFromNow(5);

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
    if (selectedSlot?.Capacity === 0) {
      notifySlotReservation(time);
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
