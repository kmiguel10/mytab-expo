import { Dimensions } from "react-native";
import React from "react";
import { MemberSplitAmount } from "@/types/global";
import {
  Card,
  CardProps,
  H6,
  ListItem,
  ScrollView,
  View,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";

interface Props extends CardProps {
  memberSplits: MemberSplitAmount[];
  amount: string;
  isEven: boolean;
}

const SplitView: React.FC<Props> = ({
  memberSplits,
  amount,
  isEven,
  ...props
}) => {
  let amountNum = parseInt(amount);
  const splitEvenAmount = (_amount: number) => {
    return _amount / memberSplits.length;
  };
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <View height={windowHeight * 0.32}>
      <ScrollView>
        <XStack flexWrap="wrap" gap="$1" alignContent="center">
          {memberSplits.map((item, index) => (
            <Card
              elevate
              size="$2"
              bordered
              key={index}
              width={windowWidth * 0.44}
              {...props}
            >
              <Card.Header padded>
                <YStack>
                  <H6>{item.memberId.slice(0, 5)}</H6>
                  <H6>${item.amount}</H6>
                </YStack>
              </Card.Header>
            </Card>
          ))}
        </XStack>
      </ScrollView>
    </View>
  );
};

export default SplitView;
