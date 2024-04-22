import Avatar from "@/components/login/avatar";
import { SummaryInfo } from "@/types/global";
import React from "react";
import {
  CardProps,
  H1,
  ListItem,
  ScrollView,
  useWindowDimensions,
  XStack,
  YGroup,
} from "tamagui";

interface Props extends CardProps {
  members: SummaryInfo[];
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
  function findUserAvatar(payerid: any) {
    throw new Error("Function not implemented.");
  }

  function findUserDisplayName(payerid: any) {
    throw new Error("Function not implemented.");
  }

  /**
   * Need to be able to save the avatars and pass it down, the use useMemo
   */
  return (
    <ScrollView>
      <XStack
        flex={1}
        flexWrap="wrap"
        gap="$0.5"
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
            <YGroup
              alignSelf="center"
              bordered
              width={windowWidth * 0.9}
              size="$4"
            >
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  icon={<Avatar url={member.avatar_url} size="$4.5" />}
                  title={member.displayName}
                  subTitle={`Transaction Count: ${member.txnCount}`}
                  iconAfter={<H1>${member.amountPaid}</H1>}
                />
              </YGroup.Item>
            </YGroup>
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
