import { config as configBase } from "@tamagui/config";
import { createTamagui } from "tamagui";

const customConfig = {
  ...configBase,
  fonts: {
    ...configBase.fonts,
    body: {
      ...configBase.fonts.body,
      family: "System", // Setting iOS system font for body
    },
    heading: {
      ...configBase.fonts.heading,
      family: "System", // Setting iOS system font for heading
    },
  },
};

export const config = createTamagui(customConfig);

export default config;

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
