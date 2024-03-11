import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H4, H6, ScrollView, XStack, YStack } from "tamagui";

interface Props extends CardProps {
  members: { amountPaid: number; txnCount: number; userid: string }[];
}

const MemberCards: React.FC<Props> = ({ members, ...props }) => {
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
        {members.map((member, index) => (
          <XStack
            padding="$1"
            backgroundColor={"whitesmoke"}
            width={windowWidth * 0.49}
            justifyContent="center"
            key={index}
          >
            <Card
              elevate
              size="$3"
              bordered
              key={index}
              height={100}
              width={windowWidth * 0.48}
              {...props}
            >
              <Card.Header padded>
                <XStack
                  alignContent="space-between"
                  justifyContent="space-between"
                >
                  <YStack>
                    <Text>Count</Text>
                    <H6>{member.txnCount}</H6>
                  </YStack>
                  <YStack>
                    <Text>Paid</Text>
                    <H6>${member.amountPaid}</H6>
                  </YStack>
                </XStack>
              </Card.Header>
              <XStack></XStack>
              <Card.Footer padded>
                <Text>{member.userid.slice(0, 5)}</Text>
              </Card.Footer>
            </Card>
          </XStack>
        ))}
      </XStack>
    </ScrollView>
  );
};

export default MemberCards;
