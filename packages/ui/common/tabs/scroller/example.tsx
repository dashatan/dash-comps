'use client'
import React, { useState } from 'react'
import TabScroller from '@/components/common/tabs/scroller/tab-scroller'

/**
 * Example usage of the TabScroller compound component
 */
export function TabScrollerExample() {
  const [activeTab, setActiveTab] = useState('19')

  return (
    <div className='space-y-6 p-6'>
      <TabScroller
        items={[
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
          { name: '6', value: '6' },
          { name: '7', value: '7' },
          { name: '8', value: '8' },
          { name: '9', value: '9' },
          { name: '10', value: '10' },
          { name: '11', value: '11' },
          { name: '12', value: '12' },
          { name: '13', value: '13' },
          { name: '14', value: '14' },
          { name: '15', value: '15' },
          { name: '16', value: '16' },
          { name: '17', value: '17' },
          { name: '18', value: '18' },
          { name: '19', value: '19' },
        ]}
        onSelect={setActiveTab}
        value={activeTab}
        scrollTo='value'
      />

      <TabScroller
        items={[
          {
            name: '1',
            value: '1',
          },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
          { name: '6', value: '6' },
          { name: '7', value: '7' },
          { name: '8', value: '8' },
          { name: '9', value: '9' },
          { name: '10', value: '10' },
          { name: '11', value: '11' },
          { name: '12', value: '12' },
          { name: '13', value: '13' },
          { name: '14', value: '14' },
          { name: '15', value: '15' },
          { name: '16', value: '16' },
          { name: '17', value: '17' },
          { name: '18', value: '18' },
          { name: '19', value: '19' },
        ]}
        onSelect={setActiveTab}
        visibleCount={1}
        value={activeTab}
      />

      <TabScroller
        items={[
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
        ]}
        onSelect={setActiveTab}
        value={activeTab}
        scrollTo='center'
      />

      <TabScroller
        items={[
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
          { name: '6', value: '6' },
          { name: '7', value: '7' },
          { name: '8', value: '8' },
        ]}
        onSelect={setActiveTab}
        value={activeTab}
        scrollTo='start'
      />

      <TabScroller
        items={[
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
        ]}
        onSelect={setActiveTab}
        value={'1'}
        scrollTo='value'
        visibleCount={4}
      />

      <TabScroller
        items={[
          { name: '1', value: '1' },
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
          { name: '5', value: '5' },
        ]}
        onSelect={setActiveTab}
        value={'1'}
        scrollTo='center'
        visibleCount={4}
      />
    </div>
  )
}

export default TabScrollerExample
