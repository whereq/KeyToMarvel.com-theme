export default function TermsText() {
    return (
        <div style={{ fontSize: "0.8rem", color: "var(--cb-text-secondary)", lineHeight: 1.8 }}>
            <section className="mb-4">
                <h3 style={{ color: "var(--cb-text-primary)", fontWeight: 700, marginBottom: 8 }}>Terms of Service</h3>
                <p>By accessing and using CatoBigato, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>1. Acceptance</strong><br />You agree to these terms by registering for or using the service.</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>2. Conduct</strong><br />You agree not to use the service for any unlawful purpose or in any way that violates these terms.</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>3. Privacy</strong><br />Your use of the service is also governed by our Privacy Policy.</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>4. Termination</strong><br />We reserve the right to suspend or terminate your account at any time.</p>
            </section>

            <section style={{ borderTop: "1px solid var(--cb-border-subtle)", paddingTop: 16 }}>
                <h3 style={{ color: "var(--cb-text-primary)", fontWeight: 700, marginBottom: 8 }}>服务条款</h3>
                <p>访问并使用 CatoBigato，即表示您接受并同意受本协议条款和规定的约束。</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>1. 接受</strong><br />注册或使用本服务即表示您同意这些条款。</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>2. 行为准则</strong><br />您同意不将本服务用于任何非法目的或违反这些条款的方式。</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>3. 隐私</strong><br />您对本服务的使用还受我们隐私政策的约束。</p>
                <p><strong style={{ color: "var(--cb-text-primary)" }}>4. 终止</strong><br />我们保留随时暂停或终止您账户的权利。</p>
            </section>
        </div>
    );
}
