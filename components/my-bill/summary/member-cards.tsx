import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Card, CardProps, H4, H6, ScrollView, XStack, YStack } from "tamagui";

interface Props extends CardProps {
  members: { amountPaid: number; txnCount: number; userid: string }[];
  scaledHeight: number;
  scaledWidth: number;
}

const MemberCards: React.FC<Props> = ({
  members,
  scaledHeight,
  scaledWidth,
  ...props
}) => {
  const windowWidth = Dimensions.get("window").width;
  return (
    <ScrollView>
      <XStack
        flexWrap="wrap"
        backgroundColor={"white"}
        width={scaledWidth}
        justifyContent="center"
      >
        {members.map((member, index) => (
          <XStack
            padding="$1"
            backgroundColor={"white"}
            width={scaledWidth * 0.49}
            justifyContent="center"
            key={index}
          >
            <Card
              size="$3"
              bordered
              key={index}
              height={100}
              width={scaledWidth * 0.48}
              backgroundColor={"white"}
              elevate
              elevation={"$2"}
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

export default MemberCards;
