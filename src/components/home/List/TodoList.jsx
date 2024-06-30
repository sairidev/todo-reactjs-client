import { DELETE_TODO, GET_TODO, GET_TODOS, UPDATE_TODO } from '../../../../gql';
import { useMutation } from '@apollo/client';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useState } from 'react';
import './TodoList.scss';

export default function TodoList({ todos }) {
  const [update, setUpdate] = useState({});
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data: { deleteTodo } }) {
      const { getTodos } = cache.readQuery({
        query: GET_TODOS,
      });

      cache.writeQuery({
        query: GET_TODOS,
        data: {
          getTodos: { ...getTodos },
        },
      });
    },
  });

  const [updateTodo] = useMutation(UPDATE_TODO, {
    update(cache, { data: updateTodo }) {
      const { getTodos } = cache.readQuery({
        query: GET_TODOS,
      });

      cache.writeQuery({
        query: GET_TODOS,
        data: {
          getTodos: { ...getTodos },
        },
      });
    },
  });

  const handleDelete = async (id) => {
    const { data } = await deleteTodo({
      variables: {
        id: id,
      },
    });

    if (data.deleteTodo.success) {
      toast.success('Task successfully deleted');
    } else {
      toast.error('The task could not be deleted');
    }
  };

  const handleUpdate = async () => {
    const { data } = await updateTodo({
      variables: {
        todo: {
          id: update.id,
          title: update.title,
          comment: update.comment,
          completed: update.completed,
        },
      },
    });

    if (data.updateTodo.success) {
      toast.success('The task has been updated successfully');
    } else {
      toast.success('The task could not be updated');
    }

    setUpdate({});
  };
  window.addEventListener('keypress', (e) => {
    if (e.key == 'Enter' || e.keyCode == 13) {
      setTimeout(handleUpdate, 100);
    }
  });

  return (
    <div id='todo-list'>
      <div id='todo-header'>
        <span>Title</span>
        <span>Comment</span>
      </div>
      <div id='todo-body'>
        {todos.map((todo) => (
          <div key={todo.id} className='todo'>
            <span title={todo.title}>{todo.title}</span>
            {update.id === todo.id ? (
              <input
                type='text'
                name='comment'
                placeholder='comment'
                value={update.comment}
                autoFocus
                onChange={(e) =>
                  setUpdate({ ...update, comment: e.target.value })
                }
                minLength={4}
                maxLength={300}
                autoComplete='off'
                onBlur={handleUpdate}
              />
            ) : (
              <span title={todo.comment} onClick={() => setUpdate(todo)}>
                {todo.comment}
              </span>
            )}
            <FaTrashAlt onClick={() => handleDelete(todo.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
