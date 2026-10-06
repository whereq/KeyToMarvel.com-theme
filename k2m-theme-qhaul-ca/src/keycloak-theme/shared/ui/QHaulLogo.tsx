import wordmarkDarkUrl from "@keycloak-theme/shared/assets/qhaul-wordmark-dark.png";
import markUrl from "@keycloak-theme/shared/assets/qhaul-mark.png";

/**
 * QHaulWordmark — the "QHaul" logotype, light-colored for use on the navy brand panel.
 */
export function QHaulWordmark({ height = 30 }: { height?: number }) {
    return (
        <img
            src={wordmarkDarkUrl}
            alt="QHaul"
            style={{ height, width: "auto", display: "block", alignSelf: "flex-start", flexShrink: 0 }}
        />
    );
}

/**
 * QHaulBrandMark — the orange "Q" app icon, for use on light backgrounds (favicon, small header).
 */
export function QHaulBrandMark({ size = 28 }: { size?: number }) {
    return (
        <img
            src={markUrl}
            alt="QHaul"
            width={size}
            height={size}
            style={{ display: "block", borderRadius: "var(--qh-r-xs)" }}
        />
    );
}
