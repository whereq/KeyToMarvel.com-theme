import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

export type VgAlertType = "error" | "success" | "warning" | "info";

export interface VgAlertProps {
    type: VgAlertType;
    children: ReactNode;
    className?: string;
}

const config: Record<
    VgAlertType,
    { icon: ReactNode; bg: string; border: string; text: string }
> = {
    error: {
        icon: <FiAlertCircle size={16} />,
        bg: "bg-[var(--vg-error-bg)]",
        border: "border-l-2 border-[var(--vg-error)]",
        text: "text-[var(--vg-error)]",
    },
    success: {
        icon: <FiCheckCircle size={16} />,
        bg: "bg-[var(--vg-success-bg)]",
        border: "border-l-2 border-[var(--vg-success)]",
        text: "text-[var(--vg-success)]",
    },
    warning: {
        icon: <FiAlertTriangle size={16} />,
        bg: "bg-[var(--vg-warning-bg)]",
        border: "border-l-2 border-[var(--vg-warning)]",
        text: "text-[var(--vg-warning)]",
    },
    info: {
        icon: <FiInfo size={16} />,
        bg: "bg-[var(--vg-info-bg)]",
        border: "border-l-2 border-[var(--vg-info)]",
        text: "text-[var(--vg-info)]",
    },
};

/**
 * VgAlert — MetroUI status message block.
 *
 * Strong left border accent with colored icon — matches Metro's bold visual language.
 */
export function VgAlert({ type, children, className = "" }: VgAlertProps) {
    const { icon, bg, border, text } = config[type];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={[
                "flex items-start gap-2.5 px-4 py-3 text-sm",
                bg,
                border,
                "rounded-[var(--vg-radius-sm)]",
                className,
            ].join(" ")}
        >
            <span className={["shrink-0 mt-0.5", text].join(" ")}>{icon}</span>
            <span className="text-[var(--vg-text-primary)] leading-relaxed">{children}</span>
        </div>
    );
}
