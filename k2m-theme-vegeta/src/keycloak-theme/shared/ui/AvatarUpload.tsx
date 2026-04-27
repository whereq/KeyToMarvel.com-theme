import { useRef, useState, useEffect } from "react";

// ── Constants ────────────────────────────────────────────────────────────────

/** Maximum stored image size in bytes (16 KB). */
const MAX_BYTES = 16_384;

/** Displayed diameter of the circular crop viewport (px). */
const CROP_SIZE = 256;

/** Output canvas size — also the stored image dimension (px). */
const OUTPUT_SIZE = 128;

// ── Helpers ──────────────────────────────────────────────────────────────────

function isHttpUrl(v: string) {
    return v.startsWith("http://") || v.startsWith("https://");
}

function isDataUrl(v: string) {
    return v.startsWith("data:image/");
}

/**
 * Upload a compressed JPEG data-URL to the k2m avatar API and return the
 * permanent URL to store in the Keycloak user attribute.
 */
async function uploadAvatar(dataUrl: string): Promise<string> {
    const realm = window.location.pathname.split("/")[2] ?? "";
    const response = await fetch(`/realms/${realm}/avatars/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: dataUrl }),
    });

    if (!response.ok) {
        throw new Error(
            response.status === 413
                ? "Image too large for server (> 16 KB)."
                : `Upload failed (HTTP ${response.status}).`,
        );
    }

    const json = (await response.json()) as { url?: string };
    if (!json.url) throw new Error("Upload response missing url field.");
    return json.url;
}

// ── Shared button styles ──────────────────────────────────────────────────────

const BASE_BTN: React.CSSProperties = {
    padding: "6px 16px",
    fontSize: "0.8rem",
    fontWeight: 500,
    border: "1px solid var(--vg-border-default)",
    borderRadius: "var(--vg-radius-sm)",
    background: "var(--vg-bg-elevated)",
    color: "var(--vg-cyan-400)",
    cursor: "pointer",
    transition: "border-color 0.15s",
};

const APPLY_BTN: React.CSSProperties = {
    ...BASE_BTN,
    background: "var(--vg-cyan-400)",
    color: "#080a12",
    border: "1px solid var(--vg-cyan-400)",
};

const CANCEL_BTN: React.CSSProperties = {
    ...BASE_BTN,
    background: "transparent",
    color: "var(--vg-text-muted)",
    border: "1px solid var(--vg-border-subtle)",
};

const ZOOM_BTN: React.CSSProperties = {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "1px solid var(--vg-border-default)",
    borderRadius: "var(--vg-radius-sm)",
    background: "var(--vg-bg-elevated)",
    color: "var(--vg-text-muted)",
    cursor: "pointer",
    fontSize: "1rem",
    flexShrink: 0,
};

// ── Component ─────────────────────────────────────────────────────────────────

export interface VgAvatarUploadProps {
    /**
     * Current attribute value — https:// URL, data:image/ URL, or empty string.
     */
    currentValue: string;
    hasError?: boolean;
    disabled?: boolean;
    onChange:  (value: string) => void;
    onBlur?:   () => void;
}

type UiState = "idle" | "cropping" | "uploading" | "error";

export function VgAvatarUpload({
    currentValue,
    hasError = false,
    disabled = false,
    onChange,
    onBlur,
}: VgAvatarUploadProps) {
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Normal-state preview ──────────────────────────────────────────────────
    const [preview,      setPreview]      = useState(currentValue);
    const [uiState,      setUiState]      = useState<UiState>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ── Cropper state ─────────────────────────────────────────────────────────
    const [cropObjectUrl, setCropObjectUrl] = useState("");
    const [scale,         setScale]         = useState(1);
    const [minScale,      setMinScale]      = useState(1);
    const [imgLeft,       setImgLeft]       = useState(0);
    const [imgTop,        setImgTop]        = useState(0);
    const [isDragging,    setIsDragging]    = useState(false);

    // Refs for stable access inside event handlers / effects
    const sourceImgRef = useRef<HTMLImageElement | null>(null);
    const dragRef      = useRef<{
        startX:    number;
        startY:    number;
        startLeft: number;
        startTop:  number;
    } | null>(null);

    // Mirror of scale / imgLeft / imgTop so global listeners always see current values
    const liveRef = useRef({ scale: 1, imgLeft: 0, imgTop: 0 });
    liveRef.current = { scale, imgLeft, imgTop };

    // Sync preview when parent resets the form
    useEffect(() => { setPreview(currentValue); }, [currentValue]);

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Clamp image position so it never reveals black borders inside the circle. */
    function clamp(left: number, top: number, s: number): [number, number] {
        const img = sourceImgRef.current;
        if (!img) return [left, top];
        return [
            Math.min(0, Math.max(CROP_SIZE - img.naturalWidth  * s, left)),
            Math.min(0, Math.max(CROP_SIZE - img.naturalHeight * s, top)),
        ];
    }

    /** Zoom to newScale, keeping the circle's center point fixed in the image. */
    function applyZoom(newScale: number) {
        const img = sourceImgRef.current;
        if (!img) return;
        const { scale: s, imgLeft: l, imgTop: t } = liveRef.current;
        const cx = CROP_SIZE / 2;
        const cy = CROP_SIZE / 2;
        // Where is the center of the circle in fractional image coords?
        const relX = (cx - l) / (img.naturalWidth  * s);
        const relY = (cy - t) / (img.naturalHeight * s);
        // Reposition so the same image point stays at the circle center
        const [nl, nt] = clamp(
            cx - relX * img.naturalWidth  * newScale,
            cy - relY * img.naturalHeight * newScale,
            newScale,
        );
        setScale(newScale);
        setImgLeft(nl);
        setImgTop(nt);
    }

    // ── Global drag listeners ──────────────────────────────────────────────────
    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const clientX = "touches" in e
                ? (e as TouchEvent).touches[0].clientX
                : (e as MouseEvent).clientX;
            const clientY = "touches" in e
                ? (e as TouchEvent).touches[0].clientY
                : (e as MouseEvent).clientY;
            if (!dragRef.current) return;
            const { scale: s } = liveRef.current;
            const dx = clientX - dragRef.current.startX;
            const dy = clientY - dragRef.current.startY;
            const [nl, nt] = clamp(
                dragRef.current.startLeft + dx,
                dragRef.current.startTop  + dy,
                s,
            );
            setImgLeft(nl);
            setImgTop(nt);
        };

        const onUp = () => {
            setIsDragging(false);
            dragRef.current = null;
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("mouseup",   onUp);
        window.addEventListener("touchend",  onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("mouseup",   onUp);
            window.removeEventListener("touchend",  onUp);
        };
    }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── File selection → open cropper ─────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (fileRef.current) fileRef.current.value = "";

        const objUrl = URL.createObjectURL(file);
        const img    = new Image();

        img.onload = () => {
            // Scale so the shorter dimension fills CROP_SIZE exactly
            const ms = Math.max(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight);
            const iw = img.naturalWidth  * ms;
            const ih = img.naturalHeight * ms;

            sourceImgRef.current = img;
            setCropObjectUrl(objUrl);
            setMinScale(ms);
            setScale(ms);
            setImgLeft((CROP_SIZE - iw) / 2);
            setImgTop((CROP_SIZE  - ih) / 2);
            setErrorMessage(null);
            setUiState("cropping");
        };

        img.onerror = () => {
            URL.revokeObjectURL(objUrl);
            setErrorMessage("Failed to load image. Please try a different file.");
            setUiState("error");
        };

        img.src = objUrl;
    };

    const cleanupCrop = () => {
        if (cropObjectUrl) URL.revokeObjectURL(cropObjectUrl);
        setCropObjectUrl("");
        sourceImgRef.current = null;
    };

    // ── Apply crop → compress → upload ────────────────────────────────────────
    const handleApply = async () => {
        const img = sourceImgRef.current;
        if (!img) return;

        setUiState("uploading");

        // Draw the visible CROP_SIZE×CROP_SIZE area onto an OUTPUT_SIZE×OUTPUT_SIZE canvas
        const canvas = document.createElement("canvas");
        canvas.width  = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext("2d")!;

        const { scale: s, imgLeft: l, imgTop: t } = liveRef.current;
        ctx.drawImage(
            img,
            -l / s,         // sx: left edge of visible area in original-image coords
            -t / s,         // sy
            CROP_SIZE / s,  // sw: visible width in original-image coords
            CROP_SIZE / s,  // sh
            0, 0,           // dest origin
            OUTPUT_SIZE,    // dest width
            OUTPUT_SIZE,    // dest height
        );

        // Reduce JPEG quality until the payload fits within MAX_BYTES
        let quality = 0.85;
        let dataUrl  = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length * 0.75 > MAX_BYTES && quality > 0.1) {
            quality -= 0.05;
            dataUrl  = canvas.toDataURL("image/jpeg", quality);
        }

        try {
            const avatarUrl = await uploadAvatar(dataUrl);
            cleanupCrop();
            setPreview(avatarUrl);
            onChange(avatarUrl);
            setUiState("idle");
        } catch (err) {
            setUiState("error");
            setErrorMessage(
                err instanceof Error ? err.message : "Upload failed. Please try again.",
            );
        }
    };

    const handleCancel = () => {
        cleanupCrop();
        setUiState("idle");
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleRemove = () => {
        setPreview("");
        onChange("");
        onBlur?.();
    };

    const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        dragRef.current = {
            startX:    clientX,
            startY:    clientY,
            startLeft: imgLeft,
            startTop:  imgTop,
        };
        setIsDragging(true);
    };

    // ── Render: Cropper UI ────────────────────────────────────────────────────
    if (uiState === "cropping" || (uiState === "uploading" && cropObjectUrl)) {
        const isUploading = uiState === "uploading";
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: CROP_SIZE }}>
                <p style={{ fontSize: "0.73rem", color: "var(--vg-text-muted)", margin: 0 }}>
                    Drag to reposition · scroll or +/− to zoom
                </p>

                {/* Circular crop viewport */}
                <div
                    style={{
                        width:        CROP_SIZE,
                        height:       CROP_SIZE,
                        borderRadius: "50%",
                        overflow:     "hidden",
                        position:     "relative",
                        cursor:       isUploading ? "default" : isDragging ? "grabbing" : "grab",
                        userSelect:   "none",
                        border:       "2px solid var(--vg-cyan-400)",
                        background:   "#000",
                    }}
                    onMouseDown={!isUploading ? onDragStart : undefined}
                    onTouchStart={!isUploading ? onDragStart : undefined}
                    onWheel={(e) => {
                        if (isUploading) return;
                        e.preventDefault();
                        const step     = minScale * 0.08;
                        const newScale = Math.min(
                            Math.max(scale + (e.deltaY < 0 ? step : -step), minScale),
                            minScale * 4,
                        );
                        applyZoom(newScale);
                    }}
                >
                    {cropObjectUrl && (
                        <img
                            src={cropObjectUrl}
                            draggable={false}
                            style={{
                                position:     "absolute",
                                left:         imgLeft,
                                top:          imgTop,
                                width:        sourceImgRef.current
                                    ? sourceImgRef.current.naturalWidth  * scale
                                    : "auto",
                                height:       sourceImgRef.current
                                    ? sourceImgRef.current.naturalHeight * scale
                                    : "auto",
                                pointerEvents: "none",
                                userSelect:    "none",
                            }}
                        />
                    )}

                    {/* Uploading spinner overlay */}
                    {isUploading && (
                        <div style={{
                            position:   "absolute",
                            inset:      0,
                            background: "rgba(8,10,18,0.65)",
                            display:    "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <div style={{
                                width:           32,
                                height:          32,
                                borderRadius:    "50%",
                                border:          "3px solid var(--vg-cyan-400)",
                                borderTopColor:  "transparent",
                                animation:       "spin 0.8s linear infinite",
                            }} />
                        </div>
                    )}
                </div>

                {/* Zoom slider — hidden while uploading */}
                {!isUploading && (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                                type="button"
                                style={ZOOM_BTN}
                                onClick={() =>
                                    applyZoom(Math.max(scale - minScale * 0.1, minScale))
                                }
                            >
                                −
                            </button>
                            <input
                                type="range"
                                min={minScale}
                                max={minScale * 4}
                                step={minScale * 0.02}
                                value={scale}
                                onChange={(e) => applyZoom(parseFloat(e.target.value))}
                                style={{ flex: 1, accentColor: "var(--vg-cyan-400)" }}
                            />
                            <button
                                type="button"
                                style={ZOOM_BTN}
                                onClick={() =>
                                    applyZoom(Math.min(scale + minScale * 0.1, minScale * 4))
                                }
                            >
                                +
                            </button>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button type="button" style={APPLY_BTN}  onClick={handleApply}>
                                Apply
                            </button>
                            <button type="button" style={CANCEL_BTN} onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ── Render: Normal (idle / error) ─────────────────────────────────────────
    const hasImage  = isHttpUrl(preview) || isDataUrl(preview);
    const ringColor = hasError
        ? "var(--vg-error)"
        : hasImage
            ? "var(--vg-cyan-400)"
            : "var(--vg-border-default)";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Avatar circle preview */}
                <div style={{
                    width:          80,
                    height:         80,
                    borderRadius:   "50%",
                    border:         `2px solid ${ringColor}`,
                    background:     "var(--vg-bg-elevated)",
                    overflow:       "hidden",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                    position:       "relative",
                    transition:     "border-color 0.2s",
                }}>
                    {hasImage ? (
                        <img
                            src={preview}
                            alt="avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={() => setPreview("")}
                        />
                    ) : (
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
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => fileRef.current?.click()}
                        style={{
                            ...BASE_BTN,
                            cursor:  disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!disabled)
                                (e.currentTarget as HTMLButtonElement).style.borderColor =
                                    "var(--vg-cyan-400)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor =
                                "var(--vg-border-default)";
                        }}
                    >
                        {hasImage ? "Change photo" : "Upload photo"}
                    </button>

                    {hasImage && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={handleRemove}
                            style={{
                                ...CANCEL_BTN,
                                cursor: disabled ? "not-allowed" : "pointer",
                            }}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {uiState === "error" && errorMessage && (
                <p style={{ fontSize: "0.75rem", color: "var(--vg-error)", margin: 0 }}>
                    {errorMessage}
                </p>
            )}

            <p style={{ fontSize: "0.73rem", color: "var(--vg-text-muted)", margin: 0 }}>
                JPG · PNG · GIF — drag to crop · scroll to zoom · max 16 KB
            </p>

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
