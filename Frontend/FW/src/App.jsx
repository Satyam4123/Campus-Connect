import React, { useState } from 'react'
import Navbar from './components/Navbar/navbar'
import Main from './components/Main/Main'
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer/Footer';
import AppDownload from './components/AppDownload/AppDownload';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Body from './components/Body/Body';

const App = () => {
  const [showLogin,setShowLogin]=useState(false)
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div classname='app'>
        
      <Navbar setShowLogin={setShowLogin}/>
        <Body/>
        <AppDownload/>
        
      </div>
      <Footer/>
    </>
  )
}

export default App
