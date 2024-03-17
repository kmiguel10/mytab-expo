import { GetProps, styled, XStack } from "tamagui";

export const FooterContainer = styled(XStack, {
  alignContent: "flex-end",
  backgroundColor: "$gray2Light",
  paddingLeft: "$4",
  paddingRight: "$4",
  paddingTop: "$2",
  opacity: 4,
});

export type FooterContainerProps = GetProps<typeof FooterContainer>;
