import { gql } from '@apollo/client';

/*----- User -----*/
export const SEARCH_USER = gql`
  mutation SearchUser($user: UserInput) {
    searchUser(user: $user) {
      token
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      token
    }
  }
`;

/*----- Todo -----*/
export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      comment
      completed
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: ID) {
    getTodo(id: $id) {
      id
      title
      comment
      completed
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($todo: TodoInput) {
    createTodo(todo: $todo) {
      success
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($todo: TodoInput) {
    updateTodo(todo: $todo) {
      success
      id
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID) {
    deleteTodo(id: $id) {
      success
      id
    }
  }
`;
