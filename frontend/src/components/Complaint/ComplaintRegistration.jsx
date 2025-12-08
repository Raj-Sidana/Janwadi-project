import React from 'react'
import Navbar from '../homepage/Navbar'
import ComplaintForm from './ComplaintForm'

const ComplaintRegistration = () => {
  return (
    <div className='min-h-screen w-full overflow-x-hidden'>
      <Navbar/>
      <div id='formimg' className='min-h-[calc(100vh-120px)] w-full flex justify-center px-4 py-8 md:px-6 md:py-12 items-start pt-20 md:pt-28 pb-8 md:pb-12'>
        <div className='w-full max-w-2xl md:max-w-3xl rounded-3xl flex items-center justify-center'>
          <ComplaintForm/>
        </div>
      </div>
    </div>
  )
}

export default ComplaintRegistration

