import { useState } from "react";
import a1 from "@keycloak-theme/shared/assets/avatars/a1.png";
import a2 from "@keycloak-theme/shared/assets/avatars/a2.png";
import a3 from "@keycloak-theme/shared/assets/avatars/a3.png";
import a4 from "@keycloak-theme/shared/assets/avatars/a4.png";
import a5 from "@keycloak-theme/shared/assets/avatars/a5.png";
import a6 from "@keycloak-theme/shared/assets/avatars/a6.png";
import a7 from "@keycloak-theme/shared/assets/avatars/a7.png";
import a8 from "@keycloak-theme/shared/assets/avatars/a8.png";

const AVATARS = [a1, a2, a3, a4, a5, a6, a7, a8];

/**
 * AvatarPicker — the shuffleable "guest avatar" button from the brand design.
 * Clicking cycles through 8 illustrated avatars; purely cosmetic, ephemeral
 * per page load (no persistence, matching the design).
 */
export default function AvatarPicker({ title }: { title: string }) {
    const [index, setIndex] = useState(0);

    return (
        <button
            type="button"
            onClick={() => setIndex(v => (v + 1) % AVATARS.length)}
            title={title}
            style={{
                width: "56px",
                height: "56px",
                padding: 0,
                border: "none",
                borderRadius: "var(--wqc-r-sm)",
                background: "var(--wqc-surface-2)",
                cursor: "pointer",
                flex: "none",
            }}
            onFocus={e => (e.currentTarget.style.outline = "2px solid var(--wqc-brand-blue)")}
            onBlur={e => (e.currentTarget.style.outline = "none")}
        >
            <img
                src={AVATARS[index]}
                alt=""
                width={56}
                height={56}
                style={{ display: "block", borderRadius: "var(--wqc-r-sm)" }}
            />
        </button>
    );
}
