import { useState } from 'react';
import { Container, Stack } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export const BASE_URL = 'http://localhost:5000/api';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stack minH="100vh" spacing={2}>
        <Navbar />
        <Container>
          <TaskForm />
          <TaskList />
        </Container>
      </Stack>
    </>
  );
}

export default App;
