import React from 'react'
import Navbar from './Navbar'
import Container1 from './Container1'
import Grid from './Grid'
import AutoSlider from './AutoSlider'
import IssuesContainer from './IssuesContainer'
import Footer from './Footer'


const Home = (props) => {
 
  return (
    <div className='min-h-screen w-screen ' >
      <Navbar/>
      <AutoSlider/>
      <Container1/>
       <Grid ResolveSteps={props.ResolveSteps} />
      <IssuesContainer issue={props.issue} />
      <Footer/>
    </div>
  )
}

export default Home