import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';

export const notifySlotReservation = (time: string) => {
  showNotification({
    title: 'Úspěšná rezervace.',
    message: `Úspěšně jste si rezervovali slot v ${time}.`,
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
};
