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
import { BillData, MemberData } from "@/types/global";

interface Props extends CardProps {
  bill: MemberData;
  membership: string;
}

/**
 * Shows Bills information: name, membership status, members, amount in bill
 * @param param0
 * @param ref
 * @returns
 */
const BillCard: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { bill, membership, ...props },
  ref
) => {
  return (
    <Card
      bordered
      ref={ref}
      {...props}
      backgroundColor="white"
      borderRadius={"$5"}
    >
      <Card.Header>
        <XStack justifyContent="space-between">
          <H4 fontFamily={"$heading"} maxWidth={"50%"} overflow="hidden">
            {bill.name}
          </H4>
          <H4>${bill.amount}</H4>
        </XStack>
        <Text theme="alt2">{membership}</Text>
        {bill.isMemberIncluded == false && bill.isRequestSent == true && (
          <Text theme="alt2">Pending</Text>
        )}
      </Card.Header>

      <Card.Footer padding="$3">
        {membership !== "Owner" ? (
          <XStack flex={1} />
        ) : (
          <Text paddingTop={"$2"} flex={1}>
            Bill Code: {bill.billcode}
          </Text>
        )}

        <XStack justifyContent="center">
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
        </XStack>
      </Card.Footer>
      <Card.Background></Card.Background>
    </Card>
  );
};

export default forwardRef(BillCard);
