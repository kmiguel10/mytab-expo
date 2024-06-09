import { MemberData } from "@/types/global";
import React, { forwardRef } from "react";
import {
  Card,
  CardProps,
  H4,
  H5,
  H6,
  SizableText,
  Text,
  View,
  XStack,
} from "tamagui";
import Avatar from "../login/avatar";
import { formatToDollarCurrency } from "@/lib/helpers";

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
          {/* <H5 fontFamily={"$heading"} maxWidth={"50%"} overflow="hidden">
            {bill.name}
          </H5> */}
          <H5 size={"$4"} textOverflow="ellipsis">
            {bill.name}
          </H5>
          <H4 maxWidth={"50%"} overflow="hidden">
            {formatToDollarCurrency(bill.amount ? bill.amount : 0)}
          </H4>
        </XStack>
        {bill.isMemberIncluded && (
          <XStack gap="$1">
            <SizableText theme="alt2" size="$2">
              {membership}
            </SizableText>
            {bill.isLocked && (
              <View
                backgroundColor={"$red4Light"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                alignItems="center"
                borderRadius={"$12"}
              >
                <SizableText size={"$1"}>Locked</SizableText>
              </View>
            )}
            {/* <View
              backgroundColor={"$yellow4Light"}
              paddingHorizontal={"$2"}
              paddingVertical={"$1"}
              alignItems="center"
              borderRadius={"$12"}
            >
              <SizableText size={"$1"}>Expires Today</SizableText>
            </View> */}
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
                <SizableText fontSize={"$2"}>Pending</SizableText>
              </View>
            </XStack>
          )}
      </Card.Header>

      <Card.Footer padding="$3">
        {membership !== "Owner" ? (
          <XStack flex={1} />
        ) : (
          <SizableText paddingTop={"$2"} flex={1}>
            Bill Code:{" "}
            <SizableText fontWeight={"800"}>{bill.billcode}</SizableText>
          </SizableText>
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
