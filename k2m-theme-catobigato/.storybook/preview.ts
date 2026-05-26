import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: "catobigato-cream",
            values: [{ name: "catobigato-cream", value: "#FAF5EC" }],
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
