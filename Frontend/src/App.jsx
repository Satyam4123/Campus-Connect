import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/Dashboard';

const App = () => {
  return (
    <>
      <div classname='app'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          {/* <Route path='/dash' element={<DashboardPage />} /> */}
        </Routes>
      </div>
    </>
  );
};

export default App;
