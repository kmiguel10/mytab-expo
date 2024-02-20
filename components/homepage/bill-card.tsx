import React, { forwardRef } from "react";
import { Card, CardProps, H4, Paragraph, XStack, Button, Text } from "tamagui";
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
          <H4>${bill.name}</H4>
        </XStack>
        <Paragraph theme="alt2">{membership}</Paragraph>
        <Paragraph theme="alt2">{membership}</Paragraph>
      </Card.Header>

      <Card.Footer padded>
        <XStack flex={1} />
        {/* <Button borderRadius="$10">Purchase</Button> */}
        <Text>Members</Text>
      </Card.Footer>

      <Card.Background></Card.Background>
    </Card>
  );
};

export default forwardRef(BillCard);
