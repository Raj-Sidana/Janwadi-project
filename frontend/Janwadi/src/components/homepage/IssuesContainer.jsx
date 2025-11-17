import React from 'react'
import IssuesReports from './IssuesReports'

const IssuesContainer = (props) => {
  return (
    <div className='bg-gray-50/90 h-auto md:h-195 w-full py-10 flex flex-col items-center px-4'>
      <h1 className='text-center text-3xl md:text-5xl font-semibold'>What Issues Can You Report ?</h1>
      <p className='text-center text-lg md:text-2xl text-gray-600 mt-8'>From potholes to park maintenance, we handle all types of community concerns.</p>
      <div className='flex flex-wrap justify-center gap-4 md:gap-5 mt-10'>

      {props.issue.map((elem,i)=>{
       return <IssuesReports key={i} icon={elem.icon} icontext={elem.icontext} heading={elem.heading} content={elem.content} case={elem.case} />
      })}
      </div>
    </div>
  )
}

export default IssuesContainer
