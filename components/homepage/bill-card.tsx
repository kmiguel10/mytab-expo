import { MemberData } from "@/types/global";
import React, { forwardRef } from "react";
import { Card, CardProps, H4, Text, View, XStack } from "tamagui";
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
        {bill.isMemberIncluded && (
          <XStack gap="$1">
            <Text theme="alt2">{membership}</Text>
            {bill.isLocked && (
              <View
                backgroundColor={"$red4Light"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                alignItems="center"
                borderRadius={"$12"}
              >
                <Text fontSize={"$2"}>Locked</Text>
              </View>
            )}
          </XStack>
        )}

        {membership === "Member" &&
          bill.isMemberIncluded == false &&
          bill.isRequestSent == true && (
            <XStack gap="$1">
              <View
                backgroundColor={"$yellow4Light"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                alignItems="center"
                borderRadius={"$12"}
              >
                <Text fontSize={"$2"}>Pending</Text>
              </View>
            </XStack>
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
          {bill.memberUrls.map((url, index) => (
            <View key={`${url}-${index}`}>
              <Avatar url={url} size="$3" />
            </View>
          ))}
        </XStack>
      </Card.Footer>
    </Card>
  );
};

export default forwardRef(BillCard);
