/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/select/SingleSelect.tsx" --revert
 */

import { Children, useRef, useState } from "react";
import { RxTriangleDown } from "react-icons/rx"; // Import RxTriangleDown
import { propertyToString } from "./types";
import { KeycloakSelectProps } from "./KeycloakSelect";

type SingleSelectProps = Omit<KeycloakSelectProps, "variant"> & {
  isOpen?: boolean; // Added missing prop
  children?: React.ReactNode; // Added missing prop
  className?: string; // Added for customization
  "aria-label"?: string; // Added missing prop
};

export const SingleSelect = ({
  toggleId,
  onToggle,
  onSelect,
  selections,
  isOpen,
  menuAppendTo, // Marked as unused but kept for backward compatibility
  direction,
  width,
  maxHeight,
  toggleIcon,
  className = "",
  isDisabled,
  children,
  "aria-label": ariaLabel, // Destructure aria-label
  ...props
}: SingleSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null); // Fixed ref type

  const toggle = () => {
    setOpen(!open);
    onToggle(!open);
  };

  const childArray = Children.toArray(children) as React.ReactElement<{
    value: string;
    children: React.ReactNode;
  }>[];

  console.log(menuAppendTo); // Marked as unused but kept for backward compatibility
  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        maxHeight: propertyToString(maxHeight),
        width: propertyToString(width),
      }}
      {...props}
      onClick={toggle}
    >
      <button
        id={toggleId}
        type="button"
        className={`w-full px-3 py-2 text-orange-300 
                  bg-gray-700 border-none flex items-center justify-between 
                  focus:outline-none focus:ring-2 focus:ring-orange-400 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={toggle}
        aria-label={ariaLabel} // Use destructured ariaLabel
        disabled={isDisabled}
      >
        <span>
          {childArray.find((c) => c.props.value === selections)?.props
            .children ||
            selections ||
            ariaLabel}
        </span>
        {toggleIcon || <RxTriangleDown className="ml-2" />} {/* Replace ▼ with RxTriangleDown */}
      </button>
      {(isOpen || open) && (
        <div
          className="absolute z-10 w-full bg-gray-900 overflow-y-auto"
          style={{
            maxHeight: propertyToString(maxHeight),
            ...(direction === "up" && { bottom: "100%", top: "auto" }),
          }}
        >
          {childArray.map((child) => (
            <div
              key={child.props.value}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onSelect?.(child.props.value || "");
                toggle();
              }}
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};