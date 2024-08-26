import React from 'react';
import { MantineProvider, Container, Title } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Calendar from './components/Calendar';

const App: React.FC = () => {
  return (
    <MantineProvider>
      <Notifications />
      <Container>
        <Title style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Rezervační Kalendář
        </Title>
        <Calendar />
      </Container>
    </MantineProvider>
  );
};

export default App;
