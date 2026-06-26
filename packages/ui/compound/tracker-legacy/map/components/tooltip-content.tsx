import React from 'react'
import { Event } from '../../types'
import { cn, Translation } from '@/lib'
import {
  TRACKER_TOOLTIP_ICONS,
  type TrackerTooltipIcon,
} from '@/components/compound/tracker-legacy/map/components/tracker-tooltip-icons'

interface TooltipContentProps {
  event: Event
  events: Event[]
  t: Translation
  locale: string
}

interface DeviceEventItemProps {
  event: Event
  activeEvent: Event
  index: number
  showIndex: boolean
  locale: string
  t: Translation
}

function TooltipIcon({
  icon,
  className,
}: {
  icon: TrackerTooltipIcon
  className?: string
}) {
  return (
    <span
      className={cn('text-muted-foreground inline-flex shrink-0 items-center justify-center', className)}
      dangerouslySetInnerHTML={{ __html: TRACKER_TOOLTIP_ICONS[icon] }}
      aria-hidden
    />
  )
}

function formatEventDate(timestamp: number, locale: string): string {
  return Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)
}

function isSameEvent(a: Event, b: Event): boolean {
  return a.id === b.id && a.time === b.time && a.deviceId === b.deviceId
}

function EventStatusBadge({ event, t }: { event: Event; t: Translation }) {
  if (event.error) {
    return (
      <span className="bg-error/15 text-error inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
        <TooltipIcon icon="violation" className="text-error size-3" />
        {t('common.hasViolation')}
      </span>
    )
  }

  if (event.miss) {
    return (
      <span className="bg-warning/15 text-warning inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
        <TooltipIcon icon="alert" className="text-warning size-3" />
        {t('common.noObserve')}
      </span>
    )
  }

  return null
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: TrackerTooltipIcon
  label: string
  value: string
}) {
  if (!value) return null

  return (
    <div className="flex items-center gap-2 text-xs">
      <TooltipIcon icon={icon} />
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}

const DeviceEventItem: React.FC<DeviceEventItemProps> = ({
  event,
  activeEvent,
  index,
  showIndex,
  locale,
  t,
}) => {
  const isActive = isSameEvent(event, activeEvent)
  const formattedDate = formatEventDate(event.time, locale)

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-1 rounded-md border p-2',
        {
          'border-primary/40 bg-primary/10 ring-primary/20 ring-1': isActive,
          'border-error/30 bg-error/10': !isActive && event.error,
          'border-warning/30 bg-warning/10': !isActive && event.miss && !event.error,
          'border-border/60 bg-muted/40': !isActive && !event.error && !event.miss,
        },
      )}
    >
      <div className="flex items-center gap-2">
        {showIndex && (
          <span className="bg-background text-muted-foreground flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
            {index + 1}
          </span>
        )}
        <span className="text-foreground truncate text-xs font-medium">{event.name}</span>
        <EventStatusBadge event={event} t={t} />
      </div>

      <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', showIndex ? 'ps-7' : '')}>
        <span className="text-muted-foreground dir-ltr inline-flex items-center gap-1 text-[11px]">
          <TooltipIcon icon="calendar" className="size-3" />
          {formattedDate}
        </span>
        {!event.miss && (
          <span className="text-muted-foreground dir-ltr inline-flex items-center gap-1 text-[11px]">
            <TooltipIcon icon="speed" className="size-3" />
            {event.speed} km/h
          </span>
        )}
      </div>

      {event.crimes?.length > 0 && (
        <div className={cn('text-error text-[11px]', showIndex ? 'ps-7' : '')}>
          <span className="text-muted-foreground">{t('common.violations')}: </span>
          {event.crimes.join(', ')}
        </div>
      )}
    </div>
  )
}

export const TooltipContent: React.FC<TooltipContentProps> = ({ event, events, t, locale }) => {
  const deviceEvents = events.filter((e) => e.deviceId === event.deviceId)
  const showIndex = deviceEvents.length > 1

  return (
    <div className="font-family bg-card text-card-foreground border-border animate-in fade-in-15 slide-in-from-top-5 flex w-72 max-w-[min(20rem,calc(100vw-2rem))] flex-col gap-3 rounded-lg border p-3 text-xs shadow-lg duration-200 ease-out">
      <div className="border-border flex flex-col gap-3 border-b pb-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary/15 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
            <TooltipIcon icon="camera" className="text-primary size-5 [&>svg]:size-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-foreground truncate text-sm font-semibold">{event.name || ''}</span>
            <EventStatusBadge event={event} t={t} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <MetaRow icon="mapPin" label={t('common.province')} value={event.province} />
          <MetaRow icon="road" label={t('common.road')} value={event.road} />
          {!event.miss && (
            <MetaRow icon="speed" label={t('common.speed')} value={`${event.speed} km/h`} />
          )}
        </div>

        {event.crimes?.length > 0 && (
          <div className="bg-error/10 text-error flex items-start gap-2 rounded-md p-2 text-[11px]">
            <TooltipIcon icon="violation" className="text-error mt-0.5 shrink-0" />
            <div>
              <span className="font-medium">{t('common.violations')}: </span>
              {event.crimes.join(', ')}
            </div>
          </div>
        )}
      </div>

      {deviceEvents.length > 0 && (
        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
          {deviceEvents.map((deviceEvent, index) => (
            <DeviceEventItem
              key={`${deviceEvent.deviceId}-${deviceEvent.time}-${index}`}
              event={deviceEvent}
              activeEvent={event}
              index={index}
              showIndex={showIndex}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
}
