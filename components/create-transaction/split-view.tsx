import {
  formatToDollarCurrency,
  truncateToTwoDecimalPlaces,
} from "@/lib/helpers";
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
  isEven: boolean;
}

const SplitView: React.FC<Props> = ({ memberSplits, isEven, ...props }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <View height={windowHeight * 0.32}>
      <ScrollView>
        <XStack flexWrap="wrap" gap="$1" alignContent="center">
          <YGroup alignSelf="center" width={"100%"} size="$5" gap="$1.5">
            {memberSplits.map((member, index) => (
              <YGroup.Item key={index}>
                <ListItem
                  bordered
                  key={index}
                  title={member.displayName}
                  icon={<Avatar url={member.avatarUrl} size="$3.5" />}
                  iconAfter={
                    <Text>
                      {formatToDollarCurrency(
                        truncateToTwoDecimalPlaces(
                          !!member.amount ? member.amount : 0
                        )
                      )}
                    </Text>
                  }
                />
              </YGroup.Item>
            ))}
          </YGroup>
        </XStack>
      </ScrollView>
    </View>
  );
};

export default SplitView;
