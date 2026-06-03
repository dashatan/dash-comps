# Persian Date Picker

A comprehensive Persian date and time picker compound component built for React applications with full Persian calendar support, range selection, presets, and theme integration.

## Features

- 🗓️ **Full Persian Calendar Support** - Complete Persian date system with proper month names, day names, and calendar logic
- 📅 **Multiple Selection Modes** - Single date, date range, and multiple date selection
- ⏰ **Time Picker Integration** - Optional time selection with 12h/24h format support
- 🎯 **Preset Dates** - Built-in and custom preset date ranges (today, yesterday, this week, etc.)
- 🎨 **Theme Integration** - Fully synced with your application's theme system
- ♿ **Accessibility** - Full keyboard navigation and screen reader support
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🌍 **RTL Support** - Proper right-to-left layout for Persian language
- 🔧 **Highly Customizable** - Extensive styling and behavior customization options
- 🧩 **Compound Component** - Modular architecture for maximum flexibility

## Installation

```bash
# The component is already included in your project
# No additional installation required
```

## Basic Usage

```tsx
import PersianDatePicker from '@/components/compound/persian-date-picker'

function MyComponent() {
  const [date, setDate] = useState(null)

  return <PersianDatePicker label='تاریخ تولد' placeholder='تاریخ را انتخاب کنید' value={date} onChange={setDate} withTime={true} withPresets={true} />
}
```

## Range Selection

```tsx
import PersianDatePicker from '@/components/compound/persian-date-picker'

function MyComponent() {
  const [dateRange, setDateRange] = useState(null)

  return <PersianDatePicker label='بازه زمانی' mode='range' value={dateRange} onChange={setDateRange} withPresets={true} />
}
```

## Props

### Basic Props

| Prop          | Type                              | Default                  | Description         |
| ------------- | --------------------------------- | ------------------------ | ------------------- |
| `label`       | `string`                          | -                        | Label for the input |
| `placeholder` | `string`                          | `"تاریخ را انتخاب کنید"` | Placeholder text    |
| `value`       | `PersianDate \| PersianDateRange` | -                        | Current value       |
| `onChange`    | `(value) => void`                 | -                        | Change handler      |
| `disabled`    | `boolean`                         | `false`                  | Disable the picker  |
| `required`    | `boolean`                         | `false`                  | Mark as required    |
| `error`       | `string`                          | -                        | Error message       |
| `message`     | `string`                          | -                        | Helper message      |

### Mode Props

| Prop          | Type                                | Default    | Description                 |
| ------------- | ----------------------------------- | ---------- | --------------------------- |
| `mode`        | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection mode              |
| `withTime`    | `boolean`                           | `false`    | Enable time picker          |
| `timeFormat`  | `'12h' \| '24h'`                    | `'24h'`    | Time format                 |
| `showSeconds` | `boolean`                           | `false`    | Show seconds in time picker |

### Preset Props

| Prop            | Type                  | Default | Description               |
| --------------- | --------------------- | ------- | ------------------------- |
| `withPresets`   | `boolean`             | `true`  | Show preset buttons       |
| `presets`       | `PersianDatePreset[]` | -       | Custom presets            |
| `customPresets` | `PersianDatePreset[]` | -       | Additional custom presets |

### UI Props

| Prop               | Type      | Default | Description                    |
| ------------------ | --------- | ------- | ------------------------------ |
| `showClearButton`  | `boolean` | `true`  | Show clear button              |
| `showAcceptButton` | `boolean` | `true`  | Show accept button             |
| `showCancelButton` | `boolean` | `true`  | Show cancel button             |
| `autoClose`        | `boolean` | `false` | Auto close after selection     |
| `closeOnSelect`    | `boolean` | `false` | Close on single date selection |

### Validation Props

| Prop            | Type            | Default | Description                 |
| --------------- | --------------- | ------- | --------------------------- |
| `minDate`       | `PersianDate`   | -       | Minimum selectable date     |
| `maxDate`       | `PersianDate`   | -       | Maximum selectable date     |
| `disabledDates` | `PersianDate[]` | `[]`    | Disabled specific dates     |
| `disabledDays`  | `number[]`      | `[]`    | Disabled days of week (0-6) |
| `allowPast`     | `boolean`       | `true`  | Allow past dates            |
| `allowFuture`   | `boolean`       | `true`  | Allow future dates          |
| `allowToday`    | `boolean`       | `true`  | Allow today's date          |

### Styling Props

| Prop                  | Type                         | Default | Description           |
| --------------------- | ---------------------------- | ------- | --------------------- |
| `className`           | `PersianDatePickerClassName` | -       | Custom CSS classes    |
| `labelContainerProps` | `LabelContainerProps`        | -       | Label container props |
| `width`               | `number \| string`           | -       | Custom width          |

### Icon Props

| Prop           | Type        | Default | Description       |
| -------------- | ----------- | ------- | ----------------- |
| `icon`         | `ReactNode` | -       | Input icon        |
| `clearIcon`    | `ReactNode` | -       | Clear button icon |
| `calendarIcon` | `ReactNode` | -       | Calendar icon     |
| `timeIcon`     | `ReactNode` | -       | Time icon         |

