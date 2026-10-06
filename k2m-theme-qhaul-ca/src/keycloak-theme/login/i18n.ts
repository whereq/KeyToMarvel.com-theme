// i18nBuilder lives in login/i18n.ts so Keycloakify's build scanner can find it.
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "@keycloak-theme/kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            or: "Or continue with",

            // Brand panel (navy aside — realm-level, same across login/register/forgot)
            brandRealm: "QHaul account · qhaul.ca realm",
            brandHeadline: "One account for every job you move.",
            brandBody: "Sign in to see past bookings, net-terms invoices, saved addresses and live tracking. Business accounts manage team permissions here too.",
            brandTile1Value: "4,800+",
            brandTile1Label: "Jobs per month",
            brandTile2Value: "98%",
            brandTile2Label: "Same-day",
            brandTile3Value: "45 min",
            brandTile3Label: "Avg. pickup",
            brandTile4Value: "GTA",
            brandTile4Label: "Service area",

            // Sign in
            loginFormTitle: "Sign in",
            loginFormSub: "Use your email, phone number or username to sign in.",
            loginAltPrompt: "No account yet?",
            loginAltCta: "Create one",
            loginLegalNote: "By signing in you accept the QHaul terms of service and privacy policy. Authentication provided by Keycloak, qhaul.ca realm.",

            // Register
            registerFormTitle: "Create an account",
            registerFormSub: "A few details and you can book your first job.",
            registerAltPrompt: "Already registered?",
            registerAltCta: "Back to sign in",
            registerLegalNote: "By registering you accept the QHaul terms of service and privacy policy. Personal data is handled under PIPEDA.",

            // Forgot password
            forgotFormTitle: "Reset your password",
            forgotFormSub: "Enter the email or phone on the account and we will send a reset link.",
            forgotAltPrompt: "Remembered it?",
            forgotAltCta: "Back to sign in",
            forgotLegalNote: "The reset link is valid for 15 minutes. If it does not arrive, check spam or write to support@qhaul.ca.",

            // Social
            socialGoogleLabel: "Google",
            socialWechatLabel: "WeChat",
        },
        "zh-CN": {
            or: "或使用以下方式",

            brandRealm: "QHaul 账户 · qhaul.ca realm",
            brandHeadline: "一个账户，管理你的每一次搬运。",
            brandBody: "登录后可查看历史订单、月结发票、常用地址与实时追踪。商务账户可管理团队成员权限。",
            brandTile1Value: "4,800+",
            brandTile1Label: "每月订单",
            brandTile2Value: "98%",
            brandTile2Label: "当日达成",
            brandTile3Value: "45 min",
            brandTile3Label: "平均上门",
            brandTile4Value: "GTA",
            brandTile4Label: "服务区域",

            loginFormTitle: "登录",
            loginFormSub: "使用邮箱、手机号或用户名登录 QHaul 账户。",
            loginAltPrompt: "还没有账户？",
            loginAltCta: "立即注册",
            loginLegalNote: "登录即表示同意 QHaul 服务条款与隐私政策。本页由 Keycloak 提供身份验证，qhaul.ca realm。",

            registerFormTitle: "注册账户",
            registerFormSub: "填写以下信息创建 QHaul 账户，注册后即可下单。",
            registerAltPrompt: "已有账户？",
            registerAltCta: "返回登录",
            registerLegalNote: "注册即表示同意 QHaul 服务条款与隐私政策。个人信息依据 PIPEDA 处理。",

            forgotFormTitle: "重置密码",
            forgotFormSub: "输入账户邮箱或手机号，我们会发送重置链接。",
            forgotAltPrompt: "想起密码了？",
            forgotAltCta: "返回登录",
            forgotLegalNote: "重置链接 15 分钟内有效。若未收到，请检查垃圾邮件或联系 support@qhaul.ca。",

            socialGoogleLabel: "Google",
            socialWechatLabel: "微信登录",
        },
        fr: {
            or: "Ou continuer avec",

            brandRealm: "Compte QHaul · domaine qhaul.ca",
            brandHeadline: "Un seul compte pour tous vos transports.",
            brandBody: "Connectez-vous pour consulter vos réservations, vos factures à terme, vos adresses enregistrées et le suivi en direct. Les comptes entreprise gèrent aussi les accès de l'équipe.",
            brandTile1Value: "4 800+",
            brandTile1Label: "Courses par mois",
            brandTile2Value: "98 %",
            brandTile2Label: "Jour même",
            brandTile3Value: "45 min",
            brandTile3Label: "Ramassage moyen",
            brandTile4Value: "RGT",
            brandTile4Label: "Zone desservie",

            loginFormTitle: "Connexion",
            loginFormSub: "Utilisez votre courriel, votre téléphone ou votre identifiant.",
            loginAltPrompt: "Pas encore de compte ?",
            loginAltCta: "Créer un compte",
            loginLegalNote: "En vous connectant, vous acceptez les conditions et la politique de confidentialité de QHaul. Authentification par Keycloak, domaine qhaul.ca.",

            registerFormTitle: "Créer un compte",
            registerFormSub: "Quelques informations et vous pouvez réserver votre première course.",
            registerAltPrompt: "Déjà inscrit ?",
            registerAltCta: "Retour à la connexion",
            registerLegalNote: "En vous inscrivant, vous acceptez les conditions et la politique de confidentialité de QHaul. Données traitées selon la LPRPDE.",

            forgotFormTitle: "Réinitialiser le mot de passe",
            forgotFormSub: "Indiquez le courriel ou le téléphone du compte ; nous enverrons un lien.",
            forgotAltPrompt: "Ça vous revient ?",
            forgotAltCta: "Retour à la connexion",
            forgotLegalNote: "Le lien est valide 15 minutes. S'il n'arrive pas, vérifiez les indésirables ou écrivez à support@qhaul.ca.",

            socialGoogleLabel: "Google",
            socialWechatLabel: "WeChat",
        },
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
