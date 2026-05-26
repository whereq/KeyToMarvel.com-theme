import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../keycloak-theme/login/KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" });

const meta = {
    title: "Login/Error",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        kcContext: {
            message: {
                type: "error",
                summary: "An unexpected error occurred.",
            },
            client: {
                baseUrl: "https://catobigato.com",
            },
        },
    },
};

export const RegistrationNotAllowed: Story = {
    args: {
        kcContext: {
            message: {
                type: "error",
                summary: "Registration not allowed.",
            },
            client: {
                baseUrl: "https://catobigato.com",
            },
        },
    },
};

export const SessionExpired: Story = {
    args: {
        kcContext: {
            message: {
                type: "error",
                summary: "Your session has expired.",
            },
            client: {
                baseUrl: "https://catobigato.com",
            },
        },
    },
};

export const NoBackUrl: Story = {
    args: {
        kcContext: {
            message: {
                type: "error",
                summary: "Access denied.",
            },
            client: undefined,
        },
    },
};
