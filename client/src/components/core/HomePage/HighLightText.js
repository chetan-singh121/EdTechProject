import React from 'react'

function HighLightText({text}) {
  return (
    <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent font-bold bg-clip-text'>
      {" "}  {text}
    </span>
    
  )
}

export default HighLightText