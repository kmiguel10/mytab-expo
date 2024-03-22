import { Transaction } from "@/types/global";
import { Link } from "expo-router";
import React from "react";
import { Dimensions } from "react-native";
import {
  Card,
  CardProps,
  H6,
  ScrollView,
  XStack,
  YStack,
  useWindowDimensions,
  Text,
  H3,
  H4,
  View,
  H5,
} from "tamagui";

interface Props extends CardProps {
  transactions: Transaction[];
  currentUser: string;
}

const TransactionInfoCard: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = ({ transactions, currentUser, ...props }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  return (
    <ScrollView>
      <XStack
        flex={1}
        flexWrap="wrap"
        gap="$1"
        backgroundColor={"transparent"}
        justifyContent="center"
        paddingBottom="$2"
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
                  txnId: txn.id || "",
                  billId: txn.billid,
                  currentUser: currentUser,
                },
              }}
              asChild
            >
              {/* <Text>Tab Two: {currentUser}</Text> */}
              <Card
                elevate
                size="$2.5"
                bordered
                key={index}
                backgroundColor={"transparent"}
                width={windowWidth * 0.46}
                {...props}
              >
                <Card.Header>
                  <View gap="$2">
                    <XStack justifyContent="flex-end" padding="$2">
                      <H4 height={windowHeight * 0.03} alignContent="flex-end">
                        ${txn.amount}
                      </H4>
                    </XStack>
                    <YStack padding="$2" gap={"$1"}>
                      <H5 height={windowHeight * 0.03}>{txn.name}</H5>
                      <Text height={windowHeight * 0.03}>
                        Paid By: {txn.payerid?.slice(0, 5)}
                      </Text>
                    </YStack>
                  </View>
                </Card.Header>
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
