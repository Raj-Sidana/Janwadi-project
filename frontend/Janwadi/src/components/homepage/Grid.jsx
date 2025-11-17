import React from 'react'
import GridCard from './GridCard'

const Grid = (props) => {
  console.log(props)
  return (
    <>
    <h1 className='text-center text-3xl md:text-5xl font-semibold py-5 mb-10'>Steps. To. Resolve. Issues. <br />
    <p className='text-lg md:text-2xl text-gray-600 mt-8'>The Janvaani platform simplifies civic action into three transparent steps.</p>
    </h1>
    <div className='w-full h-auto flex justify-center flex-wrap bg-blue-50/70 shrink-0 gap-4 md:gap-8 py-10 px-4'>
    {props.ResolveSteps.map((elem,i)=>{
      return <GridCard key={i} id={i} heading={elem.heading} content={elem.Content} img={elem.pic} color={elem.color} />
    })}

    </div>
    </>
  )
}

export default Grid