import logoUrl from "@keycloak-theme/shared/assets/whereq-cloud-logo.png";
import iconUrl from "@keycloak-theme/shared/assets/whereq-cloud-icon.png";

/**
 * WhereQCloudWordmark — the full "whereq.cloud" logo (cloud/search mark + wordtext).
 *
 * On the brand panel the design inverts the (normally navy/blue) logo to pure
 * white via `filter: brightness(0) invert(1)`, matching `onInvert`.
 */
export function WhereQCloudWordmark({ height = 32, onInvert = false }: { height?: number; onInvert?: boolean }) {
    return (
        <img
            src={logoUrl}
            alt="whereq.cloud"
            style={{
                height,
                width: "auto",
                display: "block",
                alignSelf: "flex-start",
                flexShrink: 0,
                filter: onInvert ? "brightness(0) invert(1)" : undefined,
            }}
        />
    );
}

/**
 * WhereQCloudBrandMark — the cloud/search "Q" icon only, for favicons and small marks.
 */
export function WhereQCloudBrandMark({ size = 28 }: { size?: number }) {
    return (
        <img
            src={iconUrl}
            alt="whereq.cloud"
            width={size}
            height={size}
            style={{ display: "block" }}
        />
    );
}
