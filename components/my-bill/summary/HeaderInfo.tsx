import { View, Text } from "react-native";
import React from "react";
import { Card, CardProps, H2, H4, H5, XStack, YStack } from "tamagui";

interface Props extends CardProps {
  totalPaid: number;
  txnCount: number;
}

const HeaderInfo: React.FC<Props> = ({ totalPaid, txnCount, ...props }) => {
  return (
    <XStack alignContent="space-between" alignItems="center">
      <YStack>
        <Text>
          <H2>Test Bill</H2>
        </Text>
        <Text>
          <H2>Members</H2>
        </Text>
      </YStack>
      <YStack>
        <H4>{totalPaid}</H4>
        <Text>Total Amount</Text>
        <H4>{txnCount}</H4>
        <Text>Total Amount</Text>
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
