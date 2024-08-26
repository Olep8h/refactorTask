import React from 'react';
import { Group, Button } from '@mantine/core';

interface Day {
  date: string;
  formattedDate: string;
}

interface NavigationBarProps {
  days: Day[];
  currentPage: number;
  selectedDay: string;
  setCurrentPage: (page: number) => void;
  onDayChange: (date: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  days,
  currentPage,
  selectedDay,
  setCurrentPage,
  onDayChange,
}) => {
  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(days.length / 2)) setCurrentPage(currentPage + 1);
  };

  const handleDayClick = (date: string) => {
    onDayChange(date);
  };

  const daySelection = days.slice((currentPage - 1) * 2, currentPage * 2);

  return (
    <Group mb="md" style={{ display: 'flex', alignItems: 'center' }}>
      <Button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        style={{
          backgroundColor: '#1B2735',
          color: '#FFF',
          borderRadius: '50%',
          marginRight: '10px',
        }}
      >
        &lt;
      </Button>
      <Group style={{ display: 'flex', alignItems: 'center' }}>
        {daySelection.map((day) => (
          <Button
            key={day.date}
            variant="outline"
            onClick={() => handleDayClick(day.date)}
            style={{
              backgroundColor: day.date === selectedDay ? '#F2B638' : '#1B2735',
              color: '#FFF',
              borderColor: day.date === selectedDay ? '#F2B638' : '#FFF',
              borderRadius: '15px',
              minWidth: '100px',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            {day.formattedDate}
          </Button>
        ))}
        <Button
          onClick={handleNextClick}
          disabled={currentPage === Math.ceil(days.length / 2)}
          style={{
            backgroundColor: '#1B2735',
            color: '#FFF',
            borderRadius: '50%',
          }}
        >
          &gt;
        </Button>
      </Group>
    </Group>
  );
};

export default NavigationBar;
