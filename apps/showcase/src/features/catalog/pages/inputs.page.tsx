import { useState, type ReactNode } from "react";
import { Search, AtSign } from "lucide-react";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { DeferredMount } from "@/features/catalog/ui/deferred-mount";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import TextInput from "@/components/common/inputs/text";
import PasswordInput from "@/components/common/inputs/text/password";
import PhoneInput from "@/components/common/inputs/text/phone";
import PrefixedTextInput from "@/components/common/inputs/text/prefixed";
import TextareaInput from "@/components/common/inputs/text/textarea";
import { Checkbox } from "@/components/common/inputs/checkbox";
import Switch from "@/components/common/inputs/switch/switch2";
import SwitchField from "@/components/common/inputs/switch/switchField";
import NumberInput from "@/components/common/inputs/number";
import NumberRangeInput from "@/components/common/inputs/number/range";
import OTPInput from "@/components/common/inputs/otp";
import RadioInput from "@/components/common/inputs/radio/radio-input";
import { Select } from "@/components/common/inputs/select";
import { DateInput } from "@/components/common/inputs/date";
import WeightInput from "@/components/common/inputs/weight";
import List from "@/components/common/inputs/list";
import type {
  SelectItem,
  TreeSelectItem,
} from "@/components/common/inputs/select/types";

const DEMO_WIDTH = 320;

const FLAT_OPTIONS: SelectItem[] = [
  { label: "Tehran", value: "tehran", description: "Capital" },
  { label: "Isfahan", value: "isfahan" },
  { label: "Shiraz", value: "shiraz" },
  { label: "Tabriz", value: "tabriz", disabled: true },
  { label: "Mashhad", value: "mashhad", icon: <AtSign className="size-4" /> },
];

const TREE_OPTIONS: TreeSelectItem[] = [
  {
    label: "Fruits",
    value: "fruits",
    children: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
  },
  {
    label: "Vegetables",
    value: "vegetables",
    children: [
      { label: "Carrot", value: "carrot" },
      { label: "Potato", value: "potato" },
    ],
  },
];

const WEIGHT_OPTIONS = [
  { label: "0–10 kg", value: { from: 0, to: 10 } },
  { label: "10–50 kg", value: { from: 10, to: 50 } },
  { label: "50+ kg", value: { from: 50, to: 100 } },
];

const RADIO_OPTIONS = [
  { name: "a", label: "Option A" },
  { name: "b", label: "Option B" },
  { name: "c", label: "Option C", icon: <AtSign className="size-4" /> },
];

const SWITCH_SEVERITIES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const;

const SWITCH_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

const TEXT_SIZES = ["sm", "md", "lg"] as const;

const OTP_STATUSES = [
  "default",
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
] as const;

