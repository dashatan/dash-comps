import React from 'react'
import { ArrowMarkerConfig } from '../types'

interface ArrowMarkerProps {
  config: ArrowMarkerConfig
}

export const ArrowMarker: React.FC<ArrowMarkerProps> = ({ config }) => {
  return (
    <div className='flex size-16 items-center justify-center' style={{ transform: `rotate(${config.angle}deg)` }}>
      <img src='/pointer-2.svg' className='fill-background -rotate-59' alt='arrow' />
    </div>
  )
}
