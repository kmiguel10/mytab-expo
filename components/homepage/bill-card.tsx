import { formatToDollarCurrency } from "@/lib/helpers";
import { MemberData } from "@/types/global";
import React, { forwardRef } from "react";

import {
  Card,
  CardProps,
  SizableText,
  useWindowDimensions,
  View,
  XStack,
} from "tamagui";
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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const cardWidth = windowWidth * 0.9;
  const cardHeight = windowHeight * 0.13;

  return (
    <Card
      bordered
      // backgroundColor="white"
      backgroundColor={
        bill.isMemberIncluded == false && bill.isRequestSent == true
          ? "$gray4Light"
          : "$backgroundTransparent"
      }
      borderRadius={"$5"}
      elevation={1}
      width={cardWidth}
      height={cardHeight}
      ref={ref}
      {...props}
    >
      <Card.Header>
        <XStack justifyContent="space-between">
          {/* <H5 fontFamily={"$heading"} maxWidth={"50%"} overflow="hidden">
            {bill.name}
          </H5> */}
          <SizableText size={"$5"} textOverflow="ellipsis">
            {bill.name}
          </SizableText>
          <SizableText size={"$6"} maxWidth={"50%"} overflow="hidden">
            {formatToDollarCurrency(bill.amount ? bill.amount : 0)}
          </SizableText>
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
            {bill.isFree && (
              <View
                backgroundColor={"$blue4Light"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                alignItems="center"
                borderRadius={"$12"}
              >
                <SizableText size={"$1"}>Free</SizableText>
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
                <SizableText fontSize={"$2"}>Pending</SizableText>
              </View>
            </XStack>
          )}
      </Card.Header>

      <Card.Footer padding="$3">
        {/* {membership !== "Owner" ? (
          <XStack flex={1} />
        ) : (
          <SizableText paddingTop={"$2"} flex={1}>
            Bill Code:{" "}
            <SizableText fontWeight={"800"}>{bill.billcode}</SizableText>
          </SizableText>
        )} */}
        <SizableText size={"$3"} paddingTop={"$2"} flex={1}>
          Bill Code:{" "}
          <SizableText size={"$2"} fontWeight={"800"}>
            {bill.billcode}
          </SizableText>
        </SizableText>
        {/* Edit appearance of multiple avatars */}
        <XStack backgroundColor={"red"} position="relative">
          {bill.memberUrls.map((url, index) => (
            <View
              key={`${url}-${index}`}
              right={index * 18}
              position="absolute"
            >
              <Avatar url={url} size="$3" />
            </View>
          ))}
        </XStack>
        {/* <ZStack justifyContent="flex-end" flex={1}>
          {bill.memberUrls.map((url, index) => (
            <View key={`${url}-${index}`} position="absolute" left={index * 20}>
              <Avatar url={url} size="$3" />
            </View>
          ))}
        </ZStack> */}
      </Card.Footer>
    </Card>
  );
};

export default forwardRef(BillCard);
