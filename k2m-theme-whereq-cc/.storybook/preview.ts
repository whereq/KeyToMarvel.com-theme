import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
    parameters: {
        layout: "fullscreen",
        backgrounds: {
            default: "whereq-dark",
            values: [
                { name: "whereq-dark", value: "#0A0E13" },
                { name: "whereq-light", value: "#F4F5F7" },
            ],
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
