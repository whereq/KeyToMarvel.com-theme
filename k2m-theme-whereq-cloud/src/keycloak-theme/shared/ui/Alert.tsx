import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export type WqcAlertType = "error" | "success" | "warning" | "info";

export interface WqcAlertProps {
    type: WqcAlertType;
    children: ReactNode;
    className?: string;
}

const config: Record<
    WqcAlertType,
    { icon: ReactNode; bg: string; border: string; text: string }
> = {
    error: {
        icon: <FiAlertCircle size={16} />,
        bg: "bg-[var(--wqc-error-bg)]",
        border: "border-l-2 border-[var(--wqc-error)]",
        text: "text-[var(--wqc-error)]",
    },
    success: {
        icon: <FiCheckCircle size={16} />,
        bg: "bg-[var(--wqc-success-bg)]",
        border: "border-l-2 border-[var(--wqc-success)]",
        text: "text-[var(--wqc-success)]",
    },
    warning: {
        icon: <FiAlertTriangle size={16} />,
        bg: "bg-[var(--wqc-warning-bg)]",
        border: "border-l-2 border-[var(--wqc-warning)]",
        text: "text-[var(--wqc-warning)]",
    },
    info: {
        icon: <FiInfo size={16} />,
        bg: "bg-[var(--wqc-info-bg)]",
        border: "border-l-2 border-[var(--wqc-info)]",
        text: "text-[var(--wqc-info)]",
    },
};

/**
 * WqcAlert — Metro-style status message block with strong left border.
 */
export function WqcAlert({ type, children, className = "" }: WqcAlertProps) {
    const { icon, bg, border, text } = config[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={[
                "flex items-start gap-2.5 px-4 py-3 text-sm",
                bg,
                border,
                "rounded-[var(--wqc-r-sm)]",
                className,
            ].join(" ")}
        >
            <span className={["shrink-0 mt-0.5", text].join(" ")}>{icon}</span>
            <span className="text-[var(--wqc-text)] leading-relaxed">{children}</span>
        </div>
    );
}
