import Avatar from "@/components/login/avatar";
import { findUserAvatar } from "@/lib/helpers";
import { SummaryInfo, Transaction } from "@/types/global";
import { useState } from "react";
import {
  XStack,
  Text,
  Sheet,
  YGroup,
  useWindowDimensions,
  ListItem,
  View,
  H1,
  H3,
  H6,
  H4,
  ScrollView,
} from "tamagui";

interface Props {
  userTransactions: Transaction[];
  selectedMember: SummaryInfo | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * NOTES:
 * 1. Handle scenarios where transaction is 0
 * 2. Handle closing of sheet
 */
const UserTransactions: React.FC<Props> = ({
  userTransactions,
  selectedMember,
  open,
  setOpen,
}) => {
  /** - - - - - - - - State Variables - - - - - - - - */
  const [position, setPosition] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  /** - - - - - - - - functions - - - - - - - - */

  /** - - - - - - - - useEffects - - - - - - - - */

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => setOpen(!open)}
      snapPoints={[60]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$2">
        <XStack
          paddingBottom="$4"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$3"
        >
          <Avatar url={selectedMember?.avatar_url || null} size={"$6"} />
          <View>
            <Text>Total Amount Spent</Text>
            <H4>${selectedMember?.amountPaid}</H4>
          </View>
        </XStack>
        <ScrollView backgroundColor={"$backgroundTransparent"}>
          {userTransactions.map((txn, index) => (
            <YGroup
              alignSelf="center"
              bordered
              width={windowWidth * 0.9}
              size="$4"
              key={index}
            >
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  title={<Text fontSize={"$4"}>{txn.name}</Text>}
                  iconAfter={<Text fontSize={"$4"}>${txn.amount}</Text>}
                />
              </YGroup.Item>
            </YGroup>
          ))}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default UserTransactions;
