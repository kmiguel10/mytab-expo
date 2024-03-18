import { GetProps, View, XStack, styled } from "tamagui";

export const OuterContainer = styled(View, {
  backgroundColor: "whitesmoke",
});

export type OuterContainerProps = GetProps<typeof OuterContainer>;
