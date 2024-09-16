import { Button, Flex, Input, Spinner } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { BASE_URL } from '../App';

const TaskForm = () => {
  // Manage both title and description in state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const queryClient = useQueryClient();

  const { mutate: createTask, isPending: isCreating } = useMutation({
    mutationKey: ['createTask'],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(BASE_URL + '/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Send both title and description in the request body
          body: JSON.stringify({ title, description }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        // Clear inputs after successful task creation
        setTitle('');
        setDescription('');
        return data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  return (
    <form onSubmit={createTask}>
      <Flex
        direction="column"
        gap={2}
        border={'1px'}
        borderColor={'gray.600'}
        p={2}
        borderRadius={'lg'}
      >
        {/* Title Input */}
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        {/* Description Input */}
        <Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
        {/* Submit Button */}
        <Button
          mx={2}
          type="submit"
          _active={{
            transform: 'scale(.97)',
          }}
        >
          {isCreating ? <Spinner size={'xs'} /> : <IoMdAdd size={30} />}
        </Button>
      </Flex>
    </form>
  );
};

export default TaskForm;
