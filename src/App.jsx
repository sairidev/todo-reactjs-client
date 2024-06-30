import { useEffect, useMemo, useState } from 'react';
import UserContext from './context/UserContext';
import Auth from './components/auth/Auth';
import Home from './components/home/Home';
import { ToastContainer } from 'react-toastify';
import { decodeToken, getToken, setToken } from '../utils/auth';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const { payload } = decodeToken(token);
      setUser(payload);
    } else {
      setUser(false);
    }
  }, []);

  const logout = () => {
    setToken('');
    setUser(false);
  };

  const currentUser = (data) => {
    const { payload } = decodeToken(data);
    setUser(payload);
  };

  const actions = useMemo(() => ({ logout, currentUser }));

  return (
    <UserContext.Provider value={actions}>
      {user ? <Home /> : <Auth />}
      <ToastContainer
        position='top-right'
        autoClose={3000}
        newestOnTop
        closeOnClick
        hideProgressBar
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </UserContext.Provider>
  );
}

export default App;
