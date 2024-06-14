// import { GetProps, View, XStack, styled } from "tamagui";

// export const OuterContainer = styled(View, {
//   backgroundColor: "$gray3Light",
// });

// export type OuterContainerProps = GetProps<typeof OuterContainer>;

import { GetProps, styled } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

// Use LinearGradient instead of View for the OuterContainer
export const OuterContainer = styled(LinearGradient, {
  // You can define default props for the gradient here if you like
  colors: ["$gray2Light", "$gray2Light"], // Example colors, replace with your desired colors
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
});

export type OuterContainerProps = GetProps<typeof OuterContainer>;
