import { GetProps, YStack, styled } from "tamagui";

export const HeaderContainer = styled(YStack, {
  name: "HeaderContainer",
  backgroundColor: "white",
  padding: "$2",
  borderRadius: "$6",
});

export type HeaderContainerProps = GetProps<typeof HeaderContainer>;
