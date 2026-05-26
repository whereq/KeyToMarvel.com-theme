import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export type CbAlertType = "error" | "success" | "warning" | "info";

export interface CbAlertProps {
    type: CbAlertType;
    children: ReactNode;
    className?: string;
}

const config: Record<
    CbAlertType,
    { icon: ReactNode; bg: string; border: string; text: string }
> = {
    error: {
        icon: <FiAlertCircle size={16} />,
        bg: "bg-[var(--cb-error-bg)]",
        border: "border-l-3 border-[var(--cb-error)]",
        text: "text-[var(--cb-error)]",
    },
    success: {
        icon: <FiCheckCircle size={16} />,
        bg: "bg-[var(--cb-success-bg)]",
        border: "border-l-3 border-[var(--cb-success)]",
        text: "text-[var(--cb-success)]",
    },
    warning: {
        icon: <FiAlertTriangle size={16} />,
        bg: "bg-[var(--cb-warning-bg)]",
        border: "border-l-3 border-[var(--cb-warning)]",
        text: "text-[var(--cb-warning)]",
    },
    info: {
        icon: <FiInfo size={16} />,
        bg: "bg-[var(--cb-info-bg)]",
        border: "border-l-3 border-[var(--cb-info)]",
        text: "text-[var(--cb-info)]",
    },
};

export function CbAlert({ type, children, className = "" }: CbAlertProps) {
    const { icon, bg, border, text } = config[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={[
                "flex items-start gap-2.5 px-4 py-3 text-sm",
                bg,
                border,
                "rounded-[var(--cb-radius-sm)]",
                className,
            ].join(" ")}
        >
            <span className={["shrink-0 mt-0.5", text].join(" ")}>{icon}</span>
            <span className="text-[var(--cb-text-primary)] leading-relaxed">{children}</span>
        </div>
    );
}
