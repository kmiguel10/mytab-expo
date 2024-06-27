import Avatar from "@/components/login/avatar";
import {
  formatToDollarCurrency,
  truncateToTwoDecimalPlaces,
} from "@/lib/helpers";
import { SettlementInfo } from "@/types/global";
import { XCircle } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import {
  H4,
  ListItem,
  ScrollView,
  Separator,
  Sheet,
  SizableText,
  useWindowDimensions,
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
  const [userSettlement, setUserSettlement] = useState("");

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
      (total, info) => total + parseFloat(info.userSplitAmount.toString()),
      0
    );
  };

  /** - - - - - - - - useEffects - - - - - - - - */
  useEffect(() => {
    console.log(JSON.stringify(currentUserSettlements));
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
    console.log("_currentUserSettlementSum: ", _currentUserSettlementSum);
    console.log("_selectedUserSettlementSum: ", _selectedUserSettlementSum);

    console.log(
      "SETTLEMENT AMOUNT: ",
      _currentUserSettlementSum - _selectedUserSettlementSum
    );

    setSettlementAmount(_currentUserSettlementSum - _selectedUserSettlementSum);
  }, [selectedMemberSettlements, currentUserSettlements]);

  useEffect(() => {
    if (settlementAmount < 0) {
      setUserSettlement(`${currentUserName} owes ${selectedUserName}`);
    } else {
      setUserSettlement(`${selectedUserName} owes ${currentUserName}`);
    }
  }, [settlementAmount]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => setOpen(!open)}
      snapPoints={[80]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom={false}
      position={position}
      onPositionChange={setPosition}
      zIndex={100000}
      animation="medium"
      disableDrag={true}
    >
      <Sheet.Overlay
        animation="100ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$2">
        <XStack justifyContent="flex-end">
          <XCircle onPress={() => setOpen(false)} />
        </XStack>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <H4 paddingBottom="$4">Settlement with {selectedUserName}</H4>
          <XStack justifyContent="space-between" paddingBottom="$4">
            <XStack alignItems="center" width={"50%"}>
              <SizableText textAlign="left">
                <SizableText size={"$5"} fontWeight={"bold"}>
                  {userSettlement}
                </SizableText>
              </SizableText>
            </XStack>
            <YStack>
              <SizableText fontWeight={"bold"}>Settlement Amount</SizableText>
              <SizableText textAlign="right">
                <SizableText
                  fontWeight={"bold"}
                  color={settlementAmount < 0 ? "$red10Light" : "$green10Light"}
                  size="$6"
                >
                  {formatToDollarCurrency(
                    truncateToTwoDecimalPlaces(Math.abs(settlementAmount))
                  )}
                </SizableText>
              </SizableText>
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
              <SizableText>Pay Amount</SizableText>
              <SizableText textAlign="right" color={"$red10Light"}>
                {formatToDollarCurrency(
                  truncateToTwoDecimalPlaces(selectedMemberSettlementSum)
                )}
              </SizableText>
            </YStack>
          </XStack>

          <SizableText paddingBottom="$4">
            {selectedUserName} paid for {selectedMemberSettlements?.length || 0}{" "}
            transactions for {currentUserName}
          </SizableText>

          <YGroup
            alignSelf="center"
            width={windowWidth * 0.9}
            size="$4"
            gap="$1"
          >
            {selectedMemberSettlements?.map((settlements, index) => (
              <YGroup.Item key={index}>
                <ListItem
                  bordered
                  key={index}
                  hoverTheme
                  title={settlements.transactionName}
                  iconAfter={
                    <SizableText>
                      {formatToDollarCurrency(
                        truncateToTwoDecimalPlaces(settlements.userSplitAmount)
                      )}
                    </SizableText>
                  }
                />
              </YGroup.Item>
            ))}
          </YGroup>
          <Separator paddingTop="$2" paddingBottom="$2" />
          <XStack
            justifyContent="space-between"
            paddingTop="$4"
            paddingBottom="$4"
          >
            <Avatar url={currentUserUrl} size={"$5"} />
            <YStack>
              <SizableText>Receive Amount</SizableText>
              <SizableText textAlign="right" color={"$green10Light"}>
                {formatToDollarCurrency(
                  truncateToTwoDecimalPlaces(currentUserSettlementSum)
                )}
              </SizableText>
            </YStack>
          </XStack>

          <SizableText paddingBottom="$4">
            {currentUserName} paid for {currentUserSettlements?.length || 0}{" "}
            transactions for {selectedUserName}
          </SizableText>

          <YGroup
            alignSelf="center"
            width={windowWidth * 0.9}
            size="$4"
            gap="$1"
          >
            {currentUserSettlements?.map((settlements, index) => (
              <YGroup.Item key={index}>
                <ListItem
                  bordered
                  key={index}
                  hoverTheme
                  title={settlements.transactionName}
                  iconAfter={
                    <SizableText>
                      {formatToDollarCurrency(
                        truncateToTwoDecimalPlaces(settlements.userSplitAmount)
                      )}
                    </SizableText>
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

export default UserSettlementsSheet;
