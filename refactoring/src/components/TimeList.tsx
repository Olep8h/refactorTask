import React from 'react';
import { Button } from '@mantine/core';

interface TimeSlot {
  Time: string;
  Capacity: number;
  OriginalCapacity: number;
}

interface TimeListProps {
  timeSlots: TimeSlot[];
  onSlotClick: (time: string) => void;
}

const TimeList: React.FC<TimeListProps> = ({ timeSlots, onSlotClick }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {timeSlots.map((slot) => (
        <div key={slot.Time} style={{ flex: '0 1 calc(25% - 10px)' }}>
          <Button
            variant="outline"
            disabled={slot.Capacity === 0 && slot.OriginalCapacity === 2}
            style={{
              backgroundColor: slot.Capacity === 0 ? '#1B2735' : '#2D9463',
              color: '#FFF',
              borderColor: '#FFF',
              minWidth: '50px',
              minHeight: '50px',
              borderRadius: '15px',
              fontWeight: 'bold',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={() => onSlotClick(slot.Time)}
          >
            {slot.Time} ({slot.OriginalCapacity - slot.Capacity}/{slot.OriginalCapacity}
            )
          </Button>
        </div>
      ))}
    </div>
  );
};

export default TimeList;
