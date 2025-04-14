import React from 'react'
import SmartCampusConnect from '../components/Body/Body'
import AppDownload from '../components/AppDownload/AppDownload'
import Footer from '../components/Footer/Footer'

const DashboardPage = () => {
  return (
    <div>
      <SmartCampusConnect />
      <AppDownload />
      <Footer />
    </div>
  )
}

export default DashboardPage