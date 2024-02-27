import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H4, H6, ScrollView, XStack } from "tamagui";
import { MyTabInfo, SettleCardInfo, Transaction } from "@/types/global";

interface Props extends CardProps {
  members: SettleCardInfo[] | null;
}

const SettleMemberCard: React.FC<Props> = ({ members, ...props }) => {
  const windowWidth = Dimensions.get("window").width;
  return (
    <ScrollView>
      <XStack flex={1} flexWrap="wrap">
        {members?.map((member, index) => (
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
            <Card.Footer padded>
              <Text>Owes you: {member.owed}</Text>
              <Text>You owe: {member.debt}</Text>
            </Card.Footer>
          </Card>
        ))}
      </XStack>
    </ScrollView>
  );
};

export default SettleMemberCard;
