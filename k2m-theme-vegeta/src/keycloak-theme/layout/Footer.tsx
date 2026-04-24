/**
 * Footer — MetroUI bottom bar for the login theme.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            id="vg-footer"
            className="fixed bottom-0 left-0 right-0 h-10 flex items-center justify-center"
            style={{
                background: "var(--vg-bg-surface)",
                borderTop: "1px solid var(--vg-border-subtle)",
            }}
        >
            <p
                className="text-xs tracking-wide"
                style={{ color: "var(--vg-text-muted)" }}
            >
                &copy; {year}{" "}
                <span style={{ color: "var(--vg-purple-500)" }}>KeyToMarvel</span>
                {" "}— All rights reserved.
            </p>
        </footer>
    );
}
