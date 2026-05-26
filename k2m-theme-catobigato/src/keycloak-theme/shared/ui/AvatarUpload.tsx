import { useRef, useState, useEffect } from "react";

const MAX_BYTES = 16_384;
const CROP_SIZE = 256;
const OUTPUT_SIZE = 128;

const STRINGS = {
    en: {
        uploadPhoto:  "Upload photo",
        changePhoto:  "Change photo",
        remove:       "Remove",
        apply:        "Apply",
        cancel:       "Cancel",
        cropHint:     "Drag to reposition \u00b7 scroll or +/\u2212 to zoom",
        applyHint:    "Click Apply to confirm and upload your avatar",
        idleHint:     "JPG \u00b7 PNG \u00b7 GIF \u00b7 max 16 KB",
        uploading:    "Uploading\u2026",
    },
    zh: {
        uploadPhoto:  "\u4e0a\u4f20\u5934\u50cf",
        changePhoto:  "\u66f4\u6362\u5934\u50cf",
        remove:       "\u79fb\u9664",
        apply:        "\u786e\u8ba4\u4e0a\u4f20",
        cancel:       "\u53d6\u6d88",
        cropHint:     "\u62d6\u52a8\u8c03\u6574\u4f4d\u7f6e \u00b7 \u6eda\u8f6e\u6216 +/\u2212 \u7f29\u653e",
        applyHint:    "\u8c03\u6574\u5b8c\u6210\u540e\u70b9\u51fb\u300c\u786e\u8ba4\u4e0a\u4f20\u300d\u4fdd\u5b58\u5934\u50cf",
        idleHint:     "\u652f\u6301 JPG \u00b7 PNG \u00b7 GIF \u00b7 \u6700\u5927 16 KB",
        uploading:    "\u4e0a\u4f20\u4e2d\u2026",
    },
} as const;

type Locale = keyof typeof STRINGS;

function resolveLocale(locale?: string): Locale {
    if (!locale) return "en";
    const tag = locale.toLowerCase();
    if (tag === "zh" || tag.startsWith("zh-")) return "zh";
    return "en";
}

function isHttpUrl(v: string) {
    return v.startsWith("http://") || v.startsWith("https://");
}

function isRelativePath(v: string) {
    return v.startsWith("/realms/");
}

function isDataUrl(v: string) {
    return v.startsWith("data:image/");
}

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

const BASE_BTN: React.CSSProperties = {
    padding: "6px 16px",
    fontSize: "0.8rem",
    fontWeight: 500,
    border: "1px solid var(--cb-border-default)",
    borderRadius: "var(--cb-radius-sm)",
    background: "var(--cb-bg-elevated)",
    color: "var(--cb-orange-500)",
    cursor: "pointer",
    transition: "border-color 0.15s",
};

const APPLY_BTN: React.CSSProperties = {
    ...BASE_BTN,
    background: "var(--cb-orange-500)",
    color: "#fff",
    border: "1px solid var(--cb-orange-500)",
};

const CANCEL_BTN: React.CSSProperties = {
    ...BASE_BTN,
    background: "transparent",
    color: "var(--cb-text-muted)",
    border: "1px solid var(--cb-border-subtle)",
};

const ZOOM_BTN: React.CSSProperties = {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: "1px solid var(--cb-border-default)",
    borderRadius: "var(--cb-radius-sm)",
    background: "var(--cb-bg-elevated)",
    color: "var(--cb-text-muted)",
    cursor: "pointer",
    fontSize: "1rem",
    flexShrink: 0,
};

export interface CbAvatarUploadProps {
    currentValue: string;
    hasError?: boolean;
    disabled?: boolean;
    onChange: (value: string) => void;
    onBlur?: () => void;
    locale?: string;
}

type UiState = "idle" | "cropping" | "uploading" | "error";

