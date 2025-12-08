import React from 'react'

const IssuesReports = (props) => {
 
  return (
    <div className='mt-5 h-auto md:h-63 w-full max-w-75 bg-white hover:shadow-2xl transition-shadow shadow-md duration-300 flex flex-col gap-3 items-center py-4 px-4 md:px-10'>
      <span className='rounded-full text-3xl md:text-4xl h-16 w-16 md:h-20 md:w-20 flex items-center justify-center bg-blue-200/20'><i className={`${props.icon} font-bold`} style={{color:props.icontext}}></i></span>
      <h1 className='text-lg md:text-xl font-semibold text-center'>{props.heading}</h1>
      <p className='text-center text-sm md:text-base'>{props.content}</p>
      <button className='bg-green-600 font-semibold py-1 px-3 w-full max-w-35 h-8 rounded-3xl text-white text-sm'>{props.case} resolved</button>
    </div>
  )
}

export default IssuesReports
