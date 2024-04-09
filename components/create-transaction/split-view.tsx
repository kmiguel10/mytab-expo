import { MemberSplitAmount } from "@/types/global";
import React from "react";
import {
  CardProps,
  ListItem,
  ScrollView,
  Text,
  View,
  XStack,
  YGroup,
  useWindowDimensions,
} from "tamagui";
import Avatar from "../login/avatar";

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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <View height={windowHeight * 0.32}>
      <ScrollView>
        <XStack flexWrap="wrap" gap="$1" alignContent="center">
          {memberSplits.map((member, index) => (
            <YGroup
              alignSelf="center"
              bordered
              width={"100%"}
              size="$5"
              padding={"$1"}
            >
              <YGroup.Item>
                <ListItem
                  title={member.displayName}
                  icon={<Avatar url={member.avatarUrl} size="$3.5" />}
                  iconAfter={<Text>${member.amount}</Text>}
                />
              </YGroup.Item>
            </YGroup>
          ))}
        </XStack>
      </ScrollView>
    </View>
  );
};

export default SplitView;
