import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            continueWith: "Continue with {0}",
            or: "or",
            // Showcase / brand panel — Direction A: Terminal × AI
            brandTagline:  "Go deeper than the ticker.",
            brandSubline:  "Near-real-time and historical data, structured intel, and NOVA — your AI research partner — woven into one terminal.",
            mktOverview:   "Market overview — today",
            dailyCandles:  "Daily candles",
            liveQuotes:    "Live quotes",
            mktOpen:       "Market open",
            brandBullet1:  "Live global stock & index data, plus deep history",
            brandBullet2:  "AI-powered analysis with NOVA — ask anything, with citations",
            brandBullet3:  "Personal watchlists, sectors & smart alerts",
            // Form side
            secureSignin:  "Secure sign-in · KeyToMavel",
            loginSubtitle: "Pick up your research exactly where you left off.",
            securedBy:     "Secured by KeyToMavel · SSO",
            // Standard overrides
            firstName: "First name",
            lastName:  "Last name",
            avatar:    "Avatar",
        },
        "zh-CN": {
            continueWith: "使用 {0} 登录",
            or: "或",
            brandTagline:  "比行情更深一层。",
            brandSubline:  "近实时与历史数据、结构化资讯，以及你的 AI 研究伙伴 NOVA，统一于一个终端。",
            mktOverview:   "市场总览 — 今日",
            dailyCandles:  "日 K 线",
            liveQuotes:    "实时报价",
            mktOpen:       "市场开盘",
            brandBullet1:  "全球股票与指数实时数据，含深度历史",
            brandBullet2:  "NOVA 驱动的 AI 分析 — 有问必答，附带引用",
            brandBullet3:  "个人观察列表、板块与智能提醒",
            secureSignin:  "安全登录 · KeyToMavel",
            loginSubtitle: "从上次离开的地方继续您的研究。",
            securedBy:     "由 KeyToMavel 提供安全保障 · SSO",
            firstName: "名字",
            lastName:  "姓氏",
            avatar:    "头像",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
