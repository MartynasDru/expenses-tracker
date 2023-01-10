import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { PageLayout } from './components/PageLayout/PageLayout';
import { Expenses } from './pages/Expenses/Expenses';
import { Login } from './pages/Login/Login';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setUser(user);
    navigate('/');
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<PageLayout user={user} />}>
          <Route index element={<Expenses />} />
        </Route>
        <Route path="/login" element={<Login onSuccess={handleLoginSuccess} />} />
      </Routes>
    </div>
  );
}

export default App;
