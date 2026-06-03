import React from 'react'

interface IranPlateIconProps {
  color?: string
  width?: number
  height?: number
  className?: string
}

const IranPlateIcon: React.FC<IranPlateIconProps> = ({ color = 'var(--color-sidebar-icon)', width = 42.019, height = 9.656, className }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <g id='Group_6438' data-name='Group 6438' transform='translate(0.8 0.8)'>
        <path
          id='Path_2449'
          data-name='Path 2449'
          d='M9921.178,7423.741v7.974'
          transform='translate(-9880.759 -7423.741)'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeWidth='1.6'
        />
        <path
          id='Path_2454'
          data-name='Path 2454'
          d='M9921.178,7423.741v7.974'
          transform='translate(-9905.488 -7423.741)'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeWidth='1.6'
        />
        <path
          id='Path_2450'
          data-name='Path 2450'
          d='M9926.149,7423.741v3.626h-12.3v4.431h-5.482'
          transform='translate(-9889.069 -7423.741)'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeWidth='1.6'
        />
        <path
          id='Path_2451'
          data-name='Path 2451'
          d='M9917.865,7427.84v1.689'
          transform='translate(-9882.907 -7421.081)'
          fill='none'
          stroke={color}
          strokeWidth='1.6'
        />
        <path
          id='Path_2452'
          data-name='Path 2452'
          d='M9917.865,7427.84v1.689'
          transform='translate(-9886.205 -7421.081)'
          fill='none'
          stroke={color}
          strokeWidth='1.6'
        />
        <path
          id='Path_2455'
          data-name='Path 2455'
          d='M9917.865,7427.84v1.689'
          transform='translate(-9912.583 -7427.84)'
          fill='none'
          stroke={color}
          strokeWidth='1.6'
        />
        <path
          id='Path_2453'
          data-name='Path 2453'
          d='M9906.8,7423.741v7.153h-10.14v-7.153'
          transform='translate(-9896.66 -7423.741)'
          fill='none'
          stroke={color}
          strokeLinecap='round'
          strokeWidth='1.6'
        />
      </g>
    </svg>
  )
}

export default IranPlateIcon
