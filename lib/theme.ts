import { getCookie, setCookie } from "cookies-next";
import type { OptionsType } from "cookies-next";

export const getServerTheme = (options?: OptionsType): "light" | "dark" => {
  const savedTheme = getCookie("theme", options) as
    | "light"
    | "dark"
    | undefined;

  console.log("this is the theme from cooke", savedTheme);

  return savedTheme || "light";
};

export const setTheme = (theme: "light" | "dark", options?: OptionsType) => {
  setCookie("theme", theme, {
    ...options,
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
};
