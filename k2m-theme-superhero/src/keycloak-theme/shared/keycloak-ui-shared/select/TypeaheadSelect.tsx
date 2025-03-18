/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/select/TypeaheadSelect.tsx" --revert
 */

import { TimesIcon } from "../../@patternfly/react-icons";
import { Children, useRef, useState } from "react";
import { SelectVariant } from "../main";
import { KeycloakSelectProps } from "./KeycloakSelect";
import { propertyToString } from "./types";


type TypeaheadSelectProps = KeycloakSelectProps & {
  children?: React.ReactNode; // Added missing prop
};


export const TypeaheadSelect = ({
  toggleId,
  onSelect,
  onToggle,
  onFilter,
  variant,
  validated,
  placeholderText,
  maxHeight,
  width,
  toggleIcon,
  direction,
  selections,
  typeAheadAriaLabel,
  chipGroupComponent,
  chipGroupProps = {},
  footer,
  isDisabled,
  className = "",
  children,
  isOpen, // Added missing prop
  ...rest
}: TypeaheadSelectProps & { isOpen?: boolean }) => {
  const [filterValue, setFilterValue] = useState("");
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const textInputRef = useRef<HTMLInputElement>(null);

  const childArray = Children.toArray(children) as React.ReactElement<{
    value: string;
    children: React.ReactNode;
  }>[];

  const toggle = () => {
    onToggle?.(!isOpen);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const focusedItem = childArray[focusedItemIndex];
    onToggle?.(true);

    switch (event.key) {
      case "Enter": {
        event.preventDefault();
        if (variant !== SelectVariant.typeaheadMulti) {
          setFilterValue(focusedItem.props.value);
        } else {
          setFilterValue("");
        }
        onSelect?.(focusedItem.props.value);
        onToggle?.(false);
        setFocusedItemIndex(0);
        break;
      }
      case "Escape": {
        onToggle?.(false);
        break;
      }
      case "Backspace": {
        if (variant === SelectVariant.typeahead) {
          onSelect?.("");
        }
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        event.preventDefault();
        let indexToFocus = 0;
        if (event.key === "ArrowUp") {
          indexToFocus =
            focusedItemIndex === 0 ? childArray.length - 1 : focusedItemIndex - 1;
        }
        if (event.key === "ArrowDown") {
          indexToFocus =
            focusedItemIndex === childArray.length - 1 ? 0 : focusedItemIndex + 1;
        }
        setFocusedItemIndex(indexToFocus);
        break;
      }
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        maxHeight: propertyToString(maxHeight),
        width: propertyToString(width),
      }}
      {...rest}
      onClick={toggle}
    >
      <div className="flex items-center w-full">
        <input
          id={toggleId}
          type="text"
          placeholder={placeholderText}
          value={
            variant === SelectVariant.typeahead && selections
              ? (selections as string)
              : filterValue
          }
          onClick={toggle}
          onChange={(e) => {
            setFilterValue(e.target.value);
            onFilter?.(e.target.value);
          }}
          onKeyDown={onInputKeyDown}
          autoComplete="off"
          role="combobox"
          aria-controls="select-typeahead-listbox"
          aria-label={typeAheadAriaLabel}
          disabled={isDisabled}
          className={`w-full px-3 py-2 text-gray-700 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-200 disabled:cursor-not-allowed ${
            validated === "error" ? "ring-2 ring-red-500" : ""
          }`}
        />
        {!!filterValue && (
          <button
            type="button"
            onClick={() => {
              onSelect?.("");
              setFilterValue("");
              onFilter?.("");
              textInputRef.current?.focus();
            }}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700"
            aria-label="Clear input value"
          >
            <TimesIcon aria-hidden />
          </button>
        )}
        {toggleIcon && <span className="ml-2">{toggleIcon}</span>}
      </div>
      {variant === SelectVariant.typeaheadMulti && Array.isArray(selections) && (
        <div className="flex flex-wrap gap-2 mt-2" {...chipGroupProps}>
          {chipGroupComponent ? (
            chipGroupComponent
          ) : (
            selections.map((selection, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                onClick={(ev) => {
                  ev.stopPropagation();
                  onSelect?.(selection);
                }}
              >
                {selection}
                <button
                  type="button"
                  className="ml-1 text-orange-600 hover:text-orange-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(selection);
                  }}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      )}
      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-y-auto"
          style={{
            maxHeight: propertyToString(maxHeight),
            ...(direction === "up" && { bottom: "100%", top: "auto" }),
          }}
        >
          {childArray.map((child) => (
            <div
              key={child.props.value}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => onSelect?.(child.props.value || "")}
            >
              {child.props.children}
            </div>
          ))}
          {footer && <div className="p-2 border-t">{footer}</div>}
        </div>
      )}
    </div>
  );
};