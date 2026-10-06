// i18nBuilder lives in login/i18n.ts so Keycloakify's build scanner can find it.
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            or: "or continue with",

            // Brand panel (aside — realm-level, same across login/register/forgot)
            brandLive: "Live",
            brandEyebrow: "Live market data · one metered API",
            brandHeadline: "Market data, news & intelligence,",
            brandHeadlineBold: "one API.",
            brandBody: "whereq.cloud is the centralized data platform behind WhereQ. Global equities, finance news & editorial, hot rankings, quotes and the economic calendar — collected, cleaned and served through a single versioned, metered API.",
            tileNews: "Market news",
            tileFlash: "Flash",
            tileHot: "Hot rankings",
            tileQuotes: "Live quotes",
            tileEcon: "Econ calendar",
            tileNova: "Ask Nova",
            statInstruments: "Instruments",
            statExchanges: "Exchanges",
            statQuotes: "Quotes stored",
            statResources: "API resources",

            // Chrome: topbar + theme/locale toggles
            backToSite: "← Back to whereq.cloud",
            themeLight: "Light",
            themeDark: "Dark",

            // Sign in
            loginFormTitle: "Sign in",
            loginFormSub: "to whereq.cloud · you're browsing as a guest",
            loginAltPrompt: "New to whereq.cloud?",
            loginAltCta: "Get your API key — free to start.",
            loginFooterNote: "One WhereQ account across whereq.cloud, FlowDesk and Chroniq.",
            avatarShuffle: "Shuffle avatar",
            passwordShow: "Show",
            passwordHide: "Hide",

            // Register
            registerFormTitle: "Create an account",
            registerFormSub: "A free API key and dashboard access in under a minute.",
            registerAltPrompt: "Already registered?",
            registerAltCta: "Back to sign in",
            registerLegalNote: "By registering you accept the WhereQ terms of service and privacy policy.",

            // Forgot password
            forgotFormTitle: "Reset your password",
            forgotFormSub: "Enter the email on your account and we will send a reset link.",
            forgotAltPrompt: "Remembered it?",
            forgotAltCta: "Back to sign in",
            forgotLegalNote: "The reset link is valid for 15 minutes. If it does not arrive, check spam or write to support@whereq.cloud.",

            // Social
            socialGoogleLabel: "Google",
            socialWechatLabel: "WeChat",

            // Footer
            footerCopyright: "© 2026 WhereQ · the data platform behind WhereQ",
            footerPrivacy: "Privacy",
            footerTerms: "Terms",
            footerApiDocs: "API docs",
        },
        "zh-CN": {
            or: "或使用以下方式登录",

            brandLive: "实时",
            brandEyebrow: "实时市场数据 · 单一计量 API",
            brandHeadline: "市场数据、资讯与智能分析，",
            brandHeadlineBold: "一个 API 搞定。",
            brandBody: "whereq.cloud 是 WhereQ 旗下的中心化数据平台。全球股票行情、财经资讯与编辑精选、热门排行、实时报价与经济日历——统一采集、清洗，并通过一个带版本、计量计费的 API 提供服务。",
            tileNews: "市场资讯",
            tileFlash: "快讯",
            tileHot: "热门排行",
            tileQuotes: "实时报价",
            tileEcon: "经济日历",
            tileNova: "问问 Nova",
            statInstruments: "覆盖标的",
            statExchanges: "交易所",
            statQuotes: "历史报价",
            statResources: "API 资源",

            backToSite: "← 返回 whereq.cloud",
            themeLight: "浅色",
            themeDark: "深色",

            loginFormTitle: "登录",
            loginFormSub: "登录 whereq.cloud · 当前以访客身份浏览",
            loginAltPrompt: "还没有账户？",
            loginAltCta: "免费获取 API 密钥",
            loginFooterNote: "一个 WhereQ 账户，通用于 whereq.cloud、FlowDesk 与 Chroniq。",
            avatarShuffle: "换一个头像",
            passwordShow: "显示",
            passwordHide: "隐藏",

            registerFormTitle: "创建账户",
            registerFormSub: "一分钟内获取免费 API 密钥与控制台访问权限。",
            registerAltPrompt: "已有账户？",
            registerAltCta: "返回登录",
            registerLegalNote: "注册即表示同意 WhereQ 服务条款与隐私政策。",

            forgotFormTitle: "重置密码",
            forgotFormSub: "输入账户邮箱，我们会发送重置链接。",
            forgotAltPrompt: "想起密码了？",
            forgotAltCta: "返回登录",
            forgotLegalNote: "重置链接 15 分钟内有效。若未收到，请检查垃圾邮件或联系 support@whereq.cloud。",

            socialGoogleLabel: "Google",
            socialWechatLabel: "微信登录",

            footerCopyright: "© 2026 WhereQ · WhereQ 旗下数据平台",
            footerPrivacy: "隐私政策",
            footerTerms: "服务条款",
            footerApiDocs: "API 文档",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
