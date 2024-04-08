import Avatar from "@/components/login/avatar";
import { Member, Transaction } from "@/types/global";
import { Cloud, Moon, Star, Sun } from "@tamagui/lucide-icons";
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
  ListItem,
  YGroup,
  H2,
  H1,
} from "tamagui";

interface Props extends CardProps {
  transactions: Transaction[];
  members: Member[];
  currentUser: string;
}

const TransactionInfoCard: React.ForwardRefRenderFunction<
  HTMLDivElement,
  Props
> = ({ transactions, currentUser, members, ...props }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const findUserAvatar = (payerId: string | null) => {
    if (!payerId) return "";
    const member = members.find((member) => member.userid === payerId);

    return member ? member.avatar_url : "";
  };

  const findUserDisplayName = (payerId: string | null) => {
    if (!payerId) return "";
    const member = members.find((member) => member.userid === payerId);

    return member ? member.displayName : "";
  };

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
              <YGroup
                alignSelf="center"
                bordered
                width={windowWidth * 0.9}
                size="$4"
              >
                <YGroup.Item>
                  <ListItem
                    hoverTheme
                    icon={
                      <Avatar url={findUserAvatar(txn.payerid)} size="$4.5" />
                    }
                    title={txn.name}
                    subTitle={`Paid by: ${findUserDisplayName(txn.payerid)}`}
                    iconAfter={<H1>${txn.amount}</H1>}
                  />
                </YGroup.Item>
              </YGroup>

              {/* <Card
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
              </Card> */}
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
