import { GetProps, YStack, styled } from "tamagui";

export const BodyContainer = styled(YStack, {
  borderRadius: "$6",
  backgroundColor: "white",
  elevation: 2,
});

export type BodyContainerProps = GetProps<typeof BodyContainer>;
