import React, { useState } from 'react'
import Navbar from './components/Navbar/navbar'
import Main from './components/Main/Main'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer/Footer';
import AppDownload from './components/AppDownload/AppDownload';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Body from './components/Body/Body';
import LoginPage from './components/LOGIN/login';
import SmartCampusConnect from './components/Body/Body';
import { Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';

import DashboardPage from './pages/Dashboard';



const App = () => {
 
  return (
    <>
      <div classname='app'>
         <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/dash' element={<DashboardPage/>}/>
        </Routes> 
      </div>
    </>
  )
}

export default App
