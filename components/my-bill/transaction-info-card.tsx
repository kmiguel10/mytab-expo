import { View, Text } from "react-native";
import React from "react";
import { Card, CardProps, H4, ScrollView, XStack } from "tamagui";
import { Transaction } from "@/types/global";

interface Props extends CardProps {
  transactions: Transaction[];
}

const TransactionInfoCard: React.FC<Props> = ({ transactions, ...props }) => {
  return (
    <ScrollView>
      {transactions.map((txn, index) => (
        <Card elevate size="$4" bordered {...props}>
          <Card.Header padded>
            <XStack justifyContent="space-between">
              <H4>{txn.name}</H4>
              <H4>${txn.amount}</H4>
            </XStack>
          </Card.Header>
          <Card.Footer padded>
            <Text>Paid By: {txn.payerid?.slice(0, 5)}</Text>
          </Card.Footer>
        </Card>
      ))}
    </ScrollView>

    // <View>
    //   <Text>TransactionIndoCard</Text>
    //   {transactions.map((txn, index) => (
    //     <Text key={index}>{JSON.stringify(txn)}</Text>
    //   ))}
    // </View>
  );
};

export default TransactionInfoCard;
