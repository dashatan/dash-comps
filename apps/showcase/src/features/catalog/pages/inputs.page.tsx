import { useState, type ReactNode } from "react";
import {
  Search,
  AtSign,
  Copy,
  DollarSign,
  Euro,
  PoundSterling,
} from "lucide-react";
import { Button } from "@/components/common/buttons";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { DeferredMount } from "@/features/catalog/ui/deferred-mount";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import TextInput from "@/components/common/inputs/text";
import PasswordInput from "@/components/common/inputs/text/password";
import PhoneInput from "@/components/common/inputs/text/phone";
import TextareaInput from "@/components/common/inputs/text/textarea";
import { Checkbox } from "@/components/common/inputs/checkbox";
import Switch from "@/components/common/inputs/switch/switch";
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
import { cn } from "@dash/core/utils";

const DEMO_WIDTH = 320;

const SWITCH_SEVERITIES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const;

const SWITCH_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

const RADIO_SIZES = ["sm", "md", "lg"] as const;

const OTP_STATUSES = [
  "default",
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
] as const;

const OTP_SIZES = ["sm", "md", "lg"] as const;

const OTP_PASTE_SAMPLES = {
  numeric: "482910",
  numericBlocked: "135790",
  alphanumeric: "AB12XY",
} as const;

async function copyOtpSample(text: string) {
  await navigator.clipboard.writeText(text);
}

function OtpPasteDemo({
  sample,
  children,
  copyLabel,
}: {
  sample: string;
  children: ReactNode;
  copyLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {children}
      <Button
        type="button"
        variant="outlined"
        size="md"
        onClick={() => void copyOtpSample(sample)}
      >
        <Copy className="size-4" />
        {copyLabel}
      </Button>
    </div>
  );
}

