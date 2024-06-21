import Avatar from "@/components/login/avatar";
import { formatToDollarCurrency } from "@/lib/helpers";
import { SummaryInfo, Transaction } from "@/types/global";
import { XCircle } from "@tamagui/lucide-icons";
import { useState } from "react";
import {
  ListItem,
  ScrollView,
  Sheet,
  SizableText,
  Text,
  View,
  XStack,
  YGroup,
  YStack,
  useWindowDimensions,
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
      disableDrag={true}
    >
      <Sheet.Overlay
        animation="100ms"
        enterStyle={{ opacity: 8 }}
        exitStyle={{ opacity: 8 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$2">
        <XStack justifyContent="flex-end">
          <XCircle onPress={() => setOpen(false)} />
        </XStack>
        <XStack
          paddingBottom="$4"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$3"
        >
          <YStack alignItems="center" gap="$1">
            <Avatar url={selectedMember?.avatar_url || null} size={"$6"} />
            <SizableText>{selectedMember?.displayName}</SizableText>
          </YStack>

          <View>
            <SizableText>Total Spent</SizableText>
            <SizableText size="$6">
              {formatToDollarCurrency(selectedMember?.amountPaid || 0)}
            </SizableText>
          </View>
        </XStack>
        <ScrollView backgroundColor={"$backgroundTransparent"} bounces={false}>
          <YGroup
            alignSelf="center"
            width={windowWidth * 0.9}
            size="$4"
            gap="$1"
          >
            {userTransactions.map((txn, index) => (
              <YGroup.Item>
                <ListItem
                  bordered
                  key={index}
                  hoverTheme
                  title={<Text fontSize={"$4"}>{txn.name}</Text>}
                  iconAfter={
                    <Text fontSize={"$4"}>
                      {formatToDollarCurrency(txn.amount)}
                    </Text>
                  }
                />
              </YGroup.Item>
            ))}
          </YGroup>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default UserTransactions;
