export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            id="cb-footer"
            className="fixed bottom-0 left-0 right-0 h-10 flex items-center justify-center"
            style={{
                background: "rgba(250, 245, 236, 0.92)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid var(--cb-border-subtle)",
            }}
        >
            <p
                className="text-xs tracking-wide"
                style={{ color: "var(--cb-text-muted)" }}
            >
                &copy; {year}{" "}
                <span style={{ color: "var(--cb-orange-400)", fontWeight: 600 }}>CatoBigato</span>
                {" "}&mdash; Learn. Practice. Grow.
            </p>
        </footer>
    );
}
