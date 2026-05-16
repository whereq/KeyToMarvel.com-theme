/**
 * Footer — FlowDesk Metro bottom bar.
 *
 * Matches the app's footer chrome: dark surface with 2px top border.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            id="fd-footer"
            className="fixed bottom-0 left-0 right-0 h-10 flex items-center justify-between px-6"
            style={{
                background: "var(--fd-bg-surface)",
                borderTop: "2px solid var(--fd-border-chrome)",
            }}
        >
            <p className="text-xs" style={{ color: "var(--fd-text-muted)", margin: 0 }}>
                &copy; {year}{" "}
                <a
                    href="https://flowdesk.top"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--fd-blue-500)", textDecoration: "none" }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = "var(--fd-cyan-400)")}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = "var(--fd-blue-500)")}
                >
                    FlowDesk
                </a>
                {" "}— Real-time Stock Data
            </p>
            <p className="text-xs" style={{ color: "var(--fd-text-muted)", margin: 0 }}>
                Powered by{" "}
                <span style={{ color: "var(--fd-border-chrome)" }}>KeyToMarvel</span>
            </p>
        </footer>
    );
}
