import React, { forwardRef } from "react";
import {
  Card,
  CardProps,
  H4,
  Paragraph,
  XStack,
  Button,
  Text,
  View,
} from "tamagui";
import { BillData, MemberData } from "@/types/global";
import Avatar from "../login/avatar";

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
        {membership === "Member" &&
          bill.isMemberIncluded == false &&
          bill.isRequestSent == true && <Text theme="alt2">Pending</Text>}
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
          {bill.memberUrls.map((url, index) => (
            <View key={`${url}-${index}`}>
              <Avatar url={url} isMemberIcon={true} />
            </View>
          ))}
        </XStack>
      </Card.Footer>
      {/* <Text>{JSON.stringify(bill)}</Text> */}
      <Card.Background></Card.Background>
    </Card>
  );
};

export default forwardRef(BillCard);