### Callback Props

| Prop             | Type                                  | Description                |
| ---------------- | ------------------------------------- | -------------------------- |
| `onOpen`         | `() => void`                          | Called when picker opens   |
| `onClose`        | `() => void`                          | Called when picker closes  |
| `onDateChange`   | `(date: PersianDate) => void`         | Called on date change      |
| `onRangeChange`  | `(range: PersianDateRange) => void`   | Called on range change     |
| `onPresetSelect` | `(preset: PersianDatePreset) => void` | Called on preset selection |
| `onClear`        | `() => void`                          | Called on clear            |
| `onAccept`       | `(value) => void`                     | Called on accept           |
| `onCancel`       | `() => void`                          | Called on cancel           |

## Data Types

### PersianDate

```typescript
interface PersianDate {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  second?: number
}
```

### PersianDateRange

```typescript
interface PersianDateRange {
  start: PersianDate
  end: PersianDate
}
```

### PersianDatePreset

```typescript
interface PersianDatePreset {
  key: string
  label: string
  getValue: () => PersianDateRange
}
```

## Built-in Presets

The component includes these built-in presets:

- **امروز** (Today)
- **دیروز** (Yesterday)
- **این هفته** (This Week)
- **هفته گذشته** (Last Week)
- **این ماه** (This Month)
- **ماه گذشته** (Last Month)
- **امسال** (This Year)
- **سال گذشته** (Last Year)

## Custom Presets

```tsx
const customPresets = [
  {
    key: 'last30days',
    label: '۳۰ روز گذشته',
    getValue: () => {
      const today = getCurrentPersianDate()
      const thirtyDaysAgo = addDaysToPersian(today, -30)
      return {
        start: { ...thirtyDaysAgo, hour: 0, minute: 0, second: 0 },
        end: { ...today, hour: 23, minute: 59, second: 59 }
      }
    }
  }
]

<PersianDatePicker
  customPresets={customPresets}
  // ... other props
/>
```

## Styling

### CSS Classes

The component uses CSS classes that can be customized:

```css
.persian-date-picker {
  /* Main container */
}

.persian-date-picker-trigger {
  /* Trigger button */
}

.persian-date-picker-dialog {
  /* Dialog container */
}

.persian-date-picker-calendar {
  /* Calendar grid */
}

.persian-date-picker-day {
  /* Individual day buttons */
}

.persian-date-picker-day--selected {
  /* Selected day */
}

.persian-date-picker-day--in-range {
  /* Day in range */
}

.persian-date-picker-day--today {
  /* Today's date */
}

.persian-date-picker-day--disabled {
  /* Disabled day */
}
```

### Theme Integration

The component automatically integrates with your theme system using CSS custom properties:

```css
.persian-date-picker {
  --pdp-primary: hsl(var(--primary));
  --pdp-primary-foreground: hsl(var(--primary-foreground));
  --pdp-background: hsl(var(--background));
  --pdp-foreground: hsl(var(--foreground));
  /* ... other theme variables */
}
```

## Accessibility

The component includes full accessibility support:

- **Keyboard Navigation** - Arrow keys, Tab, Enter, Escape
- **Screen Reader Support** - Proper ARIA labels and roles
- **Focus Management** - Logical focus flow
- **High Contrast** - Works with high contrast themes

## RTL Support

The component fully supports right-to-left layout:

```tsx
<PersianDatePicker
  rtl={true}
  locale='fa'
  // ... other props
/>
```

## Examples

### Form Integration

```tsx
import { useForm } from 'react-hook-form'
import PersianDatePicker from '@/components/compound/persian-date-picker'

function MyForm() {
  const { register, handleSubmit, setValue, watch } = useForm()

  const birthDate = watch('birthDate')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PersianDatePicker label='تاریخ تولد' value={birthDate} onChange={(date) => setValue('birthDate', date)} withTime={false} required />
    </form>
  )
}
```

### Advanced Usage

```tsx
<PersianDatePicker
  label='بازه زمانی پروژه'
  mode='range'
  withTime={true}
  timeFormat='24h'
  showSeconds={true}
  withPresets={true}
  minDate={{ year: 1400, month: 1, day: 1 }}
  maxDate={{ year: 1410, month: 12, day: 29 }}
  disabledDays={[5, 6]} // Disable Thursday and Friday
  onDateChange={(date) => console.log('Date changed:', date)}
  onRangeChange={(range) => console.log('Range changed:', range)}
  className={{
    container: 'w-full',
    dialog: 'max-w-2xl',
    calendar: 'p-6',
  }}
/>
```

## Performance

The component is optimized for performance:

- **Memoized Components** - Prevents unnecessary re-renders
- **Lazy Loading** - Components load only when needed
- **Efficient Updates** - Minimal DOM updates
- **Memory Management** - Proper cleanup of event listeners

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When contributing to this component:

1. Follow the existing code style
2. Add proper TypeScript types
3. Include accessibility features
4. Test with Persian calendar logic
5. Update documentation

## License

This component is part of your project and follows the same license terms.
