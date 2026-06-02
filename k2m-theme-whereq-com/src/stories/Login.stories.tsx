import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../keycloak-theme/login/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "Login/Login",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { kcContext: {} },
};

export const WithSocialProviders: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    { alias: "google", displayName: "Google", loginUrl: "#", providerId: "google" },
                    { alias: "wechat", displayName: "WeChat", loginUrl: "#", providerId: "wechat" },
                ],
            },
        },
    },
};

export const WithError: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    { alias: "google", displayName: "Google", loginUrl: "#", providerId: "google" },
                    { alias: "wechat", displayName: "WeChat", loginUrl: "#", providerId: "wechat" },
                ],
            },
            login: { username: "mira@whereq.com" },
            messagesPerField: {
                printIfExists: <T,>(field: string, x: T) => (field === "username" ? x : undefined),
                existsError: (field: string) => field === "username" || field === "password",
                get: () => "Invalid username or password.",
                exists: () => true,
                getFirstError: () => "Invalid username or password.",
            },
        },
    },
};
