import { labelContainerVariants } from "@/components/common/inputs/label/labelContainer";
import { labelVariants } from "@/components/common/inputs/label/labelContainer";
import { SelectBoxFilterProps } from "@/components/common/inputs/select/comps/filter";
import { DivProps } from "@/lib/types";
import { PopoverContentProps, PopoverProps } from "@radix-ui/react-popover";
import { VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

/**
 * Base type for select items that defines the structure of individual options in select components
 * @property {string} [label] - Display label for the select item
 * @property {string | number} value - Unique value identifier for the select item
 * @property {string} [className] - Optional CSS class name for custom styling
 * @property {React.ReactNode} [icon] - Optional icon component to display alongside the item
 * @property {unknown} [templateValue] - Optional template value for custom rendering
 * @property {string} [title] - Optional tooltip text
 * @property {boolean} [disabled] - Whether the item is disabled
 * @property {(value: SelectItem['value']) => void} [onChange] - Callback function when the item's value changes
 */
export type SelectItem = {
  readonly label?: string;
  readonly description?: string;
  readonly value: any;
  readonly id?: string | number;
  readonly className?: string;
  readonly icon?: React.ReactNode;
  readonly templateValue?: unknown;
  readonly title?: string;
  readonly disabled?: boolean;
  readonly onChange?: (value: SelectItem["value"]) => void;
};

/**
 * Type for hierarchical select items that can have nested children
 * Extends SelectItem to support tree-like structures
 * @property {TreeSelectItem[]} [children] - Array of nested child items
 */
export type TreeSelectItem = SelectItem & {
  readonly children?: TreeSelectItem[];
};

/**
 * Type for flattened tree select items that maintain parent references
 * Useful for representing hierarchical data in a flat structure
 * @property {string | number} [parentId] - Reference to the parent item's ID
 */
export type FlatTreeSelectItem = SelectItem & {
  readonly parentId?: string | number;
};

/**
 * Event type for table header changes in select components
 * @property {SelectItem['value'][]} [selected] - Array of selected values from the select component
 * @property {SelectItem[]} [data] - Array of data items associated with the selection
 */
export type TableHeaderChangeEvent = {
  readonly selected?: SelectItem["value"][];
  readonly data?: SelectItem[];
};

/**
 * Props for the LabelContainer component
 * Extends DivProps and includes variant props for styling
 * @property {boolean} hasValue - Whether the component has a value
 * @property {boolean} [focused] - Focused state
 * @property {boolean} [showMessage] - Whether to show message
 * @property {string} [label] - Label text
 * @property {React.ReactNode | string} [message] - Message to display
 * @property {Object} [className] - Custom class names for different parts
 */
export interface LabelContainerProps
  extends
    Pick<DivProps, "onClick" | "children">,
    VariantProps<typeof labelContainerVariants>,
    VariantProps<typeof labelVariants> {
  hasValue: boolean;
  focused?: boolean;
  showMessage?: boolean;
  label?: string;
  message?: React.ReactNode | string;
  className?: LabelContainerClassName;
  width?: number | string;
  loading?: boolean;
  id?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  helperText?: string;
  required?: boolean;
}

export type SelectTriggerTemplateProps = Pick<
  LabelContainerProps,
  "message" | "status" | "label" | "className" | "loading"
> &
  Pick<PopoverProps, "open" | "onOpenChange"> & {
    count?: number;
    showChips?: boolean;
    chips?: SelectItem[];
    labelType?: "label" | "count" | "simple";
    Icon?: ReactNode;
    iconClassName?: string;
    chipsCountLimit?: number;
    /** Max chip rows before overflow; remaining count shown as +N badge. */
    chipRowsCount?: number;
    value?: string;
    labelTemplate?: React.ReactNode;
    onRemove?: (option: SelectItem) => void;
    onClear?: () => void;
    labelElement?: (value: any) => ReactNode;
    withSelectAll?: boolean;
    selectAllLabel?: string;
  };

/**
 * Comprehensive class names configuration for customizing the Select component's appearance.
 * This type provides granular control over styling different parts of the select component.
 * Used across all select variants (SingleSelect, MultiSelect, MultiSelectTree, MultiSelectDND).
 */
export type LabelContainerClassName = {
  /** Styles for the outermost wrapper that contains the entire select component */
  wrapper?: {
    /** Container for the wrapper */
    container?: string;
    /** Body container for the wrapper */
    body?: string;
    /** Label text styling */
    label?: string;
    /** Message text styling */
    message?: string;
    /** Prefix slot styling */
    prefix?: string;
    /** Suffix slot styling */
    suffix?: string;
    /** Helper text styling */
    helperText?: string;
    /** Inner styling */
    inner?: string;
  };

  /** Styles for the trigger button and its sub-components */
  trigger?: {
    /** Container for the trigger button */
    container?: string;
    /** Label text styling */
    label?: string;
    /** Value text styling */
    value?: string;
    /** Count text styling */
    count?: string;
    /** Chips list styling */
    chips?: {
      /** Chip item styling */
      item?: string;
      /** Badge styling */
      badge?: string;
    };
  };
  /** Styles for dropdown-related elements */
  dropdown?: {
    /** Wrapper container for the entire panel */
    container?: string;
    /** Dropdown anchor point styling */
    anchor?: string;
    /** Header section of the panel */
    header?: string;
    /** Search input related styles */
    search?: {
      /** Container for the search input */
      wrapper?: string;
      /** Search input field styling */
      input?: string;
      /** Clear search button styling */
      clear?: string;
    };
    /** Styles for the dropdown content container */
    body?: string;
    /** Styles for selectable items */
    item?: string;
    /** Styles for footer section */
    footer?: string;
  };
};

/**
 * Common props shared across all select components
 */
export type BaseSelectProps = {
  status?: string;
  label?: string;
  message?: React.ReactNode | string;
  count?: number;
  filter?: boolean;
  loading?: boolean;
  fitContent?: boolean;
  disabled?: boolean;
  fixedContent?: boolean;
  searchInputPlaceholder?: string;
  width?: number | string;
  height?: number | string;
  contentWidth?: number | string;
  children?: React.ReactNode;
  headerTemplate?: React.ReactNode;
  className?: LabelContainerClassName;
  scrollable?: boolean;
  /** Enables Motion layoutScroll on the dropdown list (use with reorderable lists). */
  layoutScroll?: boolean;
  maxHeight?: number | string;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  open?: boolean;
};

/**
 * Props for the SelectContainer component
 * Combines properties from LabelContainer, TriggerTemplate, and HeaderTemplate
 */
export type SelectContainerProps = Pick<
  Partial<LabelContainerProps>,
  "status" | "message"
> &
  Omit<SelectTriggerTemplateProps, "className"> &
  Omit<SelectBoxFilterProps, "onSearch" | "className"> &
  Pick<PopoverContentProps, "align" | "forceMount"> &
  BaseSelectProps & {
    value?: string;
    onOpenChange?: (open: boolean) => void;
  };

/**
 * Common props for select components with options
 */
export type SelectOptionsProps = {
  options?: SelectItem[];
  onReachBottom?: () => void;
  itemTemplate?: (option: SelectItem) => React.ReactNode;
  unClearable?: boolean;
};

/**
 * Props for the SingleSelect component.
 * Extends SelectContainerProps with single selection specific properties.
 *
 * @example
 * ```tsx
 * <SingleSelect
 *   className={{
 *     option: "custom-option",
 *     content: "custom-content",
 *     footer: "custom-footer"
 *   }}
 * />
 * ```
 */
export type SingleSelectProps = Omit<
  Partial<SelectContainerProps>,
  | "value"
  | "onChange"
  | "onOpenChange"
  | "headerTemplate"
  | "onSearch"
  | "searchInputPlaceholder"
> &
  SelectOptionsProps & {
    value?: string | number;
    defaultValueTitle?: string;
    onChange?: (value?: string | number) => void;
    virtualized?: boolean;
    noValueChange?: boolean;
    className?: LabelContainerClassName;
    id?: string;
  };

/**
 * Common props for multi-select components
 */
export type MultiSelectBaseProps = SelectOptionsProps & {
  selected?: (string | number)[];
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
};

/**
 * Props for the MultiSelect component.
 * Extends SelectContainerProps with multiple selection functionality.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   className={{
 *     panelBody: "custom-panel",
 *     item: "custom-item"
 *   }}
 * />
 * ```
 */
export type MultiSelectProps = Omit<
  Partial<SelectContainerProps>,
  "value" | "onChange" | "onOpenChange"
> &
  MultiSelectBaseProps & {
    className?: LabelContainerClassName;
    virtualized?: boolean;
  };

/**
 * Props for the MultiSelectTree component.
 * Extends SelectContainerProps with tree selection functionality.
 *
 * @example
 * ```tsx
 * <MultiSelectTree
 *   className={{
 *     panelBody: "custom-tree-panel"
 *   }}
 * />
 * ```
 */
export type MultiSelectTreeProps = Omit<
  Partial<SelectContainerProps>,
  | "value"
  | "onChange"
  | "onOpenChange"
  | "headerTemplate"
  | "onSearch"
  | "searchInputPlaceholder"
> &
  Omit<MultiSelectBaseProps, "options"> & {
    options?: TreeSelectItem[];
    className?: LabelContainerClassName;
    openedAll?: boolean;
    openedFirstLevel?: boolean;
  };

/**
 * Props for the SingleSelectTree component.
 * Extends SelectContainerProps with single selection tree functionality.
 *
 * @example
 * ```tsx
 * <SingleSelectTree
 *   className={{
 *     panelBody: "custom-tree-panel"
 *   }}
 * />
 * ```
 */
export type SingleSelectTreeProps = Omit<
  Partial<SelectContainerProps>,
  | "value"
  | "onChange"
  | "onOpenChange"
  | "headerTemplate"
  | "onSearch"
  | "searchInputPlaceholder"
> &
  SelectOptionsProps & {
    value?: string | number;
    onChange?: (value?: string | number) => void;
    options?: TreeSelectItem[];
    className?: LabelContainerClassName;
    openedAll?: boolean;
  };

/**
 * Props for the MultiSelectDND component.
 * Extends SelectContainerProps with drag-and-drop functionality.
 *
 * @example
 * ```tsx
 * <MultiSelectDND
 *   className={{
 *     panelBody: "custom-dnd-panel",
 *     item: "custom-dnd-item"
 *   }}
 * />
 * ```
 */
export type MultiSelectDNDProps = Omit<
  Partial<SelectContainerProps>,
  | "value"
  | "onChange"
  | "onOpenChange"
  | "headerTemplate"
  | "onSearch"
  | "searchInputPlaceholder"
  | "filter"
  | "selected"
> &
  SelectOptionsProps & {
    selected?: SelectItem["value"][];
    value?: SelectItem["value"][];
    onChange?: (params: TableHeaderChangeEvent) => void;
    onRefresh?: () => void;
    /** @deprecated Use `showChips` instead */
    whitChips?: boolean;
    chipRowsCount?: number;
    heading?: string;
    subHeading?: string;
    reorder?: boolean;
    setReorder?: React.Dispatch<React.SetStateAction<boolean>>;
    className?: LabelContainerClassName;
  };
