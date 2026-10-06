import { useState, type LazyExoticComponent, type ComponentType } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { QhTemplateProps } from "@keycloak-theme/layout/Template";
import QhBrandPanel from "@keycloak-theme/layout/QhBrandPanel";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import RegisterForm from "./RegisterForm";

type MsgKey = Parameters<I18n["msgStr"]>[0];

type Props = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyExoticComponent<ComponentType<UserProfileFormFieldsProps>>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: Props) {
    const {
        kcContext,
        i18n,
        doUseDefaultCss,
        Template,
        classes,
        UserProfileFormFields,
        doMakeUserConfirmPassword,
    } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    const TemplateComp = Template as React.ComponentType<QhTemplateProps>;

    return (
        <TemplateComp
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msgStr("registerFormTitle" as MsgKey)}
            subtitleNode={msgStr("registerFormSub" as MsgKey)}
            displayInfo
            infoNode={
                <>
                    <span>{msgStr("registerAltPrompt" as MsgKey)}</span>
                    <a href={kcContext.url.loginUrl} style={{ color: "var(--qh-accent)", fontWeight: 700 }}>
                        {msgStr("registerAltCta" as MsgKey)}
                    </a>
                </>
            }
            legalNode={msgStr("registerLegalNote" as MsgKey)}
            layoutVariant="split"
            leftPanelNode={<QhBrandPanel i18n={i18n} />}
        >
            <RegisterForm
                kcContext={kcContext}
                i18n={i18n}
                kcClsx={kcClsx}
                UserProfileFormFields={UserProfileFormFields}
                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                isFormSubmittable={isFormSubmittable}
                setIsFormSubmittable={setIsFormSubmittable}
                areTermsAccepted={areTermsAccepted}
                setAreTermsAccepted={setAreTermsAccepted}
                termsAcceptanceRequired={false}
            />
        </TemplateComp>
    );
}
