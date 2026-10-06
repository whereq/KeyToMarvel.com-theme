import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export type QhAlertType = "error" | "success" | "warning" | "info";

export interface QhAlertProps {
    type: QhAlertType;
    children: ReactNode;
    className?: string;
}

const config: Record<
    QhAlertType,
    { icon: ReactNode; bg: string; border: string; text: string }
> = {
    error: {
        icon: <FiAlertCircle size={16} />,
        bg: "bg-[var(--qh-error-bg)]",
        border: "border-l-2 border-[var(--qh-error)]",
        text: "text-[var(--qh-error)]",
    },
    success: {
        icon: <FiCheckCircle size={16} />,
        bg: "bg-[var(--qh-success-bg)]",
        border: "border-l-2 border-[var(--qh-success)]",
        text: "text-[var(--qh-success)]",
    },
    warning: {
        icon: <FiAlertTriangle size={16} />,
        bg: "bg-[var(--qh-warning-bg)]",
        border: "border-l-2 border-[var(--qh-warning)]",
        text: "text-[var(--qh-warning)]",
    },
    info: {
        icon: <FiInfo size={16} />,
        bg: "bg-[var(--qh-info-bg)]",
        border: "border-l-2 border-[var(--qh-info)]",
        text: "text-[var(--qh-info)]",
    },
};

/**
 * QhAlert — Metro-style status message block with strong left border.
 */
export function QhAlert({ type, children, className = "" }: QhAlertProps) {
    const { icon, bg, border, text } = config[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={[
                "flex items-start gap-2.5 px-4 py-3 text-sm",
                bg,
                border,
                "rounded-[var(--qh-r-sm)]",
                className,
            ].join(" ")}
        >
            <span className={["shrink-0 mt-0.5", text].join(" ")}>{icon}</span>
            <span className="text-[var(--qh-text)] leading-relaxed">{children}</span>
        </div>
    );
}
