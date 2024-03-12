import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H2, H3, H4, H5, XStack, YStack } from "tamagui";
import { BillInfo } from "@/types/global";
import MembersView from "../transactions/members-view";

interface Props extends CardProps {
  summaryInfo: { amountPaid: number; txnCount: number; userid: string }[];
  billInfo: BillInfo[];
  members: any[];
}

const HeaderInfo: React.FC<Props> = ({
  summaryInfo,
  billInfo,
  members,
  ...props
}) => {
  const windowWidth = Dimensions.get("window").width;
  // Calculate total paid amount and total transaction count
  const totalPaid = summaryInfo.reduce(
    (total, info) => total + info.amountPaid,
    0
  );
  const txnCount = summaryInfo.reduce(
    (total, info) => total + info.txnCount,
    0
  );
  return (
    <XStack alignContent="space-between" alignItems="center" gap="$3">
      <YStack width={windowWidth * 0.5} gap="$2">
        <View>
          <Text>Bill Name</Text>
          <H4>{billInfo[0]?.name}</H4>
        </View>
        <View>
          <Text>Members</Text>
          <MembersView members={members} />
        </View>
      </YStack>
      <YStack width={windowWidth * 0.5} gap="$2">
        <View>
          <Text>Total Amount</Text>
          <H4>{totalPaid}</H4>
        </View>
        <View>
          <Text>Total Count</Text>
          <H4>{txnCount}</H4>
        </View>
      </YStack>
      {/* <Card elevate size="$4" bordered flex={1} {...props}>
        <Card.Header padded></Card.Header>
        <H4>{totalPaid}</H4>
      </Card>
      <Card elevate size="$4" bordered flex={1} {...props}>
        <Card.Header padded>
          <Text>Txn Count</Text>
        </Card.Header>
      </Card> */}
      {/* <Text>
          {totalPaid} | {txnCount}
        </Text> */}
    </XStack>
  );
};

export default HeaderInfo;
