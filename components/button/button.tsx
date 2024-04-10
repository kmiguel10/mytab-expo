/**
 * Variants:
 * 1. Active
 * 2. Disabled
 */

import { Button, styled } from "tamagui";

export const StyledButton = styled(Button, {
  backgroundColor: "$gray6Light",
  variants: {
    active: {
      true: {
        backgroundColor: "$blue8Light",
        color: "white",
      },
      false: { backgroundColor: "$blue5Light", color: "white" },
    },
    create: {
      true: { backgroundColor: "$green8Light", color: "white" },
      false: { backgroundColor: "$green5Light", color: "white" },
    },
    delete: {
      true: { backgroundColor: "$red4Light", color: "white" },
    },
    decline: {
      true: { backgroundColor: "$red8Light", color: "white" },
    },
  } as const,
});
