/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/select-control/SingleSelectControl.tsx" --revert
 */


import { RxTriangleDown } from "react-icons/rx";
import { get } from "lodash-es";
import { useState } from "react";
import { Controller, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { getRuleValue } from "../../utils/getRuleValue";
import { FormLabel } from "../FormLabel";
import { SelectControlProps, isSelectBasedOptions, isString, key } from "./types";

export const SingleSelectControl = <
  T extends FieldValues,
  P extends FieldPath<T> = FieldPath<T>,
>({
  id,
  name,
  label,
  options,
  controller,
  labelIcon,
  className = "",
  ...rest
}: SelectControlProps<T, P>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const required = getRuleValue(controller.rules?.required) === true;

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

      {/* Dropdown */}
      <Controller
        {...controller}
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="flex-1 relative" {...rest}> {/* Takes remaining space */}
            <button
              type="button"
              id={id || name.slice(name.lastIndexOf(".") + 1)}
              className="w-full p-2 bg-gray-700 text-orange-300 
                         focus:outline-none focus:ring-2 focus:ring-orange-400 
                         flex items-center justify-between"
              onClick={() => setOpen(!open)}
            >
              <span>
                {isSelectBasedOptions(options)
                  ? options.find(
                      (o) => o.key === (Array.isArray(value) ? value[0] : value),
                    )?.value
                  : value}
              </span>
              <RxTriangleDown className="ml-2" /> {/* Already replaced aria-label */}
            </button>
            {open && (
              <div className="absolute z-10 mt-1 w-full bg-gray-900">
                {options.map((option) => (
                  <div
                    key={key(option)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      const optionKey = key(option);
                      onChange(Array.isArray(value) ? [optionKey] : optionKey);
                      setOpen(false);
                    }}
                  >
                    {isString(option) ? option : option.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};