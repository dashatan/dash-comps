import React from 'react'
import { Event } from '../../types'
import { Translation } from '@/lib'

interface TooltipContentProps {
  event: Event
  events: Event[]
  t: Translation
  locale: string
}

interface DeviceEventItemProps {
  event: Event
  index: number
  showIndex: boolean
  locale: string
}

const DeviceEventItem: React.FC<DeviceEventItemProps> = ({ event, index, showIndex, locale }) => {
  const formatEventDate = (timestamp: number): string => {
    return Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    }).format(timestamp)
  }

  const formattedDate = formatEventDate(event.time)

  return (
    <div className='bg-muted/50 flex w-full items-center justify-start gap-1 rounded-md p-2 whitespace-nowrap'>
      {showIndex && <span className='min-w-4 text-center'>{index + 1}</span>}
      <span>{event.name}</span>
      <span className='dir-ltr me-auto pe-4'>{formattedDate}</span>
    </div>
  )
}

export const TooltipContent: React.FC<TooltipContentProps> = ({ event, events, locale }) => {
  const deviceEvents = events.filter((e) => e.deviceId === event.deviceId)

  const showIndex = deviceEvents.length > 1

  return (
    <div className='font-family dir-rtl bg-card text-card-foreground animate-in fade-in-15 slide-in-from-top-5 flex flex-col gap-2 rounded p-2 text-xs whitespace-nowrap shadow-md duration-200 ease-out'>
      <div className='my-2 flex items-start gap-5 border-b pb-2' style={{ whiteSpace: 'nowrap' }}>
        <div className='flex items-center gap-2'>
          <div className='bg-accent/50 flex size-8 items-center justify-center rounded-md'>
            <img src='/cctv.svg' height={20} width={20} alt='CCTV' />
          </div>
          <div className='flex flex-col' style={{ whiteSpace: 'nowrap' }}>
            <span className='text-sm'>{event.name || ''}</span>
            <span className='text-xs'>{event.road || ''}</span>
          </div>
        </div>
      </div>
      <div className='flex max-h-72 flex-col gap-2 overflow-y-auto' style={{ whiteSpace: 'nowrap' }}>
        {deviceEvents.map((e, index) => (
          <DeviceEventItem
            key={`${e.deviceId}-${e.time}-${index}`}
            event={e}
            index={index}
            showIndex={showIndex}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}
