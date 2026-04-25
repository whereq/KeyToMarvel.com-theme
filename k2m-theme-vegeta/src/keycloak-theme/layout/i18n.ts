/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            continueWith: "Continue with {0}",
            or: "or",
            brandTagline: "Your gateway to unlock the universe",
            brandBullet1: "One account, every universe",
            brandBullet2: "Sign in with your preferred account",
            brandBullet3: "Secure · Fast · Magical",
        },
        "zh-CN": {
            continueWith: "使用 {0} 登录",
            or: "或",
            brandTagline: "解锁宇宙的钥匙",
            brandBullet1: "一个账号，畅游每个宇宙",
            brandBullet2: "使用您偏好的账号登录",
            brandBullet3: "安全 · 快速 · 神奇",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
