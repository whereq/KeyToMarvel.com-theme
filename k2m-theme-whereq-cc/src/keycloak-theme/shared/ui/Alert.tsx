import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export type FdAlertType = "error" | "success" | "warning" | "info";

export interface FdAlertProps {
    type: FdAlertType;
    children: ReactNode;
    className?: string;
}

const config: Record<
    FdAlertType,
    { icon: ReactNode; bg: string; border: string; text: string }
> = {
    error: {
        icon: <FiAlertCircle size={16} />,
        bg: "bg-[var(--fd-error-bg)]",
        border: "border-l-2 border-[var(--fd-error)]",
        text: "text-[var(--fd-error)]",
    },
    success: {
        icon: <FiCheckCircle size={16} />,
        bg: "bg-[var(--fd-success-bg)]",
        border: "border-l-2 border-[var(--fd-success)]",
        text: "text-[var(--fd-success)]",
    },
    warning: {
        icon: <FiAlertTriangle size={16} />,
        bg: "bg-[var(--fd-warning-bg)]",
        border: "border-l-2 border-[var(--fd-warning)]",
        text: "text-[var(--fd-warning)]",
    },
    info: {
        icon: <FiInfo size={16} />,
        bg: "bg-[var(--fd-info-bg)]",
        border: "border-l-2 border-[var(--fd-info)]",
        text: "text-[var(--fd-info)]",
    },
};

/**
 * FdAlert — Metro-style status message block with strong left border.
 */
export function FdAlert({ type, children, className = "" }: FdAlertProps) {
    const { icon, bg, border, text } = config[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={[
                "flex items-start gap-2.5 px-4 py-3 text-sm",
                bg,
                border,
                "rounded-[var(--fd-radius-sm)]",
                className,
            ].join(" ")}
        >
            <span className={["shrink-0 mt-0.5", text].join(" ")}>{icon}</span>
            <span className="text-[var(--fd-text-primary)] leading-relaxed">{children}</span>
        </div>
    );
}
