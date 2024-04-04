/**
 * Variants:
 * 1. Error
 * 2. Normal
 */

import { Input, styled } from "tamagui";

export const StyledInput = styled(Input, {
  variants: {
    error: {
      true: {
        backgroundColor: "$red4Light",
        borderColor: "$red10Light",
      },
      false: {
        backgroundColor: "$backgroundTransparent",
      },
    },
  } as const,
});
