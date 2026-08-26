import { forwardRef, type InputHTMLAttributes } from "react";

export interface FdInputProps extends InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export const FdInput = forwardRef<HTMLInputElement, FdInputProps>(function FdInput(
    { hasError = false, style, ...rest },
    ref,
) {
    return (
        <input
            ref={ref}
            style={{
                width: "100%",
                height: 46,
                padding: "0 14px",
                background: "var(--field)",
                border: `1px solid ${hasError ? "var(--down)" : "var(--rule-strong)"}`,
                borderRadius: 6,
                color: "var(--text)",
                fontSize: 14,
                fontFamily: "var(--ui)",
                outline: "none",
                transition: "border-color .15s, box-shadow .15s",
                boxSizing: "border-box",
                ...style,
            }}
            onFocus={e => {
                e.currentTarget.style.borderColor = hasError ? "var(--down)" : "var(--accent)";
                e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${hasError ? "var(--down)" : "var(--accent)"} 18%, transparent)`;
            }}
            onBlur={e => {
                e.currentTarget.style.borderColor = hasError ? "var(--down)" : "var(--rule-strong)";
                e.currentTarget.style.boxShadow = "";
            }}
            {...rest}
        />
    );
});
