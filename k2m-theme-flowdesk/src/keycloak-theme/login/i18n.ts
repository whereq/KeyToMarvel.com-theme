// i18nBuilder lives in login/i18n.ts so Keycloakify's build scanner can find it.
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            continueWith: "Continue with {0}",
            or: "or",
            // Brand panel copy
            brandTagline: "Real-time market intelligence at your fingertips",
            brandBullet1: "Live global stock & index data",
            brandBullet2: "AI-powered market analysis",
            brandBullet3: "Personal watchlists & smart alerts",
            // User profile attribute display names
            firstName: "First name",
            lastName: "Last name",
            avatar: "Avatar",
        },
        "zh-CN": {
            continueWith: "使用 {0} 登录",
            or: "或",
            brandTagline: "实时掌握全球市场动态",
            brandBullet1: "全球股票与指数实时行情",
            brandBullet2: "AI 驱动的智能市场分析",
            brandBullet3: "个人自选股与智能提醒",
            firstName: "名字",
            lastName: "姓氏",
            avatar: "头像",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
