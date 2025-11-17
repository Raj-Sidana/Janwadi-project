import React from 'react'


const Footer = () => {
  return (
    <div className='bg-indigo-950 md:h-130 w-screen py-10 px-5 flex justify-center'>
        <div className='bg-indigo-950 border-b-2 md:h-90 w-full md:w-300 mt-5 p-5 flex flex-col md:flex-row justify-around gap-8 md:gap-0'>
            <div className='h-full w-full md:w-50 flex flex-col gap-4'>
                <h1 className='text-white text-xl md:text-2xl font-semibold'>CivicSense India <div className='bg-orange-400 h-0.5 w-13 rounded-full'></div></h1>
                <p className='text-indigo-100 text-sm md:text-base'>Building a culture of collective responsibility through education, awareness, and community action.</p>
            </div>
            <div className='h-full w-full md:w-60 flex flex-col gap-4'>
                <h1 className='text-white text-xl md:text-2xl font-semibold'>Resources <div className='bg-orange-400 h-0.5 w-13 rounded-full'></div></h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Civic Education Materials</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Community Action Toolkit</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Article 51A Guide</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>School Programs</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Corporate Citizenship</h1>
            </div>
            <div className='h-full w-full md:w-60 flex flex-col gap-4'>
                <h1 className='text-white text-xl md:text-2xl font-semibold'>Get Involved <div className='bg-orange-400 h-0.5 w-13 rounded-full'></div></h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Join a Local Group</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Start an Initiative</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Volunteer Opportunities</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Partner With Us</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Donate</h1>
            </div>
            <div className='h-full w-full md:w-60 flex flex-col gap-4'>
                <h1 className='text-white text-xl md:text-2xl font-semibold'>Contact Us <div className='bg-orange-400 h-0.5 w-13 rounded-full'></div></h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Join Telegram Group</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>+91 8349204050</h1>
                <h1 className='text-gray-400 text-sm md:text-base'>Jharkhand, India</h1>
            </div>
        </div>
    </div>
  )
}

export default Footer
