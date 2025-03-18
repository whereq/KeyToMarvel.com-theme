import { TextSize } from "./TailwindTypes";

// Map size values to Tailwind CSS classes
export const sizeToClass: Record<TextSize, string> = {
  [TextSize.SM]: "text-sm",
  [TextSize.MD]: "text-md",
  [TextSize.LG]: "text-lg",
  [TextSize.XL]: "text-xl",
  [TextSize.XL2]: "text-2xl",
  [TextSize.XL3]: "text-3xl",
  [TextSize.XL4]: "text-4xl",
};