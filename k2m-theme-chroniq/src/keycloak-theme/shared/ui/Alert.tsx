import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export type CqAlertType = "error" | "success" | "warning" | "info";

export interface CqAlertProps {
    type: CqAlertType;
    children: ReactNode;
    className?: string;
}

const config: Record<
    CqAlertType,
    { icon: ReactNode; bg: string; border: string; text: string }
> = {
    error: {
        icon: <FiAlertCircle size={16} />,
        bg: "bg-[var(--cq-error-bg)]",
        border: "border-l-2 border-[var(--cq-error)]",
        text: "text-[var(--cq-error)]",
    },
    success: {
        icon: <FiCheckCircle size={16} />,
        bg: "bg-[var(--cq-success-bg)]",
        border: "border-l-2 border-[var(--cq-success)]",
        text: "text-[var(--cq-success)]",
    },
    warning: {
        icon: <FiAlertTriangle size={16} />,
        bg: "bg-[var(--cq-warning-bg)]",
        border: "border-l-2 border-[var(--cq-warning)]",
        text: "text-[var(--cq-warning)]",
    },
    info: {
        icon: <FiInfo size={16} />,
        bg: "bg-[var(--cq-info-bg)]",
        border: "border-l-2 border-[var(--cq-info)]",
        text: "text-[var(--cq-info)]",
    },
};

/**
 * CqAlert — Metro-style status message block with strong left border.
 */
export function CqAlert({ type, children, className = "" }: CqAlertProps) {
    const { icon, bg, border, text } = config[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={[
                "flex items-start gap-2.5 px-4 py-3 text-sm",
                bg,
                border,
                "rounded-[var(--cq-r-sm)]",
                className,
            ].join(" ")}
        >
            <span className={["shrink-0 mt-0.5", text].join(" ")}>{icon}</span>
            <span className="text-[var(--cq-text)] leading-relaxed">{children}</span>
        </div>
    );
}
