export const originalCssValues = {
  primary:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim() || "#ffb732",
  text:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-text")
      .trim() || "#35389b",
  fontSize:
    getComputedStyle(document.documentElement)
      .getPropertyValue("--text-text-size")
      .trim() || "22px",
  theme: "light" as "light" | "dark",
};

