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
      <XStack
        flex={1}
        flexWrap="wrap"
        space="$1"
        backgroundColor={"whitesmoke"}
        width={windowWidth}
        justifyContent="center"
      >
        {transactions.map((txn, index) => (
          <XStack
            padding="$1"
            backgroundColor={"whitesmoke"}
            width={windowWidth * 0.49}
            justifyContent="center"
            key={index}
          >
            <Card
              elevate
              size="$4"
              bordered
              key={index}
              height={100}
              width={windowWidth * 0.48}
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
          </XStack>
        ))}
        {/** Creates an extra card to even out spacing */}
        {transactions.length % 2 !== 0 && (
          <XStack
            padding="$1"
            backgroundColor={"whitesmoke"}
            width={windowWidth * 0.49}
            justifyContent="center"
          ></XStack>
        )}
      </XStack>
    </ScrollView>
  );
};

export default TransactionInfoCard;
