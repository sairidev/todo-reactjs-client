import { jwtDecode } from 'jwt-decode';
const TOKEN = 'token';

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN, `Bearer ${token}`);
  }

  localStorage.setItem(TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN);
};

export const decodeToken = (token) => {
  return jwtDecode(token.replace('Bearer ', ''));
};
