import React from 'react'

const GridCard = (props) => {
  console.log(props.color);
  return (
    <div className='h-auto md:h-110 w-full max-w-90 flex flex-col gap-2 justify-around items-center p-4 md:p-5 pb-3 shadow-md cursor-pointer transition-shadow duration-300 hover:shadow-2xl rounded-2xl bg-white'>
      <span className='h-16 w-16 md:h-20 md:w-20 text-white text-2xl md:text-4xl rounded-full flex items-center justify-center' style={{backgroundColor: props.color.startsWith('#') ? props.color : `#${props.color}` }}>{props.id +1}</span>
      <h1 className='font-medium text-xl md:text-3xl text-center'>{props.heading}</h1>
      <div className='w-full h-auto text-center text-sm md:text-lg'>{props.content}</div>
      <div className='w-full max-w-80 h-20 md:h-30'>
        <img className='w-full h-full object-cover rounded-2xl' src={props.img} alt="" />
      </div>
    </div>
  )
}

export default GridCard