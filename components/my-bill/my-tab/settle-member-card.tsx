import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H4, H6, ScrollView, XStack, YStack } from "tamagui";
import { MyTabInfo, SettleCardInfo, Transaction } from "@/types/global";

interface Props extends CardProps {
  members: SettleCardInfo[];
  scaledHeight: number;
  scaledWidth: number;
}

const SettleMemberCard: React.FC<Props> = ({
  members,
  scaledHeight,
  scaledWidth,
  ...props
}) => {
  return (
    <ScrollView>
      <XStack
        flex={1}
        flexWrap="wrap"
        space="$1"
        backgroundColor={"white"}
        width={scaledWidth}
        justifyContent="center"
      >
        {members?.map((member, index) => (
          <XStack
            padding="$1"
            backgroundColor={"white"}
            width={scaledWidth * 0.49}
            justifyContent="center"
            key={index}
          >
            <Card
              elevate
              shadowColor={"white"}
              size="$3"
              bordered
              key={index}
              height={100}
              width={scaledWidth * 0.48}
              backgroundColor={
                member.owed - member.debt >= 0 ? "$green5Light" : "$red5Light"
              }
              {...props}
            >
              <Card.Header padded>
                <XStack justifyContent="space-between">
                  <H6>{member.member.slice(0, 5)}</H6>
                  <H6
                    color={
                      member.owed - member.debt >= 0
                        ? "$green10Light"
                        : "$red10Light"
                    }
                  >
                    ${member.settleAmount}
                  </H6>
                </XStack>
              </Card.Header>
              <YStack padding="$3">
                <XStack justifyContent="space-between">
                  <Text>Owes you: </Text>
                  <Text>{member.owed}</Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text>You owe: </Text>
                  <Text>{member.debt}</Text>
                </XStack>
              </YStack>
              {/* <Card.Footer padded></Card.Footer> */}
            </Card>
          </XStack>
        ))}
        {members.length % 2 !== 0 && (
          <XStack
            padding="$1"
            backgroundColor={"white"}
            width={scaledWidth * 0.49}
            justifyContent="center"
          ></XStack>
        )}
      </XStack>
    </ScrollView>
  );
};

export default SettleMemberCard;
