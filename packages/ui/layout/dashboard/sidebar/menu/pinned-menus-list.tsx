import React, { useRef, useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { MenuItem } from '@/components/layout/dashboard/types'
import Link from 'next/link'
import { cn } from '@/lib'
import { isActiveMenu } from '@/components/layout/dashboard/sidebar/menu/utils'
import { usePathname } from 'next/navigation'

function SortableItem({ id, item, onRemove }: { id: string; item: MenuItem; onRemove: (e: React.MouseEvent) => void }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const [isHandleActive, setIsHandleActive] = useState(false)
  const pathname = usePathname()
  const isActive = isActiveMenu(item, pathname)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.5 : 1,
  }
  const cursor = isDragging || isHandleActive ? 'grabbing' : 'grab'
  return (
    <Link href={(item.path as any) || '#'}>
      <div
        ref={setNodeRef}
        id={`pinned-menu-${item.path?.replace(/\//g, '-') || item.title.replace(/\s+/g, '-').toLowerCase()}`}
        style={style}
        className={cn('hover:bg-sidebar-accent flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-md transition-all select-none', {
          'bg-sidebar-accent': isActive,
        })}
      >
        <div
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          style={{ cursor, display: 'flex', alignItems: 'center' }}
          className='hover:bg-accent flex h-full w-8 items-center justify-center transition-all'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={() => setIsHandleActive(true)}
          onMouseUp={() => setIsHandleActive(false)}
          onMouseLeave={() => setIsHandleActive(false)}
        >
          <GripVertical size={16} />
        </div>
        <span>{item.title}</span>
        <div className='hover:bg-accent ms-auto flex h-full w-8 items-center justify-center transition-all' onClick={onRemove}>
          <X size={16} />
        </div>
      </div>
    </Link>
  )
}

export default function PinnedMenusList({
  pinned,
  setPinned,
  className = '',
}: {
  pinned: MenuItem[]
  setPinned: (items: MenuItem[]) => void
  className?: string
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeItem = pinned.find((item) => item.title === activeId)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
    document.body.classList.add('dnd-grabbing')
  }
  const handleDragEnd = (event: any) => {
    setActiveId(null)
    document.body.classList.remove('dnd-grabbing')
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = pinned.findIndex((item) => item.title === active.id)
      const newIndex = pinned.findIndex((item) => item.title === over.id)
      setPinned(arrayMove(pinned, oldIndex, newIndex))
    }
  }
  const handleDragCancel = () => {
    setActiveId(null)
    document.body.classList.remove('dnd-grabbing')
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <SortableContext items={pinned.map((item) => item.title)} strategy={verticalListSortingStrategy}>
        <div className={`flex flex-col gap-2 text-sm ${className}`}>
          {pinned.map((item) => (
            <SortableItem
              key={item.title}
              id={item.title}
              item={item}
              onRemove={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setPinned(pinned.filter((x) => x.title !== item.title))
              }}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <div className='hover:bg-sidebar-accent bg-background flex h-10 items-center gap-2 rounded-md p-2 shadow-lg transition-all select-none'>
            <GripVertical size={16} />
            <span>{activeItem.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
