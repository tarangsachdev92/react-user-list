import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Users from './pages/users';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/users' element={<Users />} />
        <Route path='/' element={<Navigate to='/users' replace />} />
      </Routes>
    </Router>
  );
};
export default AppRoutes;
