import React from 'react'
import Navbar from '../homepage/Navbar'
import SignInForm from './SignInForm'

const Regestration = () => {
  return (
    <div className='min-h-screen w-full overflow-hidden'>
      <Navbar/>
      <div id='formimg' className='h-auto md:h-179 w-full flex justify-center  px-5 py-10 md:py-0 items-center'>
        <div className='h-auto md:h-150 w-full max-w-150 rounded-3xl flex items-center justify-center'>
          <SignInForm/>
        </div>
      </div>

    </div>
  )
}

export default Regestration
