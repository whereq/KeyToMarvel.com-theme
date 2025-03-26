import React from "react";
import { K2MButtonStyle } from "../types/k2m-types";


type K2MButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    styleType?: K2MButtonStyle;
    className?: string;
};

export const K2MButton = React.forwardRef<HTMLButtonElement, K2MButtonProps>(
    ({ styleType, className, children, ...props }, ref) => {
        
        const baseClasses = "px-4 py-2 rounded-sm focus:outline-none transition-colors";
        
        const styleClasses = {
            primary: "bg-orange-400 text-gray-100 font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed",
            secondary: "bg-gray-600 text-gray-100 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
            default: "bg-blue-600 text-orange-400 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        };

        const finalClassName = className 
            ? `${baseClasses} ${styleClasses[styleType || "default"]} ${className}`
            : `${baseClasses} ${styleClasses[styleType || "default"]}`;

        return (
            <button
                ref={ref}
                className={finalClassName}
                {...props}
            >
                {children}
            </button>
        );
    }
);

K2MButton.displayName = "Button";