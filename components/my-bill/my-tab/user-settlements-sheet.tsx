import Avatar from "@/components/login/avatar";
import { SettlementInfo } from "@/types/global";
import { SeparatorHorizontal } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import {
  H1,
  H3,
  H4,
  H6,
  ListItem,
  ScrollView,
  Separator,
  Sheet,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMemberSettlements: SettlementInfo[] | null;
  currentUserSettlements: SettlementInfo[] | null;
  currentUserUrl: string;
  selectedUserUrl: string;
  currentUserName: string;
  selectedUserName: string;
}

const UserSettlementsSheet: React.FC<Props> = ({
  open,
  setOpen,
  selectedMemberSettlements,
  currentUserSettlements,
  currentUserUrl,
  selectedUserUrl,
  currentUserName,
  selectedUserName,
}) => {
  /** - - - - - - - - State Variables - - - - - - - - */
  const [position, setPosition] = useState(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [currentUserSettlementSum, setCurrentUserSettlementSum] = useState(0);
  const [selectedMemberSettlementSum, setSelectedMemberSettlementSum] =
    useState(0);

  const [settlementAmount, setSettlementAmount] = useState(0);

  let _selectedUserSettlementSum: number = 0;
  let _currentUserSettlementSum: number = 0;

  /** - - - - - - - - functions - - - - - - - - */

  /** - - - - - - - - helper - - - - - - - - */

  /**
   * Adds the sum of the transactions in settlement info
   * @param settlementInfo
   */
  const getTransactionsSum = (settlementInfo: SettlementInfo[]): number => {
    return settlementInfo.reduce(
      (total, info) => total + info.userSplitAmount,
      0
    );
  };

  /** - - - - - - - - useEffects - - - - - - - - */
  useEffect(() => {
    if (currentUserSettlements) {
      _currentUserSettlementSum = getTransactionsSum(currentUserSettlements);
      setCurrentUserSettlementSum(_currentUserSettlementSum);
    }

    if (selectedMemberSettlements) {
      _selectedUserSettlementSum = getTransactionsSum(
        selectedMemberSettlements
      );
      setSelectedMemberSettlementSum(_selectedUserSettlementSum);
    }

    setSettlementAmount(_currentUserSettlementSum - _selectedUserSettlementSum);
  }, [selectedMemberSettlements, currentUserSettlements]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => setOpen(!open)}
      snapPoints={[80]}
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
        <ScrollView>
          <H4 paddingBottom="$4">Settlement with {selectedUserName}</H4>
          <XStack justifyContent="space-between" paddingBottom="$4">
            <XStack alignItems="center" width={"50%"}>
              <Text textAlign="left">
                {<Text>{currentUserName}</Text>} owes {selectedUserName}
              </Text>
            </XStack>
            <YStack>
              <Text>Settlement Amount</Text>
              <H3 textAlign="right">
                {settlementAmount < 0 ? (
                  <H3 color={"$red10Light"}>${Math.abs(settlementAmount)}</H3>
                ) : (
                  <H3 color={"$green10Light"}>{Math.abs(settlementAmount)}</H3>
                )}
              </H3>
            </YStack>
          </XStack>
          <Separator />
          <XStack
            justifyContent="space-between"
            paddingBottom="$4"
            paddingTop="$4"
          >
            <Avatar url={selectedUserUrl || null} size={"$5"} />
            <YStack>
              <Text>Total Amount</Text>
              <H3 textAlign="right" color={"$red10Light"}>
                ${selectedMemberSettlementSum}
              </H3>
            </YStack>
          </XStack>
          <Text paddingBottom="$4">
            {selectedUserName} paid the following for {currentUserName}
          </Text>
          {selectedMemberSettlements?.map((settlements, index) => (
            <YGroup
              alignSelf="center"
              bordered
              width={windowWidth * 0.9}
              size="$4"
            >
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  title={settlements.transactionName}
                  iconAfter={<H1>${settlements.userSplitAmount}</H1>}
                />
              </YGroup.Item>
            </YGroup>
          ))}
          <Separator paddingTop="$2" paddingBottom="$2" />
          <XStack
            justifyContent="space-between"
            paddingTop="$4"
            paddingBottom="$4"
          >
            <Avatar url={currentUserUrl} size={"$5"} />
            <YStack>
              <Text>Total Amount</Text>
              <H3 textAlign="right" color={"$green10Light"}>
                ${currentUserSettlementSum}
              </H3>
            </YStack>
          </XStack>
          <Text paddingBottom="$4">
            {currentUserName} paid the following for {selectedUserName}
          </Text>
          {currentUserSettlements?.map((settlements, index) => (
            <YGroup
              alignSelf="center"
              bordered
              width={windowWidth * 0.9}
              size="$4"
            >
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  title={settlements.transactionName}
                  iconAfter={<H1>${settlements.userSplitAmount}</H1>}
                />
              </YGroup.Item>
            </YGroup>
          ))}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default UserSettlementsSheet;
