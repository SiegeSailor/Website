import { heroui } from "@heroui/react";

export default heroui({
  defaultTheme: "light",
  defaultExtendTheme: "light",
  layout: {
    disabledOpacity: "0.4",
    borderWidth: {
      small: "0.0625rem",
      medium: "0.0625rem",
      large: "0.0625rem",
    },
    radius: {
      small: "0.5rem",
      medium: "0.5rem",
      large: "0.5rem",
    },
  },
});
