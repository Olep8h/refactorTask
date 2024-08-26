export interface TimeSlot {
  Time: string;
  Capacity: number;
  OriginalCapacity: number;
}

export const generateRandomTimeSlots = (): TimeSlot[] => {
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
