import { BillInfo, Member } from "@/types/global";
import React from "react";
import {
  CardProps,
  H4,
  Text,
  View,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";
import MembersView from "../transactions/members-view";

interface Props extends CardProps {
  summaryInfo: { amountPaid: number; txnCount: number; userid: string }[];
  billName: string;
  height: number;
  width: number;
}

const HeaderInfo: React.FC<Props> = ({
  summaryInfo,
  billName,
  height,
  width,
  ...props
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
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
    <YStack justifyContent="space-evenly" gap="$3" padding="$2">
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View>
          <Text>Bill Name</Text>
          <H4 height={height * 0.25} width={windowWidth * 0.35}>
            {billName}
          </H4>
        </View>
      </XStack>
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View>
          <Text>Total Amount</Text>
          <H4 height={height * 0.25} width={windowWidth * 0.35}>
            ${totalPaid}
          </H4>
        </View>
        <View>
          <Text>Transactions</Text>
          <H4 height={height * 0.25} width={windowWidth * 0.35}>
            {txnCount}
          </H4>
        </View>
      </XStack>
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
    </YStack>
  );
};

export default HeaderInfo;
