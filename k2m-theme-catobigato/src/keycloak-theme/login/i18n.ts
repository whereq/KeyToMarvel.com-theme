/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            continueWith: "Continue with {0}",
            or: "or",
            brandTagline: "Learn anything with a clever cat by your side",
            brandBullet1: "AI tutor across math, science & humanities",
            brandBullet2: "Snap a problem, get a real teacher's answer",
            brandBullet3: "Warm, witty, and patient — just like Catobi",
            firstName: "First name",
            lastName: "Last name",
            avatar: "Avatar",
        },
        "zh-CN": {
            continueWith: "使用 {0} 登录",
            or: "或",
            brandTagline: "聪明的猫咪陪你学习一切",
            brandBullet1: "AI导师覆盖数学、科学和人文学科",
            brandBullet2: "拍下题目，获得真正的老师解答",
            brandBullet3: "温暖、机智又耐心 — 就像 Catobi",
            firstName: "名字",
            lastName: "姓氏",
            avatar: "头像",
        },
        fr: {
            continueWith: "Continuer avec {0}",
            or: "ou",
            brandTagline: "Apprends tout avec un chat malin a tes cotes",
            brandBullet1: "Tuteur IA en maths, sciences et lettres",
            brandBullet2: "Prends une photo, obtiens une vraie reponse",
            brandBullet3: "Chaleureux, spirituel et patient — comme Catobi",
            firstName: "Prenom",
            lastName: "Nom",
            avatar: "Avatar",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
