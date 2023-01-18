import { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { PageLayout } from './components/PageLayout/PageLayout';
import { LOCAL_STORAGE_JWT_TOKEN_KEY } from './constants/constants';
import { UserContext } from './contexts/UserContextWrapper';
import { Expenses } from './pages/Expenses/Expenses';
import { Login } from './pages/Login/Login';
import { NotFound } from './pages/NotFound/NotFound';
import { Register } from './pages/Register/Register';

function App() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN_KEY);
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/token/verify`, {
        headers: {
          authorization: 'Bearer ' + token
        }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const { id, name } = data;
          setUser({ id, name });
          navigate('/');
        }
      });
    }

    // fetch(`${process.env.REACT_APP_API_URL}/test`)
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data);
    //   });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Expenses />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
