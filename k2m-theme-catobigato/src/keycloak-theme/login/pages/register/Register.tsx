import { useState, type LazyExoticComponent, type ComponentType } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "@keycloak-theme/layout/KcContext";
import type { I18n } from "@keycloak-theme/layout/i18n";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import RegisterForm from "./RegisterForm";

type Props = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyExoticComponent<ComponentType<UserProfileFormFieldsProps>>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    const termsAcceptanceRequired = false;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={advancedMsg("registerTitle")}
            displayInfo
            infoNode={
                <span style={{ color: "var(--cb-text-secondary)" }}>
                    {advancedMsg("haveAnAccount")}{" "}
                    <a href={kcContext.url.loginUrl} style={{ color: "var(--cb-purple-500)", fontWeight: 500 }}>
                        {advancedMsg("doLogIn")}
                    </a>
                </span>
            }
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
                termsAcceptanceRequired={termsAcceptanceRequired}
            />
        </Template>
    );
}
