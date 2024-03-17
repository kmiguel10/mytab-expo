import { GetProps, YStack, styled } from "tamagui";

export const BodyContainer = styled(YStack, {
  borderRadius: "$6",
  backgroundColor: "white",
});

export type BodyContainerProps = GetProps<typeof BodyContainer>;
