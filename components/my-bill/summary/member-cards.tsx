import { View, Text } from "react-native";
import React from "react";
import { Card, CardProps, H4, ScrollView, XStack } from "tamagui";

interface Props extends CardProps {
  members: { amountPaid: number; txnCount: number; userid: string }[];
}

const MemberCards: React.FC<Props> = ({ members, ...props }) => {
  return (
    <ScrollView>
      {members.map((member, index) => (
        <Card elevate size="$4" key={index} bordered {...props}>
          <Card.Header padded>
            <XStack alignContent="space-between" justifyContent="space-between">
              <H4>{member.userid.slice(0, 5)}</H4>
              <H4>${member.amountPaid}</H4>
              <H4>{member.txnCount}</H4>
            </XStack>
          </Card.Header>
        </Card>
      ))}
    </ScrollView>
  );
};

export default MemberCards;