function ShowcaseRow({
  label,
  children,
  direction = "horizontal",
}: {
  label: string;
  children: ReactNode;
  direction?: "horizontal" | "vertical";
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 border-b pb-4">
      <p className="text-lg font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div
        className={cn(
          "flex flex-wrap items-center items-start gap-3 gap-y-6",
          direction === "horizontal" ? "flex-row" : "flex-col",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function PropsPre({ children }: { children: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs leading-relaxed">
      <pre className="whitespace-pre-wrap text-muted-foreground">
        {children}
      </pre>
    </div>
  );
}

export function InputsPage() {
  const p = useShowcasePage("inputs");

  const flatOptions: SelectItem[] = [
    {
      label: p("demo.cities.tehran"),
      value: "tehran",
      description: p("demo.cities.capital"),
    },
    { label: p("demo.cities.isfahan"), value: "isfahan" },
    { label: p("demo.cities.shiraz"), value: "shiraz" },
    { label: p("demo.cities.tabriz"), value: "tabriz", disabled: true },
    {
      label: p("demo.cities.mashhad"),
      value: "mashhad",
      icon: <AtSign className="size-4" />,
    },
    { label: p("demo.cities.rasht"), value: "rasht" },
    { label: p("demo.cities.kerman"), value: "kerman" },
    { label: p("demo.cities.khorasan"), value: "khorasan" },
    { label: p("demo.cities.khuzestan"), value: "khuzestan" },
    { label: p("demo.cities.kohgiluyeh"), value: "kohgiluyeh and buyer ahmad" },
    { label: p("demo.cities.kurdistan"), value: "kurdistan" },
    { label: p("demo.cities.lorestan"), value: "lorestan" },
    { label: p("demo.cities.markazi"), value: "markazi" },
  ];

  const treeOptions: TreeSelectItem[] = [
    {
      label: p("demo.fruits.fruits"),
      value: "fruits",
      children: [
        { label: p("demo.fruits.apple"), value: "apple" },
        { label: p("demo.fruits.banana"), value: "banana" },
      ],
    },
    {
      label: p("demo.fruits.vegetables"),
      value: "vegetables",
      children: [
        { label: p("demo.vegetables.carrot"), value: "carrot" },
        { label: p("demo.vegetables.potato"), value: "potato" },
      ],
    },
  ];

  const weightPresets = [
    { label: p("weightInput.presets.zeroTen"), value: { from: 0, to: 10 } },
    { label: p("weightInput.presets.tenFifty"), value: { from: 10, to: 50 } },
    { label: p("weightInput.presets.fiftyPlus"), value: { from: 50, to: 100 } },
  ] as const;

  const radioOptions = [
    { name: "a", label: p("options.optionA") },
    { name: "b", label: p("options.optionB") },
    { name: "c", label: p("options.optionC") },
  ] as const;

  const radioOptionsWithIcon = [
    {
      name: "a",
      label: p("labels.dollar"),
      icon: <DollarSign className="size-4" />,
    },
    { name: "b", label: p("labels.euro"), icon: <Euro className="size-4" /> },
    {
      name: "c",
      label: p("labels.pound"),
      icon: <PoundSterling className="size-4" />,
    },
  ] as const;

  const [text, setText] = useState(p("values.hello"));
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("09121234567");
  const [textarea, setTextarea] = useState(p("values.notes"));
  const [checked, setChecked] = useState(true);
  const [cardChecked, setCardChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [switchField, setSwitchField] = useState(false);
  const [number, setNumber] = useState(5);
  const [range, setRange] = useState<[number | undefined, number | undefined]>([
    10, 100,
  ]);
  const [otp, setOtp] = useState("");
  const [otpPaste, setOtpPaste] = useState("");
  const [otpTextPaste, setOtpTextPaste] = useState("ABC12");
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
      <ShowcaseSection
        title={p("textInput.title")}
        description={p("textInput.description")}
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label={p("rows.defaultControlled")}>
          <TextInput
            label={p("labels.username")}
            value={text}
            onChange={setText}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("rows.statusMessage")}>
          <TextInput
            label={p("labels.success")}
            status="success"
            message={p("messages.looksGood")}
            width={DEMO_WIDTH}
          />
          <TextInput
            label={p("labels.error")}
            status="error"
            message={p("messages.requiredField")}
            width={DEMO_WIDTH}
          />
          <TextInput
            label={p("labels.warning")}
            status="warning"
            message={p("messages.checkFormat")}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>

        <ShowcaseRow label={p("rows.states")}>
          <TextInput label={p("labels.loading")} isLoading width={DEMO_WIDTH} />
          <TextInput
            label={p("labels.disabled")}
            disabled
            value={p("values.cannotEdit")}
            width={DEMO_WIDTH}
          />
          <TextInput
            label={p("labels.readOnly")}
            readOnly
            value={p("values.readOnly")}
            width={DEMO_WIDTH}
          />
          <TextInput label={p("labels.required")} required width={DEMO_WIDTH} />
        </ShowcaseRow>
        <ShowcaseRow label={p("rows.prefixSuffixHelper")}>
          <TextInput
            label={p("labels.withPrefix")}
            prefix={<Search className="size-6 text-muted-foreground" />}
            width={DEMO_WIDTH}
          />
          <TextInput
            label={p("labels.withSuffix")}
            suffix={<Search className="mx-2 size-6 text-muted-foreground" />}
            width={DEMO_WIDTH}
          />
          <TextInput
            label={p("labels.helperText")}
            helperText={p("helperTexts.neverShareEmail")}
            showMessage={false}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("passwordInput.title")}
        description={p("passwordInput.description")}
        layout="stack"
      >
        <PasswordInput
          label={p("labels.password")}
          value={password}
          onChange={setPassword}
          passShow={false}
          width={DEMO_WIDTH}
        />
        <PasswordInput
          label={p("labels.visibleByDefault")}
          passShow
          status="success"
          message={p("messages.strongPassword")}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("phoneInput.title")}
        description={p("phoneInput.description")}
        layout="stack"
      >
        <PhoneInput
          label={p("labels.mobile")}
          value={phone}
          onChange={setPhone}
          width={DEMO_WIDTH}
        />
        <PhoneInput
          label={p("labels.invalid")}
          value="123"
          status="error"
          message={p("messages.validMobile")}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("textareaInput.title")}
        description={p("textareaInput.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("rows.states")}>
          <TextareaInput
            label={p("labels.description")}
            value={textarea}
            onChange={setTextarea}
            rows={4}
            width={DEMO_WIDTH}
          />
          <TextareaInput
            label={p("labels.errorState")}
            status="error"
            message={p("messages.tooShort")}
            rows={3}
            width={DEMO_WIDTH}
          />
          <TextareaInput
            label={p("labels.disabled")}
            disabled
            value={p("values.lockedContent")}
            rows={2}
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("labels.fullWidth")}>
          <TextareaInput label={p("labels.fullWidth")} />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("numberInput.title")}
        description={p("numberInput.description")}
        layout="stack"
        contentClassName="gap-6"
      >
        <NumberInput
          label={p("labels.quantity")}
          value={number}
          onChange={(v) => v !== undefined && setNumber(v)}
          step={1}
          width={DEMO_WIDTH}
        />
        <NumberInput
          label={p("labels.withSteppers")}
          value={number}
          onChange={(v) => v !== undefined && setNumber(v)}
          buttonsVisible
          step={5}
          min={0}
          max={100}
          width={DEMO_WIDTH}
        />
        <NumberInput
          label={p("labels.suffixSlot")}
          suffix={
            <span className="px-2 text-xs text-muted-foreground">
              {p("numberInput.suffix.kg")}
            </span>
          }
          width={DEMO_WIDTH}
        />
        <NumberInput
          label={p("labels.disabled")}
          disabled
          value={10}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("numberRangeInput.title")}
        description={p("numberRangeInput.description")}
        layout="stack"
      >
        <NumberRangeInput
          label={p("labels.priceRange")}
          value={range}
          onChange={setRange}
          min={0}
          max={1000}
          fromLabel={p("numberRangeInput.fromLabel")}
          toLabel={p("numberRangeInput.toLabel")}
          width={DEMO_WIDTH}
        />
        <NumberRangeInput
          label={p("labels.error")}
          status="error"
          message={p("messages.invalidRange")}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("checkboxBasic.title")}
        description={p("checkboxBasic.description")}
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label={p("checkboxBasic.rows.states")}>
          <Checkbox.Basic
            checked={checked}
            onChange={setChecked}
            label={p("checkboxBasic.labels.controlled")}
          />
          <Checkbox.Basic
            halfChecked
            label={p("checkboxBasic.labels.indeterminate")}
          />
          <Checkbox.Basic loading label={p("checkboxBasic.labels.loading")} />
          <Checkbox.Basic disabled label={p("checkboxBasic.labels.disabled")} />
          <Checkbox.Basic
            checked
            disabled
            label={p("checkboxBasic.labels.disabledChecked")}
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("checkboxBasic.rows.boxedDescriptionWidth")}>
          <Checkbox.Basic
            boxed
            checked
            label={p("checkboxBasic.labels.boxed")}
            description={p("descriptions.extraDescription")}
            width={280}
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("checkboxLabeled.title")}
        description={p("checkboxLabeled.description")}
      >
        <Checkbox.Labeled
          label={p("checkboxLabeled.labels.labelRight")}
          checked
        />
        <Checkbox.Labeled
          label={p("checkboxLabeled.labels.labelLeft")}
          labelPosition="left"
          description={p("checkboxLabeled.descriptions.supportingText")}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("checkboxCard.title")}
        description={p("checkboxCard.description")}
        layout="stack"
      >
        <Checkbox.Card
          title={p("checkboxCard.titles.premiumPlan")}
          subTitle={p("checkboxCard.subtitles.billedAnnually")}
          checked={cardChecked}
          onChange={setCardChecked}
          width={DEMO_WIDTH}
        />
        <Checkbox.Card
          title={p("checkboxCard.titles.disabled")}
          subTitle={p("checkboxCard.subtitles.unavailable")}
          disabled
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("switch.title")}
        description={p("switch.description")}
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label={p("switch.rows.controlled")}>
          <Switch active={switchOn} onChange={setSwitchOn} id="demo-switch" />
        </ShowcaseRow>
        <ShowcaseRow label={p("switch.rows.severityActive")}>
          {SWITCH_SEVERITIES.map((severity) => (
            <Switch key={severity} severity={severity} active />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("switch.rows.size")}>
          {SWITCH_SIZES.map((size) => (
            <Switch key={size} size={size} active />
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("switchField.title")}
        description={p("switchField.description")}
        layout="stack"
        contentClassName="gap-4"
      >
        <SwitchField
          label={p("labels.notifications")}
          value={switchField}
          onChange={setSwitchField}
          width={DEMO_WIDTH}
        />
        <SwitchField
          label={p("labels.withMessage")}
          value={true}
          status="success"
          message={p("messages.enabled")}
          width={DEMO_WIDTH}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("radioInput.title")}
        description={p("radioInput.description")}
        layout="stack"
        contentClassName="gap-6"
      >
        <ShowcaseRow label={p("radioInput.rows.direction")}>
          <RadioInput
            options={radioOptions}
            defaultValue="a"
            direction="vertical"
            width={DEMO_WIDTH}
          />
          <RadioInput
            options={radioOptions}
            defaultValue="a"
            direction="horizontal"
            width={DEMO_WIDTH}
          />
        </ShowcaseRow>

        <ShowcaseRow label={p("radioInput.rows.size")}>
          {[...RADIO_SIZES].reverse().map((size) => (
            <RadioInput
              key={size}
              size={size}
              defaultValue="a"
              options={radioOptions}
              width={DEMO_WIDTH}
              direction="vertical"
            />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("radioInput.rows.icon")}>
          <RadioInput
            defaultValue="a"
            options={radioOptionsWithIcon}
            width={DEMO_WIDTH}
            direction="horizontal"
            size="lg"
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("otpInput.title")}
        description={p("otpInput.description")}
        layout="stack"
        contentClassName="gap-6"
      >
        <OTPInput
          label={p("otpInput.labels.verificationCode")}
          value={otp}
          onChange={setOtp}
          length={6}
          width={280}
        />
        <ShowcaseRow label={p("otpInput.rows.size")}>
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
        <ShowcaseRow label={p("otpInput.rows.lengthNumericOnly")}>
          <OTPInput
            label={p("otpInput.labels.fourDigits")}
            length={4}
            size="sm"
            numericOnly
            value=""
            autoFocus={false}
            onChange={() => {}}
          />
        </ShowcaseRow>
        <ShowcaseRow label={p("otpInput.rows.copyPaste")} direction="vertical">
          <OtpPasteDemo
            sample={OTP_PASTE_SAMPLES.numeric}
            copyLabel={p("buttons.copySample", {
              sample: OTP_PASTE_SAMPLES.numeric,
            })}
          >
            <OTPInput
              label={p("otpInput.labels.pasteFocus")}
              length={6}
              numericOnly
              value={otpPaste}
              onChange={setOtpPaste}
              autoFocus={false}
              width={280}
            />
          </OtpPasteDemo>
          <OtpPasteDemo
            sample={OTP_PASTE_SAMPLES.numericBlocked}
            copyLabel={p("buttons.copySample", {
              sample: OTP_PASTE_SAMPLES.numericBlocked,
            })}
          >
            <OTPInput
              label={p("otpInput.labels.pasteDisabled")}
              length={6}
              allowPaste={false}
              numericOnly
              value=""
              autoFocus={false}
              onChange={() => {}}
              width={280}
            />
          </OtpPasteDemo>
          <OtpPasteDemo
            sample={OTP_PASTE_SAMPLES.alphanumeric}
            copyLabel={p("buttons.copySample", {
              sample: OTP_PASTE_SAMPLES.alphanumeric,
            })}
          >
            <OTPInput
              label={p("otpInput.labels.alphanumericPaste")}
              length={6}
              numericOnly={false}
              value={otpTextPaste}
              onChange={setOtpTextPaste}
              autoFocus={false}
              width={280}
            />
          </OtpPasteDemo>
        </ShowcaseRow>
        <ShowcaseRow label={p("otpInput.rows.statusSm")}>
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
          label={p("otpInput.labels.loading")}
          isLoading
          length={6}
          width={DEMO_WIDTH}
          value=""
          autoFocus={false}
        />
        <OTPInput
          label={p("otpInput.labels.disabled")}
          disabled
          length={6}
          size="lg"
          value="123456"
        />
      </ShowcaseSection>

      <DeferredMount minHeight={480}>
        <ShowcaseSection
          title={p("selectSingle.title")}
          description={p("selectSingle.description")}
          layout="stack"
          contentClassName="gap-4"
        >
          <Select.Single
            label={p("labels.city")}
            options={flatOptions}
            value={single}
            onChange={setSingle}
            filter
            width={DEMO_WIDTH}
          />
          <Select.Single
            label={p("labels.loading")}
            options={flatOptions}
            loading
            width={DEMO_WIDTH}
          />
          <Select.Single
            label={p("labels.disabled")}
            options={flatOptions}
            disabled
            width={DEMO_WIDTH}
          />
          <Select.Single
            label={p("labels.unclearable")}
            options={flatOptions}
            value="tehran"
            unClearable
            width={DEMO_WIDTH}
          />
          <Select.Single
            label={p("labels.withDefaultValueTitle")}
            options={flatOptions}
            defaultValueTitle={p("pickCity")}
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("selectMulti.title")}
          description={p("selectMulti.description")}
          layout="stack"
        >
          <Select.Multi
            label={p("labels.cities")}
            options={flatOptions}
            value={multi}
            onChange={setMulti}
            filter
            count={multi.length}
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("selectSingleTree.title")}
          description={p("selectSingleTree.description")}
          layout="stack"
        >
          <Select.SingleTree
            label={p("labels.category")}
            options={treeOptions}
            value={singleTree}
            onChange={setSingleTree}
            openedAll
            filter
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("selectMultiTree.title")}
          description={p("selectMultiTree.description")}
          layout="stack"
        >
          <Select.MultiTree
            label={p("labels.categories")}
            options={treeOptions}
            value={multiTree}
            onChange={setMultiTree}
            openedAll
            filter
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("selectMultiOrderable.title")}
          description={p("selectMultiOrderable.description")}
          layout="stack"
        >
          <Select.MultiOrderable
            label={p("labels.orderedCities")}
            options={flatOptions}
            labelType="count"
            selected={orderable}
            onChange={({ selected }) =>
              selected && setOrderable(selected as (string | number)[])
            }
            showChips
            chipRowsCount={1}
            heading={p("priority.heading")}
            subHeading={p("priority.subHeading")}
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("dateInput.title")}
          description={p("dateInput.description")}
          layout="stack"
          contentClassName="gap-4"
        >
          <DateInput
            label={p("dateInput.labels.singleDate")}
            value={dateSingle}
            onChange={setDateSingle}
            width={DEMO_WIDTH}
          />
          <DateInput
            label={p("dateInput.labels.range")}
            range
            value={dateRange}
            onChange={setDateRange}
            width={DEMO_WIDTH}
          />
          <DateInput
            label={p("dateInput.labels.withTime")}
            withTime
            value={dateTime}
            onChange={setDateTime}
            width={DEMO_WIDTH}
          />
          <DateInput
            label={p("dateInput.labels.presets")}
            withPreset
            presets={[
              { key: "1m", label: p("dateInput.presets.oneMonth"), months: 1 },
              {
                key: "3m",
                label: p("dateInput.presets.threeMonths"),
                months: 3,
              },
            ]}
            width={DEMO_WIDTH}
          />
          <DateInput
            label={p("dateInput.labels.disabled")}
            disabled
            width={DEMO_WIDTH}
          />
          <DateInput
            label={p("dateInput.labels.requiredError")}
            required
            error={p("dateInput.messages.dateRequired")}
            status="error"
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("weightInput.title")}
          description={p("weightInput.description")}
          layout="stack"
        >
          <WeightInput
            label={p("labels.weight")}
            presets={[...weightPresets]}
            value={weight}
            onChange={setWeight}
            width={DEMO_WIDTH}
          />
        </ShowcaseSection>

        <ShowcaseSection
          title={p("list.title")}
          description={p("list.description")}
          layout="stack"
        >
          <List
            data={flatOptions}
            value={listValue}
            onChange={(item) => setListValue(item.value as string | number)}
            className="max-h-48 overflow-hidden rounded-lg border border-border"
            virtualized
          />
        </ShowcaseSection>
      </DeferredMount>

      <ShowcaseSection title={p("propsTextInput.title")} layout="stack">
        <PropsPre>
          {`id?, label?, labelClassName?, status?, message?, prefix?, showMessage?
onChange?(string), isLoading?, required?, helperText?, wrapperClassName?
size?: "sm" | "md" | "lg", width?, className?, style?, disabled?, readOnly?
placeholder?, type?, maxLength?, value?, name?, autoComplete?, …HTML input attrs`}
        </PropsPre>
      </ShowcaseSection>

      <ShowcaseSection title={p("propsSelect.title")} layout="stack">
        <PropsPre>
          {`options?, filter?, loading?, disabled?, label?, message?, status?
width?, height?, contentWidth?, count?, searchInputPlaceholder?, onSearch?
onClear?, open?, onOpenChange?, virtualized?, unClearable?, itemTemplate?
onReachBottom?, fitContent?, fixedContent?, scrollable?, maxHeight?
className?: LabelContainerClassName (trigger, wrapper, dropdown, …)`}
        </PropsPre>
      </ShowcaseSection>

      <ShowcaseSection title={p("propsDateInput.title")} layout="stack">
        <PropsPre>
          {`label?, value?: number[], onChange?(number[]), disabled?, withTime?
withPreset?, autoClose?, withoutClear?, oneLineLabel?, range?, multiple?
forceLabel?, className?, status?, message?, labelContainerProps?, width?
icon?, presets?, placeholder?, required?, error?, id?, currentDate?
limitedRange?, minDate?, maxDate?`}
        </PropsPre>
      </ShowcaseSection>

      <ShowcaseSection title={p("propsCheckbox.title")} layout="stack">
        <PropsPre>
          {`Checkbox.Basic: checked?, halfChecked?, onChange?, disabled?, loading?
id?, name?, value?, label?, description?, boxed?, width?, minWidth?, …

Checkbox.Labeled: + labelPosition?: "left" | "right", labelClassName?, containerClassName?

Checkbox.Card: title?, subTitle?, titleTemplate?, className?: { container, icon, … }

Switch: severity?, size?, active?, id?, onChange?

SwitchField: + label?, value?, status?, message?, width?, withContainer?, labelContainerProps?

OTPInput: length?, value?, onChange?, allowPaste?, pasteDurationMs?, disabled?, required?, label?, status?, message?
size?: "sm" | "md" | "lg", width?: number | string, className?: { container?, cells?, input?, label?, message? }
autoFocus?, allowPaste?, numericOnly?, isLoading?

RadioInput: options?, defaultValue?, value?, onChange?, direction?, size?, showCircle?, width?, id?`}
        </PropsPre>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
