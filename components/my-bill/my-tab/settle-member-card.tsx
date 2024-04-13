import React from "react";
import {
  Text,
  Card,
  CardProps,
  H4,
  H6,
  ScrollView,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";
import { MyTabInfo, SettleCardInfo, Transaction } from "@/types/global";
import { roundToNearestTenth } from "@/lib/helpers";

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
        {members?.map((member, index) => (
          <XStack
            padding="$1"
            backgroundColor={"transparent"}
            justifyContent="center"
            key={index}
          >
            <Card
              elevate
              shadowColor={"$backgroundTransparent"}
              size="$3"
              bordered
              key={index}
              width={windowWidth * 0.46}
              backgroundColor={
                member.owed - member.debt >= 0 ? "$green5Light" : "$red5Light"
              }
              {...props}
            >
              <Card.Header padded>
                <XStack justifyContent="space-between">
                  <Text paddingTop="$2">{member.member}</Text>
                  <H4
                    color={
                      member.owed - member.debt >= 0
                        ? "$green10Light"
                        : "$red10Light"
                    }
                  >
                    ${roundToNearestTenth(member.settleAmount)}
                  </H4>
                </XStack>
              </Card.Header>
              <YStack padding="$3">
                <XStack justifyContent="space-between">
                  <Text>Owes you: </Text>
                  <Text>${roundToNearestTenth(member.owed)}</Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text>You owe: </Text>
                  <Text>${roundToNearestTenth(member.debt)}</Text>
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
