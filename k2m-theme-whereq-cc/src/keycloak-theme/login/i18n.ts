import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            continueWith: "Continue with {0}",
            or: "or continue with",
            // ── Brand showcase (left panel) ──
            tagGallery:   "ENCRYPTED GALLERY",
            brandEyebrow: "KEYTOMARVEL · SECURE SIGN-ON",
            brandH1a:     "Your photos. Your keys.",
            brandH1b:     "Nobody else.",
            brandSub:     "whereq.cc encrypts every photo in your browser before it is stored. Sign in to derive your vault key — the passphrase never reaches our servers.",
            fact1:        "Client-side AES-256-GCM",
            fact2:        "Zero-knowledge key derivation",
            fact3:        "Single sign-on via KeyToMarvel",
            vaultBar:     "VAULT PREVIEW",
            vaultSealed:  "12 photos sealed",
            encLabel:     "Encrypted",
            statPhotos:   "Photos",
            statAlbums:   "Albums",
            statSealed:   "Sealed",
            statKeys:     "Keys",
            // ── Form side ──
            secureSignin:      "SECURE SIGN-IN · WHEREQ.CC",
            loginAccountTitle: "Unlock your vault",
            loginSubtitle:     "Enter your whereq.cc credentials to derive your key.",
            securedBy:         "Keys never leave this device · KeyToMarvel SSO",
            // Footer
            footTagline:  "encrypted gallery",
            footerKeys:   "Keys never leave this device",
            footPrivacy:  "Privacy",
            footTerms:    "Terms",
            // Standard overrides
            firstName: "First name",
            lastName:  "Last name",
            avatar:    "Avatar",
        },
        "zh-CN": {
            continueWith: "使用 {0} 继续",
            or: "或使用以下方式",
            tagGallery:   "加密图库",
            brandEyebrow: "KEYTOMARVEL · 安全登录",
            brandH1a:     "你的照片，你的密钥。",
            brandH1b:     "仅此而已。",
            brandSub:     "whereq.cc 在浏览器内完成加密后才会存储照片。登录以派生你的保险库密钥，口令不会到达服务端。",
            fact1:        "客户端 AES-256-GCM 加密",
            fact2:        "零知识密钥派生",
            fact3:        "由 KeyToMarvel 提供单点登录",
            vaultBar:     "保险库预览",
            vaultSealed:  "已封存 12 张照片",
            encLabel:     "已加密",
            statPhotos:   "照片",
            statAlbums:   "相册",
            statSealed:   "已封存",
            statKeys:     "密钥",
            secureSignin:      "安全登录 · WHEREQ.CC",
            loginAccountTitle: "解锁你的保险库",
            loginSubtitle:     "输入 whereq.cc 账号凭据以派生密钥。",
            securedBy:         "密钥永不离开本机 · KeyToMarvel 单点登录",
            footTagline:  "加密图库",
            footerKeys:   "密钥永不离开本机",
            footPrivacy:  "隐私政策",
            footTerms:    "服务条款",
            firstName: "名字",
            lastName:  "姓氏",
            avatar:    "头像",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
