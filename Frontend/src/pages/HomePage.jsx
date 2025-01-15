import React from 'react'
import LoginPage from '../components/LOGIN/login'
import AppDownload from '../components/AppDownload/AppDownload'
import Footer from '../components/Footer/Footer'

const HomePage = () => {
  return (
    <div className='flex flex-col'>
      <LoginPage/>
      <AppDownload/>
      <Footer/>
      
    </div>
  )
}

export default HomePage

