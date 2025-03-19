/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260007.0.5.
 * To relinquish ownership and restore this file to its original content, run the following command:
 * 
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/continue-cancel/ContinueCancelModal.tsx" --revert
 */

import { ReactNode, useState } from "react";

export type ContinueCancelModalProps = {
  modalTitle: string;
  continueLabel: string;
  cancelLabel: string;
  buttonTitle: string | ReactNode;
  buttonVariant?: "primary" | "secondary" | "danger";
  buttonTestRole?: string;
  isDisabled?: boolean;
  onContinue: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ElementType<any> | React.ComponentType<any>;
  children?: ReactNode;
  className?: string; // Added className for customization
};

export const ContinueCancelModal = ({
  modalTitle,
  continueLabel,
  cancelLabel,
  buttonTitle,
  isDisabled,
  buttonVariant = "primary",
  buttonTestRole,
  onContinue,
  component: Component = "button",
  children,
  className,
}: ContinueCancelModalProps) => {
  const [open, setOpen] = useState(false);

  // Determine button styles based on variant
  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case "primary":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-blue-500 text-white hover:bg-blue-600";
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Component
        className={`${getButtonStyles(buttonVariant)} px-4 py-2 rounded ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
        onClick={() => setOpen(true)}
        disabled={isDisabled}
        data-testrole={buttonTestRole}
      >
        {buttonTitle}
      </Component>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg w-11/12 max-w-md p-6">
            {/* Modal Title */}
            <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>

            {/* Modal Content */}
            <div className="mb-6">{children}</div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setOpen(false)}
              >
                {cancelLabel}
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  setOpen(false);
                  onContinue();
                }}
              >
                {continueLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};