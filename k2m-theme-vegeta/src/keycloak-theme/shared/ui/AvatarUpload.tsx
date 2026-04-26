import { useRef, useState, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────

/** Maximum stored image size in bytes (16 KB). */
const MAX_BYTES = 16_384;

/** Avatar is resized so neither dimension exceeds this. */
const AVATAR_DIM = 128;

// ── Helpers ──────────────────────────────────────────────────────────────────

function isHttpUrl(v: string) {
    return v.startsWith("http://") || v.startsWith("https://");
}

function isDataUrl(v: string) {
    return v.startsWith("data:image/");
}

/**
 * Resize + JPEG-compress an image File client-side.
 * Iterates quality downward until the encoded size ≤ MAX_BYTES.
 *
 * TODO (k2m backend): replace the returned data-URL with an upload call to
 *   the k2m avatar API, store only the returned URL in the Keycloak attribute.
 *   Until that API exists the full base64 payload is stored in the attribute,
 *   which requires the Keycloak USER_ATTRIBUTE.VALUE column to be TEXT / >255.
 */
async function compressToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const ratio = Math.min(AVATAR_DIM / img.width, AVATAR_DIM / img.height, 1);
            const w = Math.round(img.width  * ratio);
            const h = Math.round(img.height * ratio);

            const canvas = document.createElement("canvas");
            canvas.width  = w;
            canvas.height = h;
            canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

            // Reduce JPEG quality until payload ≤ MAX_BYTES (base64-decoded estimate)
            let quality = 0.85;
            let dataUrl  = canvas.toDataURL("image/jpeg", quality);
            while (dataUrl.length * 0.75 > MAX_BYTES && quality > 0.1) {
                quality -= 0.05;
                dataUrl  = canvas.toDataURL("image/jpeg", quality);
            }
            resolve(dataUrl);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load image"));
        };

        img.src = objectUrl;
    });
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface VgAvatarUploadProps {
    /** Keycloak attribute name — used as the hidden <input> name. */
    name: string;
    /**
     * Current attribute value.
     * May be an https:// URL (social-provider picture) or a data:image/ base64,
     * or empty string when no avatar is set.
     */
    currentValue: string;
    hasError?: boolean;
    disabled?: boolean;
    onChange:  (value: string) => void;
    onBlur?:   () => void;
}

type Status = "idle" | "processing" | "error";

export function VgAvatarUpload({
    name,
    currentValue,
    hasError = false,
    disabled = false,
    onChange,
    onBlur,
}: VgAvatarUploadProps) {
    const fileRef  = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(currentValue);
    const [status,  setStatus]  = useState<Status>("idle");
    const [oversized, setOversized] = useState(false);

    // Sync if parent resets the value
    useEffect(() => { setPreview(currentValue); }, [currentValue]);

    const hasImage = isHttpUrl(preview) || isDataUrl(preview);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setStatus("processing");
        setOversized(false);

        try {
            const dataUrl   = await compressToDataUrl(file);
            const byteCount = Math.round(dataUrl.length * 0.75);
            setOversized(byteCount > MAX_BYTES);
            setPreview(dataUrl);
            onChange(dataUrl);
        } catch {
            setStatus("error");
            return;
        } finally {
            setStatus(s => s === "error" ? "error" : "idle");
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleRemove = () => {
        setPreview("");
        setOversized(false);
        onChange("");
        onBlur?.();
    };

    const ringColor = hasError
        ? "var(--vg-error)"
        : hasImage
            ? "var(--vg-cyan-400)"
            : "var(--vg-border-default)";

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-5">
                {/* ── Avatar circle ── */}
                <div
                    aria-label="Avatar preview"
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        border: `2px solid ${ringColor}`,
                        background: "var(--vg-bg-elevated)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        position: "relative",
                        transition: "border-color 0.2s",
                    }}
                >
                    {hasImage ? (
                        <img
                            src={preview}
                            alt="avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            // If URL avatar fails to load (CORS / expired), fall back to placeholder
                            onError={() => setPreview("")}
                        />
                    ) : (
                        /* Silhouette placeholder */
                        <svg
                            viewBox="0 0 40 40"
                            width={40}
                            height={40}
                            aria-hidden="true"
                            fill="var(--vg-text-muted)"
                        >
                            <circle cx="20" cy="14" r="8" />
                            <ellipse cx="20" cy="36" rx="14" ry="10" />
                        </svg>
                    )}

                    {/* Spinner overlay while processing */}
                    {status === "processing" && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(8,10,18,0.65)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    border: "3px solid var(--vg-cyan-400)",
                                    borderTopColor: "transparent",
                                    animation: "spin 0.8s linear infinite",
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* ── Buttons ── */}
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        disabled={disabled || status === "processing"}
                        onClick={() => fileRef.current?.click()}
                        style={{
                            padding: "6px 16px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            border: "1px solid var(--vg-border-default)",
                            borderRadius: "var(--vg-radius-sm)",
                            background: "var(--vg-bg-elevated)",
                            color: "var(--vg-cyan-400)",
                            cursor: disabled || status === "processing" ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.5 : 1,
                            transition: "border-color 0.15s, color 0.15s",
                        }}
                        onMouseEnter={e => {
                            if (!disabled) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--vg-cyan-400)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--vg-border-default)";
                        }}
                    >
                        {status === "processing"
                            ? "Processing…"
                            : hasImage ? "Change photo" : "Upload photo"}
                    </button>

                    {hasImage && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={handleRemove}
                            style={{
                                padding: "6px 16px",
                                fontSize: "0.8rem",
                                border: "1px solid var(--vg-border-subtle)",
                                borderRadius: "var(--vg-radius-sm)",
                                background: "transparent",
                                color: "var(--vg-text-muted)",
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {/* ── Hints & warnings ── */}
            {oversized && (
                <p style={{ fontSize: "0.75rem", color: "var(--vg-warning)", margin: 0 }}>
                    Image is still large after compression. Consider a smaller photo.
                </p>
            )}
            {status === "error" && (
                <p style={{ fontSize: "0.75rem", color: "var(--vg-error)", margin: 0 }}>
                    Failed to load image. Please try a different file.
                </p>
            )}
            <p style={{ fontSize: "0.73rem", color: "var(--vg-text-muted)", margin: 0 }}>
                JPG · PNG · GIF — auto-resized to 128×128 · max 16 KB
            </p>

            {/* Hidden file picker */}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
                onBlur={onBlur}
            />
        </div>
    );
}
