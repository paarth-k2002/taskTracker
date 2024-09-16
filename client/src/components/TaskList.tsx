// STARTER CODE:

import { Box, Flex, Grid, Spinner, Stack, Text } from '@chakra-ui/react';
import TaskItem from './TaskItem';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../App';

export type Task = {
  _id: number;
  title: string;
  description: string;
  dueDate: string;
  state: boolean;
};

const TaskList = () => {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],

    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + '/tasks');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data || [];
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <>
      <Box maxWidth="100%" mx="auto" p={2}>
        <Text
          fontSize={'4xl'}
          textTransform={'uppercase'}
          fontWeight={'bold'}
          textAlign={'center'}
          my={2}
          bgGradient="linear(to-l, lightgreen, orange)"
          bgClip="text"
        >
          All Tasks
        </Text>
        {isLoading && (
          <Flex justifyContent={'center'} my={2}>
            <Spinner size={'xl'} />
          </Flex>
        )}
        {!isLoading && tasks?.length === 0 && (
          <Stack alignItems={'center'} gap="2">
            <Text fontSize={'xl'} textAlign={'center'} color={'gray.500'}>
              All tasks completed! 🤞
            </Text>
          </Stack>
        )}
        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
          {tasks?.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </Grid>

        {/* <Stack gap={3}>
        {tasks?.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </Stack> */}
      </Box>
    </>
  );
};
export default TaskList;
