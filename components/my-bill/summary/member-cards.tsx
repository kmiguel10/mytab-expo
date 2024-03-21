import React from "react";
import {
  Text,
  View,
  Card,
  CardProps,
  H4,
  H6,
  ScrollView,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  return (
    <ScrollView>
      <XStack
        flex={1}
        flexWrap="wrap"
        gap="$1.5"
        backgroundColor={"transparent"}
        justifyContent="center"
        paddingBottom="$2"
      >
        {members.map((member, index) => (
          <XStack
            padding="$1"
            backgroundColor={"transparent"}
            justifyContent="center"
            key={index}
          >
            <Card
              elevate
              size="$2.5"
              bordered
              key={index}
              backgroundColor={"transparent"}
              width={windowWidth * 0.44}
              {...props}
            >
              <Card.Header padded>
                <XStack padding="$2" gap={"$1"}>
                  <Text>{member.userid.slice(0, 5)}</Text>
                </XStack>
                <XStack gap="$2" justifyContent="space-between">
                  <YStack padding="$2" gap={"$1"}>
                    <Text height={windowHeight * 0.03}>Count</Text>
                    <H6 height={windowHeight * 0.03}>{member.txnCount}</H6>
                  </YStack>
                  <YStack padding="$2" gap={"$1"}>
                    <Text height={windowHeight * 0.03}>Paid</Text>
                    <H6 height={windowHeight * 0.03}>${member.amountPaid}</H6>
                  </YStack>
                </XStack>
              </Card.Header>
              {/* <Card.Footer padded>
                <Text>{member.userid.slice(0, 5)}</Text>
              </Card.Footer> */}
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