export function CbAvatarUpload({
    currentValue,
    hasError = false,
    disabled = false,
    onChange,
    onBlur,
    locale,
}: CbAvatarUploadProps) {
    const s = STRINGS[resolveLocale(locale)];
    const fileRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState(currentValue);
    const [uiState, setUiState] = useState<UiState>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [cropObjectUrl, setCropObjectUrl] = useState("");
    const [scale, setScale] = useState(1);
    const [minScale, setMinScale] = useState(1);
    const [imgLeft, setImgLeft] = useState(0);
    const [imgTop, setImgTop] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const sourceImgRef = useRef<HTMLImageElement | null>(null);
    const dragRef = useRef<{
        startX: number;
        startY: number;
        startLeft: number;
        startTop: number;
    } | null>(null);

    const liveRef = useRef({ scale: 1, imgLeft: 0, imgTop: 0 });
    liveRef.current = { scale, imgLeft, imgTop };

    useEffect(() => { setPreview(currentValue); }, [currentValue]);

    function clamp(left: number, top: number, sc: number): [number, number] {
        const img = sourceImgRef.current;
        if (!img) return [left, top];
        return [
            Math.min(0, Math.max(CROP_SIZE - img.naturalWidth * sc, left)),
            Math.min(0, Math.max(CROP_SIZE - img.naturalHeight * sc, top)),
        ];
    }

    function applyZoom(newScale: number) {
        const img = sourceImgRef.current;
        if (!img) return;
        const { scale: sc, imgLeft: l, imgTop: t } = liveRef.current;
        const cx = CROP_SIZE / 2;
        const cy = CROP_SIZE / 2;
        const relX = (cx - l) / (img.naturalWidth * sc);
        const relY = (cy - t) / (img.naturalHeight * sc);
        const [nl, nt] = clamp(
            cx - relX * img.naturalWidth * newScale,
            cy - relY * img.naturalHeight * newScale,
            newScale,
        );
        liveRef.current = { scale: newScale, imgLeft: nl, imgTop: nt };
        setScale(newScale);
        setImgLeft(nl);
        setImgTop(nt);
    }

    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
            if (!dragRef.current) return;
            const { scale: sc } = liveRef.current;
            const dx = clientX - dragRef.current.startX;
            const dy = clientY - dragRef.current.startY;
            const [nl, nt] = clamp(dragRef.current.startLeft + dx, dragRef.current.startTop + dy, sc);
            setImgLeft(nl);
            setImgTop(nt);
        };

        const onUp = () => {
            setIsDragging(false);
            dragRef.current = null;
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchend", onUp);
        };
    }, [isDragging]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (fileRef.current) fileRef.current.value = "";

        const objUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const ms = Math.max(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight);
            const iw = img.naturalWidth * ms;
            const ih = img.naturalHeight * ms;

            sourceImgRef.current = img;
            setCropObjectUrl(objUrl);
            setMinScale(ms);
            setScale(ms);
            setImgLeft((CROP_SIZE - iw) / 2);
            setImgTop((CROP_SIZE - ih) / 2);
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

    const handleApply = async () => {
        const img = sourceImgRef.current;
        if (!img) return;

        setUiState("uploading");

        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext("2d")!;

        const { scale: sc, imgLeft: l, imgTop: t } = liveRef.current;
        ctx.drawImage(img, -l / sc, -t / sc, CROP_SIZE / sc, CROP_SIZE / sc, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        let quality = 0.85;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length * 0.75 > MAX_BYTES && quality > 0.1) {
            quality -= 0.05;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        try {
            const avatarUrl = await uploadAvatar(dataUrl);
            cleanupCrop();
            setPreview(avatarUrl);
            onChange(avatarUrl);
            setUiState("idle");
        } catch (err) {
            setUiState("error");
            setErrorMessage(err instanceof Error ? err.message : "Upload failed. Please try again.");
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
        dragRef.current = { startX: clientX, startY: clientY, startLeft: imgLeft, startTop: imgTop };
        setIsDragging(true);
    };

    if (uiState === "cropping" || (uiState === "uploading" && cropObjectUrl)) {
        const isUploading = uiState === "uploading";
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: CROP_SIZE }}>
                <p style={{ fontSize: "0.73rem", color: "var(--cb-text-muted)", margin: 0 }}>
                    {s.cropHint}
                </p>

                <div
                    style={{
                        width: CROP_SIZE, height: CROP_SIZE,
                        borderRadius: "50%", overflow: "hidden", position: "relative",
                        cursor: isUploading ? "default" : isDragging ? "grabbing" : "grab",
                        userSelect: "none",
                        border: "2px solid var(--cb-orange-400)",
                        background: "#000",
                    }}
                    onMouseDown={!isUploading ? onDragStart : undefined}
                    onTouchStart={!isUploading ? onDragStart : undefined}
                    onWheel={(e) => {
                        if (isUploading) return;
                        e.preventDefault();
                        const cur = liveRef.current.scale;
                        const step = minScale * 0.08;
                        const next = Math.min(Math.max(cur + (e.deltaY < 0 ? step : -step), minScale), minScale * 4);
                        applyZoom(next);
                    }}
                >
                    {cropObjectUrl && (
                        <img
                            src={cropObjectUrl}
                            draggable={false}
                            style={{
                                position: "absolute", left: imgLeft, top: imgTop,
                                width: sourceImgRef.current ? sourceImgRef.current.naturalWidth * scale : "auto",
                                height: sourceImgRef.current ? sourceImgRef.current.naturalHeight * scale : "auto",
                                pointerEvents: "none", userSelect: "none",
                            }}
                        />
                    )}

                    {isUploading && (
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(42,30,18,0.65)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                        }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                border: "3px solid var(--cb-orange-400)", borderTopColor: "transparent",
                                animation: "spin 0.8s linear infinite",
                            }} />
                            <span style={{ fontSize: "0.75rem", color: "var(--cb-orange-400)" }}>{s.uploading}</span>
                        </div>
                    )}
                </div>

                {!isUploading && (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button type="button" style={ZOOM_BTN} onClick={() => applyZoom(Math.max(liveRef.current.scale - minScale * 0.1, minScale))}>−</button>
                            <input
                                type="range" min={0} max={100} step={1}
                                value={Math.round((scale - minScale) / (minScale * 3) * 100)}
                                onChange={(e) => applyZoom(minScale + parseInt(e.target.value, 10) / 100 * minScale * 3)}
                                style={{ flex: 1, accentColor: "var(--cb-orange-400)" }}
                            />
                            <button type="button" style={ZOOM_BTN} onClick={() => applyZoom(Math.min(liveRef.current.scale + minScale * 0.1, minScale * 4))}>+</button>
                        </div>

                        <p style={{ fontSize: "0.73rem", color: "var(--cb-orange-500)", margin: 0, fontStyle: "italic" }}>
                            {s.applyHint}
                        </p>

                        <div style={{ display: "flex", gap: 8 }}>
                            <button type="button" style={APPLY_BTN} onClick={handleApply}>{s.apply}</button>
                            <button type="button" style={CANCEL_BTN} onClick={handleCancel}>{s.cancel}</button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    const hasImage = isHttpUrl(preview) || isDataUrl(preview) || isRelativePath(preview);
    const ringColor = hasError
        ? "var(--cb-error)"
        : hasImage ? "var(--cb-orange-400)" : "var(--cb-border-default)";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    border: `2px solid ${ringColor}`, background: "var(--cb-bg-elevated)",
                    overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, position: "relative", transition: "border-color 0.2s",
                }}>
                    {hasImage ? (
                        <img src={preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setPreview("")} />
                    ) : (
                        <svg viewBox="0 0 40 40" width={40} height={40} aria-hidden="true" fill="var(--cb-text-muted)">
                            <circle cx="20" cy="14" r="8" />
                            <ellipse cx="20" cy="36" rx="14" ry="10" />
                        </svg>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                        type="button" disabled={disabled}
                        onClick={() => fileRef.current?.click()}
                        style={{ ...BASE_BTN, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
                        onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cb-orange-400)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cb-border-default)"; }}
                    >
                        {hasImage ? s.changePhoto : s.uploadPhoto}
                    </button>

                    {hasImage && (
                        <button type="button" disabled={disabled} onClick={handleRemove} style={{ ...CANCEL_BTN, cursor: disabled ? "not-allowed" : "pointer" }}>
                            {s.remove}
                        </button>
                    )}
                </div>
            </div>

            {uiState === "error" && errorMessage && (
                <p style={{ fontSize: "0.75rem", color: "var(--cb-error)", margin: 0 }}>{errorMessage}</p>
            )}

            <p style={{ fontSize: "0.73rem", color: "var(--cb-text-muted)", margin: 0 }}>{s.idleHint}</p>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} onBlur={onBlur} />
        </div>
    );
}
