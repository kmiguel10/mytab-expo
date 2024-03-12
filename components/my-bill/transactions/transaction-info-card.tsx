import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H4, H6, ScrollView, XStack } from "tamagui";
import { Member, Transaction } from "@/types/global";
import { Link } from "expo-router";

interface Props extends CardProps {
  transactions: Transaction[];

  currentUser: string;
}

const TransactionInfoCard: React.FC<Props> = ({
  transactions,
  currentUser,
  ...props
}) => {
  const windowWidth = Dimensions.get("window").width;
  return (
    <ScrollView>
      <XStack
        flex={1}
        flexWrap="wrap"
        space="$1"
        backgroundColor={"transparent"}
        justifyContent="center"
      >
        {transactions.map((txn, index) => (
          <XStack
            padding="$1"
            backgroundColor={"transparent"}
            justifyContent="center"
            key={index}
          >
            <Link
              href={{
                pathname: `/pages/edit-transaction`,
                params: {
                  txnId: txn.id,
                  billId: txn.billid,
                  currentUser: currentUser,
                },
              }}
              asChild
            >
              {/* <Text>Tab Two: {currentUser}</Text> */}
              <Card
                elevate
                size="$3"
                bordered
                key={index}
                height={100}
                backgroundColor={"transparent"}
                width={windowWidth * 0.46}
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
            </Link>
          </XStack>
        ))}
        {/** Creates an extra card to even out spacing */}
        {transactions.length % 2 !== 0 && (
          <XStack
            padding="$1"
            backgroundColor={"transparent"}
            width={windowWidth * 0.46}
            justifyContent="center"
          ></XStack>
        )}
      </XStack>
    </ScrollView>
  );
};

export default TransactionInfoCard;
