import React from 'react'
import Header from '../../common/header/Header'
import Categories from './home_components/Categories'
import HeroSection from './home_components/HeroSection'
import CompanyLogos from './home_components/CompanyLogos'
import RecentJobs from './home_components/RecentJobs'

const Home = () => {
  return (
    <>
    <Header/>
    <HeroSection/>
    <CompanyLogos/>
    <RecentJobs/>
    <Categories/>
    </>
  )
}

export default Home