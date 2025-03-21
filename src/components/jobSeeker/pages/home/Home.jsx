import React from 'react'
import Categories from './home_components/Categories'
import HeroSection from './home_components/HeroSection'
import CompanyLogos from './home_components/CompanyLogos'
import RecentJobs from './home_components/RecentJobs'
import TopCompany from './home_components/TopCompanies'
import HomeAbout from './home_components/HomeAbout'
import Testimonials from './home_components/Testimonals'
import Footer from '../../common/footer/Footer'
import Header from '../../common/header/Header'

const Home = () => {
  return (
    <>
    <Header/>
    <HeroSection/>
    <CompanyLogos/>
    <RecentJobs/>
    <Categories/>
    <TopCompany/>
    <HomeAbout/>
    <Testimonials/>
    <Footer/>
    </>
  )
}

export default Home