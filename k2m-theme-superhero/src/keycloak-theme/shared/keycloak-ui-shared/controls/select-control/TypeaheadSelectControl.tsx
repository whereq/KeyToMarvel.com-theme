/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/TypeaheadSelectControl.tsx" --revert
 */

import { TimesIcon } from "../../../@patternfly/react-icons";
import { get } from "lodash-es";
import { useRef, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { getRuleValue } from "../../utils/getRuleValue";
import { FormLabel } from "../FormLabel";
import {
  SelectControlOption,
  SelectControlProps,
  SelectVariant,
  isSelectBasedOptions,
  isString,
  key,
} from "./types";

const getValue = (option: SelectControlOption | string) =>
  isString(option) ? option : option.value;

// Adjusted createConvertItems to handle filteredOptions correctly
const createConvertItems = (
  filteredOptions: (string | SelectControlOption)[],
  focusedItemIndex: number,
  variant: `${SelectVariant}` | undefined,
  fieldValue: string | string[],
  fieldOnChange: (value: string | string[]) => void,
) =>
  filteredOptions.map((option, index) => (
    <li
      key={key(option)}
      className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${
        focusedItemIndex === index ? "bg-gray-100" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        const optionValue = key(option);
        if (variant === SelectVariant.typeaheadMulti) {
          if (Array.isArray(fieldValue)) {
            if (fieldValue.includes(optionValue)) {
              fieldOnChange(
                fieldValue.filter((item: string) => item !== optionValue),
              );
            } else {
              fieldOnChange([...fieldValue, optionValue]);
            }
          } else {
            fieldOnChange([optionValue]);
          }
        } else {
          fieldOnChange(optionValue);
        }
      }}
    >
      {getValue(option)}
    </li>
  ));

export type TypeaheadSelectControlProps<
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
> = SelectControlProps<T, P> & {
  className?: string;
};

export const TypeaheadSelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  id,
  name,
  label,
  options,
  controller,
  labelIcon,
  placeholderText = "Type to search",
  onFilter,
  variant,
  className = "",
  ...rest
}: TypeaheadSelectControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const textInputRef = useRef<HTMLInputElement>(null);
  const required = getRuleValue(controller.rules?.required) === true;

  const filteredOptions = options.filter((option) =>
    getValue(option).toLowerCase().startsWith(filterValue.toLowerCase()),
  );

  const onInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    const focusedItem = filteredOptions[focusedItemIndex];
    setOpen(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        if (variant !== SelectVariant.typeaheadMulti) {
          setFilterValue(getValue(focusedItem));
        } else {
          setFilterValue("");
        }
        field.onChange(
          Array.isArray(field.value)
            ? [...field.value, key(focusedItem)]
            : key(focusedItem),
        );
        setOpen(false);
        setFocusedItemIndex(0);
        break;
      }
      case "Tab":
      case "Escape": {
        setOpen(false);
        field.onChange(undefined);
        break;
      }
      case "Backspace": {
        if (variant === SelectVariant.typeahead) {
          field.onChange("");
        }
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        let indexToFocus = 0;
        if (event.key === "ArrowUp") {
          indexToFocus =
            focusedItemIndex === 0 ? options.length - 1 : focusedItemIndex - 1;
        }
        if (event.key === "ArrowDown") {
          indexToFocus =
            focusedItemIndex === options.length - 1 ? 0 : focusedItemIndex + 1;
        }
        setFocusedItemIndex(indexToFocus);
        break;
      }
    }
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-start gap-4 ${className}`}> {/* Responsive layout */}
      {/* Label */}
      <FormLabel
        name={name}
        label={label}
        isRequired={required}
        error={get(errors, name)}
        labelIcon={labelIcon}
        className="block font-bold text-sm text-orange-400 md:w-1/12" // Aligned left, fixed width on md+
      />

      {/* Dropdown/Input */}
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex-1 relative" {...rest}> {/* Takes remaining space */}
            <div className="flex items-center w-full">
              <input
                id={id || name.slice(name.lastIndexOf(".") + 1)}
                data-testid={id || name}
                type="text"
                placeholder={placeholderText}
                value={
                  variant === SelectVariant.typeahead && field.value
                    ? isSelectBasedOptions(options)
                      ? options.find(
                          (o) =>
                            o.key ===
                            (Array.isArray(field.value)
                              ? field.value[0]
                              : field.value),
                        )?.value
                      : field.value
                    : filterValue
                }
                onClick={() => setOpen(!open)}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  onFilter?.(e.target.value);
                }}
                onKeyDown={(e) => onInputKeyDown(e, field)}
                autoComplete="off"
                role="combobox"
                aria-controls="select-typeahead-listbox"
                ref={textInputRef}
                className={`w-full px-3 py-2 text-gray-700 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  get(errors, name) ? "ring-2 ring-red-500" : ""
                }`}
              />
              {(filterValue || field.value) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterValue("");
                    field.onChange("");
                    textInputRef.current?.focus();
                  }}
                  className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Clear input value"
                >
                  <TimesIcon aria-hidden />
                </button>
              )}
            </div>
            {variant === SelectVariant.typeaheadMulti &&
              Array.isArray(field.value) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((selection: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {isSelectBasedOptions(options)
                        ? options.find((o) => selection === o.key)?.value
                        : getValue(selection)}
                      <button
                        type="button"
                        className="ml-1 text-orange-600 hover:text-orange-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(
                            field.value.filter(
                              (item: string) => item !== selection,
                            ),
                          );
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            {open && (
              <ul
                id="select-typeahead-listbox"
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {createConvertItems(
                  filteredOptions,
                  focusedItemIndex,
                  variant,
                  field.value,
                  field.onChange,
                )}
              </ul>
            )}
          </div>
        )}
      />
    </div>
  );
};