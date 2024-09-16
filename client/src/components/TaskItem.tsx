// STARTER CODE:

import { Badge, Box, Flex, Grid, Spinner, Text } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Task } from './TaskList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '../App';
import { useEffect } from 'react';

const TaskItem = ({ task }: { task: Task }) => {
  const queryClient = useQueryClient();
  const { mutate: updateTask, isPending: isUpdating } = useMutation({
    mutationKey: ['updateTask'],
    mutationFn: async () => {
      task.state = !task.state;
      //if (task.state) return alert('Task is already done!');
      try {
        const res = await fetch(BASE_URL + `/tasks/${task._id}`, {
          method: 'PATCH',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const { mutate: deleteTask, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteTask'],
    mutationFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/tasks/${task._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  useEffect(() => {
    console.log('Due Date:', task.dueDate); // Logs dueDate whenever the component renders or task changes
  }, [task.dueDate]);

  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      borderColor="gray.600"
      p={4}
      boxShadow="md"
      mb={4}
    >
      <Grid templateRows="repeat(4, auto)" gap={4}>
        {/* Title */}
        <Text
          color={task.state ? 'green.200' : 'yellow.100'}
          textDecoration={task.state ? 'line-through' : 'none'}
          fontWeight="bold"
          fontSize="lg"
        >
          Title: {task.title}
        </Text>
        {/* Description */}
        <Text
          color={task.state ? 'green.200' : 'yellow.100'}
          textDecoration={task.state ? 'line-through' : 'none'}
        >
          Description: {task.description}
        </Text>
        {/* Due Date */}
        <Text
          color={task.state ? 'green.200' : 'yellow.100'}
          textDecoration={task.state ? 'line-through' : 'none'}
        >
          Due Date: {task.dueDate}
        </Text>

        {/* State */}
        <Text
          color={task.state ? 'green.200' : 'yellow.100'}
          textDecoration={task.state ? 'line-through' : 'none'}
        >
          Status:
          {
            <Badge
              ml={2}
              colorScheme={task.state ? 'green' : 'yellow'}
              maxW="fit-content"
              justifySelf="start"
            >
              {task.state ? 'Done' : 'In Progress'}
            </Badge>
          }
        </Text>
        <Flex alignItems="center">
          <Text color={task.state ? 'green.200' : 'yellow.100'}>
            Toggle Status:
          </Text>
          <Box
            ml={2}
            color={'green.500'}
            cursor={'pointer'}
            onClick={() => updateTask()}
          >
            {!isUpdating ? (
              <FaCheckCircle size={20} />
            ) : (
              <Spinner size={'sm'} />
            )}
          </Box>
        </Flex>
        <Flex alignItems="center">
          <Text color={task.state ? 'green.200' : 'yellow.100'}>
            Delete Task:
          </Text>
          <Box
            ml={2}
            color={'red.500'}
            cursor={'pointer'}
            onClick={() => deleteTask()}
          >
            {!isDeleting ? <MdDelete size={25} /> : <Spinner size={'sm'} />}
          </Box>
        </Flex>
      </Grid>
    </Box>
  );

  // return (
  //   <Flex gap={2} alignItems={'center'}>
  //     <Flex
  //       flex={1}
  //       alignItems={'center'}
  //       border={'1px'}
  //       borderColor={'gray.600'}
  //       p={2}
  //       borderRadius={'lg'}
  //       justifyContent={'space-between'}
  //     >
  //       <Text
  //         color={task.state ? 'green.200' : 'yellow.100'}
  //         textDecoration={task.state ? 'line-through' : 'none'}
  //       >
  //         {task.title}
  //       </Text>
  //       <Text
  //         color={task.state ? 'green.200' : 'yellow.100'}
  //         textDecoration={task.state ? 'line-through' : 'none'}
  //       >
  //         {task.description}
  //       </Text>
  //       {task.state && (
  //         <Badge ml="1" colorScheme="green">
  //           Done
  //         </Badge>
  //       )}
  //       {!task.state && (
  //         <Badge ml="1" colorScheme="yellow">
  //           In Progress
  //         </Badge>
  //       )}
  //     </Flex>
  //     <Flex gap={2} alignItems={'center'}>
  //       <Box
  //         color={'green.500'}
  //         cursor={'pointer'}
  //         onClick={() => updateTask()}
  //       >
  //         {!isUpdating && <FaCheckCircle size={20} />}
  //         {isUpdating && <Spinner size={'sm'} />}
  //       </Box>
  //       <Box color={'red.500'} cursor={'pointer'} onClick={() => deleteTask()}>
  //         {!isDeleting && <MdDelete size={25} />}
  //         {isDeleting && <Spinner size={'sm'} />}
  //       </Box>
  //     </Flex>
  //   </Flex>
  // );
};
export default TaskItem;
