import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H4, H6, ScrollView, XStack } from "tamagui";
import { Transaction } from "@/types/global";

interface Props extends CardProps {
  transactions: Transaction[];
}

const TransactionInfoCard: React.FC<Props> = ({ transactions, ...props }) => {
  const windowWidth = Dimensions.get("window").width;
  return (
    <ScrollView>
      <XStack flex={1} flexWrap="wrap">
        {transactions.map((txn, index) => (
          <Card
            elevate
            size="$4"
            bordered
            key={index}
            width={windowWidth * 0.5}
            {...props}
          >
            <Card.Header padded>
              <XStack justifyContent="space-between">
                <H6>{txn.name}</H6>
                <H6>${txn.amount}</H6>
              </XStack>
            </Card.Header>
            <Card.Footer padded>
              <Text>Paid By: {txn.payerid?.slice(0, 5)}</Text>
            </Card.Footer>
          </Card>
        ))}
      </XStack>
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
