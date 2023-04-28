import React from 'react'
import Header from '../components/Header'
import HomePageMiddleSection from '../components/HomePageMiddleSection'
import { Helmet } from 'react-helmet'

const HomePage = () => {
  return (
    <div className='home-page'>
      <Helmet>
        <title>Home</title>
      </Helmet>
        <Header />
        <HomePageMiddleSection />
    </div>
  )
}

export default HomePage