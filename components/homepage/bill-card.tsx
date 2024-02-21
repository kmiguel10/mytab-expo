import React, { forwardRef } from "react";
import {
  Card,
  CardProps,
  H4,
  Paragraph,
  XStack,
  Button,
  Text,
  Avatar,
} from "tamagui";
import { BillData } from "@/types/global";

interface Props extends CardProps {
  bill: BillData;
  membership: string;
}

const BillCard: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { bill, membership, ...props },
  ref
) => {
  return (
    <Card elevate size="$4" bordered ref={ref} {...props}>
      <Card.Header padded>
        <XStack justifyContent="space-between">
          <H4>{bill.name}</H4>
          <H4>${bill.amount}</H4>
        </XStack>
        <Paragraph theme="alt2">{membership}</Paragraph>
        <Paragraph theme="alt2">{membership}</Paragraph>
      </Card.Header>

      <Card.Footer padded>
        <XStack flex={1} />
        {/* <Button borderRadius="$10">Purchase</Button> */}
        {/* <Text>Members</Text> */}
        <Avatar circular size="$2">
          <Avatar.Image
            accessibilityLabel="Nate Wienert"
            src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
          />
          <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
        </Avatar>
        <Avatar circular size="$2">
          <Avatar.Image
            accessibilityLabel="Nate Wienert"
            src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
          />
          <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
        </Avatar>
        <Avatar circular size="$2">
          <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
        </Avatar>
        <Text>...more</Text>
      </Card.Footer>

      <Card.Background></Card.Background>
    </Card>
  );
};

export default forwardRef(BillCard);