const OTP_SIZES = ["sm", "md", "lg"] as const;

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function PropsPre({ children }: { children: string }) {
  return (
    <div className="border-border bg-muted/30 overflow-x-auto rounded-xl border p-4 font-mono text-xs leading-relaxed">
      <pre className="text-muted-foreground whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

export function InputsPage() {
  const [text, setText] = useState("Hello");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("09121234567");
  const [prefixed, setPrefixed] = useState("42");
  const [textarea, setTextarea] = useState("Notes…");
  const [checked, setChecked] = useState(true);
  const [cardChecked, setCardChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [switchField, setSwitchField] = useState(false);
  const [number, setNumber] = useState(5);
  const [range, setRange] = useState<[number | undefined, number | undefined]>([
    10, 100,
  ]);
  const [otp, setOtp] = useState("");
  const [radio, setRadio] = useState<string | number>("a");
  const [single, setSingle] = useState<string | number | undefined>("tehran");
  const [multi, setMulti] = useState<(string | number)[]>(["tehran"]);
  const [singleTree, setSingleTree] = useState<string | number | undefined>(
    "apple",
  );
  const [multiTree, setMultiTree] = useState<(string | number)[]>(["apple"]);
  const [orderable, setOrderable] = useState<(string | number)[]>([
    "tehran",
    "isfahan",
  ]);
  const [dateSingle, setDateSingle] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<number[]>([]);
  const [dateTime, setDateTime] = useState<number[]>([]);
  const [weight, setWeight] = useState<{ from?: number; to?: number }>();
  const [listValue, setListValue] = useState<string | number>("tehran");

  return (
    <CatalogPageShell slug="inputs">
      {/* Text */}
      <ShowcaseSection
        title="TextInput"
        description="Floating label text field with status, suffix, sizes, and native input attributes."
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label="Default & controlled">
          <TextInput
            label="Username"
            value={text}
            onChange={setText}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
        <ShowcaseRow label="status & message">
          <TextInput
            label="Success"
            status="success"
            message="Looks good!"
            width={DEMO_WIDTH}
          />
          <TextInput
            label="Error"
            status="error"
            message="Required field"
            width={DEMO_WIDTH}
          />
          <TextInput
            label="Warning"
            status="warning"
            message="Check format"
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
        <ShowcaseRow label="size">
          {TEXT_SIZES.map((size) => (
            <TextInput
              key={size}
              label={`Size ${size}`}
              size={size}
              width={DEMO_WIDTH}
            />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="States">
          <TextInput label="Loading" isLoading width={DEMO_WIDTH} />
          <TextInput
            label="Disabled"
            disabled
            value="Cannot edit"
            width={DEMO_WIDTH}
          />
          <TextInput
            label="Read only"
            readOnly
            value="Read only"
            width={DEMO_WIDTH}
          />
          <TextInput label="Required" required width={DEMO_WIDTH} />
        </ShowcaseRow>
        <ShowcaseRow label="suffix · helperText · showMessage">
          <TextInput
            label="With suffix"
            suffix={<Search className="text-muted-foreground m-3 size-4" />}
            width={DEMO_WIDTH}
          />
          <TextInput
            label="Helper text"
            helperText="We never share your email."
            showMessage={false}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
        <ShowcaseRow label="placeholder · maxLength">
          <TextInput
            label="Email"
            placeholder="you@example.com"
            type="email"
            maxLength={64}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title="PasswordInput"
        description="TextInput with visibility toggle (passShow initial state)."
        layout="stack"
      >
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          passShow={false}
          width={DEMO_WIDTH}
        />
        <PasswordInput
          label="Visible by default"
          passShow
          status="success"
          message="Strong password"
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="PhoneInput"
        description="Iranian mobile format (09xxxxxxxxx) with icon suffix."
        layout="stack"
      >
        <PhoneInput
          label="Mobile"
          value={phone}
          onChange={setPhone}
          width={DEMO_WIDTH}
        />
        <PhoneInput
          label="Invalid"
          value="123"
          status="error"
          message="Enter a valid mobile number"
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="PrefixedTextInput"
        description="Compact input with prefix slot (string or ReactNode)."
      >
        <PrefixedTextInput
          label="Amount"
          prefix="IRR"
          value={prefixed}
          onChange={(v) => setPrefixed(String(v))}
          type="number"
          min={0}
          max={999}
        />
        <PrefixedTextInput label="Domain" prefix="https://" value="app" />
      </ShowcaseSection>

      <ShowcaseSection
        title="TextareaInput"
        description="Multi-line field with floating label container."
        layout="stack"
      >
        <TextareaInput
          label="Description"
          value={textarea}
          onChange={setTextarea}
          rows={4}
        />
        <TextareaInput
          label="Error state"
          status="error"
          message="Too short"
          rows={3}
        />
        <TextareaInput
          label="Disabled"
          disabled
          value="Locked content"
          rows={2}
        />
      </ShowcaseSection>

      {/* Number */}
      <ShowcaseSection
        title="NumberInput"
        description="Numeric field with optional stepper buttons and prefix."
        layout="stack"
        contentClassName="gap-6"
      >
        <NumberInput
          label="Quantity"
          value={number}
          onChange={(v) => v !== undefined && setNumber(v)}
          step={1}
          width={DEMO_WIDTH}
        />
        <NumberInput
          label="With steppers"
          value={number}
          onChange={(v) => v !== undefined && setNumber(v)}
          buttonsVisible
          step={5}
          min={0}
          max={100}
          width={DEMO_WIDTH}
        />
        <NumberInput
          label="Prefix slot"
          prefix={
            <span className="text-muted-foreground px-2 text-xs">kg</span>
          }
          width={DEMO_WIDTH}
        />
        <NumberInput label="Disabled" disabled value={10} width={DEMO_WIDTH} />
      </ShowcaseSection>

      <ShowcaseSection
        title="NumberRangeInput"
        description="From / to numeric range with optional min, max, and custom labels."
        layout="stack"
      >
        <NumberRangeInput
          label="Price range"
          value={range}
          onChange={setRange}
          min={0}
          max={1000}
          fromLabel="Min"
          toLabel="Max"
          width={DEMO_WIDTH}
        />
        <NumberRangeInput
          label="Error"
          status="error"
          message="Invalid range"
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      {/* Checkbox */}
      <ShowcaseSection
        title="Checkbox.Basic"
        description="Icon checkbox with indeterminate, loading, boxed layout, and form attrs."
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label="States">
          <Checkbox.Basic
            checked={checked}
            onChange={setChecked}
            label="Controlled"
          />
          <Checkbox.Basic halfChecked label="Indeterminate" />
          <Checkbox.Basic loading label="Loading" />
          <Checkbox.Basic disabled label="Disabled" />
          <Checkbox.Basic checked disabled label="Disabled checked" />
        </ShowcaseRow>
        <ShowcaseRow label="boxed · description · width">
          <Checkbox.Basic
            boxed
            checked
            label="Boxed"
            description="Extra description text"
            width={280}
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title="Checkbox.Labeled"
        description="Label position left | right and container class names."
      >
        <Checkbox.Labeled label="Label right (default)" checked />
        <Checkbox.Labeled
          label="Label left"
          labelPosition="left"
          description="Supporting text"
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Checkbox.Card"
        description="Card layout with title, subTitle, and custom className slots."
        layout="stack"
      >
        <Checkbox.Card
          title="Premium plan"
          subTitle="Billed annually"
          checked={cardChecked}
          onChange={setCardChecked}
        />
        <Checkbox.Card title="Disabled" subTitle="Unavailable" disabled />
      </ShowcaseSection>

      {/* Switch */}
      <ShowcaseSection
        title="Switch"
        description="severity and size scale the track and thumb colors."
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label="Controlled">
          <Switch active={switchOn} onChange={setSwitchOn} id="demo-switch" />
        </ShowcaseRow>
        <ShowcaseRow label="severity (active)">
          {SWITCH_SEVERITIES.map((severity) => (
            <Switch key={severity} severity={severity} active />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="size">
          {SWITCH_SIZES.map((size) => (
            <Switch key={size} size={size} active />
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title="SwitchField"
        description="Switch inside LabelContainer; use value for controlled state."
        layout="stack"
        contentClassName="gap-4"
      >
        <SwitchField
          label="Notifications"
          value={switchField}
          onChange={setSwitchField}
          width={DEMO_WIDTH}
        />
        <SwitchField
          label="With message"
          value={true}
          status="success"
          message="Enabled"
          width={DEMO_WIDTH}
        />
        <SwitchField
          label="Bare switch (withContainer=false)"
          withContainer={false}
          active
        />
      </ShowcaseSection>

      {/* Radio & OTP */}
      <ShowcaseSection
        title="RadioInput"
        description="Option groups: direction, size, showCircle, width."
        layout="stack"
        contentClassName="gap-6"
      >
        <RadioInput
          options={RADIO_OPTIONS}
          value={radio}
          onChange={(v) => v !== undefined && setRadio(v)}
          direction="horizontal"
          width={DEMO_WIDTH}
        />
        <RadioInput
          options={RADIO_OPTIONS}
          value={radio}
          onChange={(v) => v !== undefined && setRadio(v)}
          direction="vertical"
          size="lg"
          showCircle
        />
        <RadioInput
          options={RADIO_OPTIONS}
          value={radio}
          onChange={(v) => v !== undefined && setRadio(v)}
          size="sm"
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="OTPInput"
        description="Fixed-size cells — size: sm | md | lg, width constrains the row (default md)."
        layout="stack"
        contentClassName="gap-6"
      >
        <OTPInput
          label="Verification code (md, width 280)"
          value={otp}
          onChange={setOtp}
          length={6}
          width={280}
        />
        <ShowcaseRow label="size">
          {OTP_SIZES.map((size) => (
            <OTPInput
              key={size}
              label={size}
              size={size}
              length={6}
              value=""
              autoFocus={false}
            />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="length · numericOnly · allowPaste">
          <OTPInput
            label="4 digits"
            length={4}
            size="sm"
            numericOnly
            value=""
            autoFocus={false}
            onChange={() => {}}
          />
          <OTPInput
            label="no paste"
            length={6}
            size="md"
            allowPaste={false}
            autoFocus={false}
            value=""
            onChange={() => {}}
          />
        </ShowcaseRow>
        <ShowcaseRow label="status (sm)">
          {OTP_STATUSES.map((status) => (
            <OTPInput
              key={status}
              label={status}
              status={status}
              size="sm"
              length={4}
              value="12"
              autoFocus={false}
            />
          ))}
        </ShowcaseRow>
        <OTPInput
          label="Loading"
          isLoading
          length={6}
          width={DEMO_WIDTH}
          value=""
          autoFocus={false}
        />
        <OTPInput
          label="Disabled"
          disabled
          length={6}
          size="lg"
          width={DEMO_WIDTH}
          value="123456"
        />
      </ShowcaseSection>

      <DeferredMount minHeight={480}>
      {/* Select — deferred: Radix popovers + virtualized lists */}
      <ShowcaseSection
        title="Select.Single"
        description="Single value dropdown with search, loading, and virtualized list."
        layout="stack"
        contentClassName="gap-4"
      >
        <Select.Single
          label="City"
          options={FLAT_OPTIONS}
          value={single}
          onChange={setSingle}
          filter
          width={DEMO_WIDTH}
        />
        <Select.Single
          label="Loading"
          options={FLAT_OPTIONS}
          loading
          width={DEMO_WIDTH}
        />
        <Select.Single
          label="Disabled"
          options={FLAT_OPTIONS}
          disabled
          width={DEMO_WIDTH}
        />
        <Select.Single
          label="Unclearable"
          options={FLAT_OPTIONS}
          value="tehran"
          unClearable
          width={DEMO_WIDTH}
        />
        <Select.Single
          label="With defaultValueTitle"
          options={FLAT_OPTIONS}
          defaultValueTitle="Pick a city"
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Select.Multi"
        description="Multiple selection with chips and filter."
        layout="stack"
      >
        <Select.Multi
          label="Cities"
          options={FLAT_OPTIONS}
          value={multi}
          onChange={setMulti}
          filter
          count={multi.length}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Select.SingleTree"
        description="Hierarchical single select (openedAll expands nodes)."
        layout="stack"
      >
        <Select.SingleTree
          label="Category"
          options={TREE_OPTIONS}
          value={singleTree}
          onChange={setSingleTree}
          openedAll
          filter
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Select.MultiTree"
        description="Tree with multiple selection."
        layout="stack"
      >
        <Select.MultiTree
          label="Categories"
          options={TREE_OPTIONS}
          value={multiTree}
          onChange={setMultiTree}
          openedAll
          filter
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Select.MultiOrderable"
        description="Drag-and-drop reorder multi-select (whitChips, selected)."
        layout="stack"
      >
        <Select.MultiOrderable
          label="Ordered cities"
          options={FLAT_OPTIONS}
          selected={orderable}
          onChange={({ selected }) =>
            selected && setOrderable(selected as (string | number)[])
          }
          whitChips
          heading="Priority"
          subHeading="Drag to reorder"
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      {/* Date */}
      <ShowcaseSection
        title="DateInput"
        description="Persian calendar dialog: single, range, time, presets, and limits."
        layout="stack"
        contentClassName="gap-4"
      >
        <DateInput
          label="Single date"
          value={dateSingle}
          onChange={setDateSingle}
          width={DEMO_WIDTH}
        />
        <DateInput
          label="Range"
          range
          value={dateRange}
          onChange={setDateRange}
          width={DEMO_WIDTH}
        />
        <DateInput
          label="With time"
          withTime
          value={dateTime}
          onChange={setDateTime}
          width={DEMO_WIDTH}
        />
        <DateInput
          label="Presets"
          withPreset
          presets={[
            { key: "1m", label: "1 month", months: 1 },
            { key: "3m", label: "3 months", months: 3 },
          ]}
          width={DEMO_WIDTH}
        />
        <DateInput label="Disabled" disabled width={DEMO_WIDTH} />
        <DateInput
          label="Required · error"
          required
          error="Date is required"
          status="error"
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      {/* Weight & List */}
      <ShowcaseSection
        title="WeightInput"
        description="Range chips plus custom from/to fields inside select panel."
        layout="stack"
      >
        <WeightInput
          label="Weight"
          options={WEIGHT_OPTIONS}
          value={weight}
          onChange={setWeight}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="List"
        description="Virtualized selectable list (used inside selects; standalone demo)."
        layout="stack"
      >
        <List
          data={FLAT_OPTIONS}
          value={listValue}
          onChange={(item) => setListValue(item.value as string | number)}
          className="border-border max-h-48 overflow-hidden rounded-lg border"
          virtualized
        />
      </ShowcaseSection>
      </DeferredMount>

      {/* Props reference */}
      <ShowcaseSection
        title="Props reference — TextInput"
        layout="stack"
      >
        <PropsPre>
          {`id?, label?, labelClassName?, status?, message?, suffix?, showMessage?
onChange?(string), isLoading?, required?, helperText?, wrapperClassName?
size?: "sm" | "md" | "lg", width?, className?, style?, disabled?, readOnly?
placeholder?, type?, maxLength?, value?, name?, autoComplete?, …HTML input attrs`}
        </PropsPre>
      </ShowcaseSection>

      <ShowcaseSection
        title="Props reference — Select (shared)"
        layout="stack"
      >
        <PropsPre>
          {`options?, filter?, loading?, disabled?, label?, message?, status?
width?, height?, contentWidth?, count?, searchInputPlaceholder?, onSearch?
onClear?, open?, onOpenChange?, virtualized?, unClearable?, itemTemplate?
onReachBottom?, fitContent?, fixedContent?, scrollable?, maxHeight?
className?: LabelContainerClassName (trigger, wrapper, dropdown, …)`}
        </PropsPre>
      </ShowcaseSection>

      <ShowcaseSection
        title="Props reference — DateInput"
        layout="stack"
      >
        <PropsPre>
          {`label?, value?: number[], onChange?(number[]), disabled?, withTime?
withPreset?, autoClose?, withoutClear?, oneLineLabel?, range?, multiple?
forceLabel?, className?, status?, message?, labelContainerProps?, width?
icon?, presets?, placeholder?, required?, error?, id?, currentDate?
limitedRange?, minDate?, maxDate?`}
        </PropsPre>
      </ShowcaseSection>

      <ShowcaseSection
        title="Props reference — Checkbox · Switch · OTP · Radio"
        layout="stack"
      >
        <PropsPre>
          {`Checkbox.Basic: checked?, halfChecked?, onChange?, disabled?, loading?
id?, name?, value?, label?, description?, boxed?, width?, minWidth?, …

Checkbox.Labeled: + labelPosition?: "left" | "right", labelClassName?, containerClassName?

Checkbox.Card: title?, subTitle?, titleTemplate?, className?: { container, icon, … }

Switch: severity?, size?, active?, id?, onChange?

SwitchField: + label?, value?, status?, message?, width?, withContainer?, labelContainerProps?

OTPInput: length?, value?, onChange?, disabled?, required?, label?, status?, message?
size?: "sm" | "md" | "lg", width?: number | string, className?: { container?, cells?, input?, label?, message? }
autoFocus?, allowPaste?, numericOnly?, isLoading?

RadioInput: options?, value?, onChange?, direction?, size?, showCircle?, width?, id?`}
        </PropsPre>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
