import { GetProps, View, XStack, styled } from "tamagui";

export const OuterContainer = styled(View, {
  backgroundColor: "$gray3Light",
});

export type OuterContainerProps = GetProps<typeof OuterContainer>;
