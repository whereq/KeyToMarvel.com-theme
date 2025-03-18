import { ControllerProps, FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

export enum SelectVariant {
  single = "single",
  typeahead = "typeahead",
  typeaheadMulti = "typeaheadMulti",
}

type Variant = `${SelectVariant}`;

export type SelectControlOption = {
  key: string;
  value: string;
};

export type OptionType = string[] | SelectControlOption[];
// export type OptionType = (string | string[] | SelectControlOption)[];

export type SelectControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "name" | "onSelect" | "onClear" | "onFilter"
> &
  UseControllerProps<T, P> & {
    name: string;
    label?: string;
    options: OptionType;
    labelIcon?: string;
    controller: Omit<ControllerProps, "name" | "render">;
    onFilter?: (value: string) => void;
    variant?: Variant;
    isDisabled?: boolean;
    menuAppendTo?: string;
    placeholderText?: string;
    chipGroupProps?: React.HTMLAttributes<HTMLDivElement>;
    className?: string;
  };


export const isSelectBasedOptions = (
    options: OptionType,
): options is SelectControlOption[] => typeof options[0] !== "string";

export const isString = (
    option: SelectControlOption | string,
): option is string => typeof option === "string";

export const key = (option: SelectControlOption | string) =>
    isString(option) ? option : option.key;
