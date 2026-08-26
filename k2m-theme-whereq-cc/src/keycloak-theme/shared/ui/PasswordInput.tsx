import { useState, forwardRef, type InputHTMLAttributes } from "react";

export interface FdPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    hasError?: boolean;
}

const EYE = (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const EYE_OFF = (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-2.16 3.19M6.6 6.6A13.3 13.3 0 0 0 2 11s3.5 7 10 7a9 9 0 0 0 4.4-1.1"/>
        <path d="m2 2 20 20"/>
    </svg>
);

export const FdPasswordInput = forwardRef<HTMLInputElement, FdPasswordInputProps>(
    function FdPasswordInput({ hasError = false, id, style, ...rest }, ref) {
        const [revealed, setRevealed] = useState(false);

        return (
            <div style={{ position: "relative", width: "100%" }}>
                <input
                    ref={ref}
                    id={id}
                    type={revealed ? "text" : "password"}
                    style={{
                        width: "100%",
                        height: 46,
                        padding: "0 44px 0 14px",
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
                <button
                    type="button"
                    tabIndex={-1}
                    aria-label={revealed ? "Hide password" : "Show password"}
                    aria-controls={id}
                    onClick={() => setRevealed(v => !v)}
                    style={{
                        all: "unset",
                        position: "absolute",
                        right: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 32,
                        height: 32,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-faint)",
                        borderRadius: 5,
                        cursor: "pointer",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-faint)"; }}
                >
                    {revealed ? EYE_OFF : EYE}
                </button>
            </div>
        );
    },
);
