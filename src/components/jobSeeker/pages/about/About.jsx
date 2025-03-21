import React from 'react'
import AboutSection from './aboutComponents/AboutSection'
import AboutWork from './aboutComponents/AboutWork'
import AboutQuestion from './aboutComponents/AboutQuestion'
import AboutBestSec from './aboutComponents/AboutBestSec'
import Footer from '../../common/footer/Footer'

const About = () => {
  return (
    <>
  
      <AboutSection/>
      <AboutWork/>
      <AboutQuestion/>
      <AboutBestSec/>
      <Footer/>
    </>
  )
}

export default About