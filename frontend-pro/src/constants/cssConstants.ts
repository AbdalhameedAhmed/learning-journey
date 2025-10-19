import type { FontSize } from "@schemas/Settings";

export const originalCssValues = {
  primary:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim() || "#ffb732",
  darkPrimary:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-dark-primary")
      .trim() || "#ffb732",
  text:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-text")
      .trim() || "#35389b",
  darkText:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-dark-text")
      .trim() || "#ffffff",
  fontSize: (getComputedStyle(document.documentElement)
    .getPropertyValue("--text-text-normal")
    .trim() || "medium") as FontSize,
  theme: "light" as "light" | "dark",
};

export const sizeValues = {
  small: "24px",
  medium: "28px",
  large: "32px",
};
