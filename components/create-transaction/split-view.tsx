import { View, Text } from "react-native";
import React from "react";
import { MemberSplitAmount } from "@/types/global";
import { ListItem } from "tamagui";

interface Props {
  memberSplits: MemberSplitAmount[];
  amount: string;
  isEven: boolean;
}

const SplitView: React.FC<Props> = ({ memberSplits, amount, isEven }) => {
  let amountNum = parseInt(amount);
  const splitEvenAmount = (_amount: number) => {
    return _amount / memberSplits.length;
  };

  return (
    <View>
      <Text>SplitView</Text>
      {memberSplits.map((item, index) => (
        <ListItem key={index}>
          <Text>
            {item.memberId} :{" "}
            {isEven ? splitEvenAmount(amountNum) : item.amount}
          </Text>
        </ListItem>
      ))}
    </View>
  );
};

export default SplitView;
