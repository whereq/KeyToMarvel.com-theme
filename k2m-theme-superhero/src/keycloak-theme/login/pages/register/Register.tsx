import { JSX, useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "@keycloak-theme/login/KcContext";
import type { I18n } from "@keycloak-theme/login/i18n";
import RegisterForm from "./RegisterForm";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader } = kcContext;
    const { msg, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={kcContext.messagesPerField.exists("global")}
            displayRequiredFields={false}
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
            />
        </Template>
    );
}