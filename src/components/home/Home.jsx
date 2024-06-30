import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import Container from '../Container';
import avatar from '../../assets/avatar.png';
import TodoList from './List/TodoList';
import TodoForm from './Form/TodoForm';
import { useQuery } from '@apollo/client';
import { GET_TODOS } from '../../../gql';
import './Home.scss';

export default function Home() {
  const { logout } = useContext(UserContext);
  const [todos, setTodos] = useState([]);
  const { loading, data } = useQuery(GET_TODOS);

  useEffect(() => {
    if (data) {
      setTodos(data.getTodos);
    }
  }, [data]);

  return (
    <div id='home'>
      <header>
        <h1>Todo</h1>

        <div>
          <div id='avatar'>
            <img src={avatar} height={20} width={20} alt='avatar' />
          </div>
          <span id='logout' onClick={logout}>
            Logout
          </span>
        </div>
      </header>

      <Container>
        {loading ? (
          <p>Loading...</p>
        ) : todos.length > 0 ? (
          <TodoList todos={todos} />
        ) : (
          <p>Empty</p>
        )}
        <TodoForm />
      </Container>
    </div>
  );
}
