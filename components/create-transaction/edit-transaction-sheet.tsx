import { Member, SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Separator,
  Sheet,
  SizableText,
  Spinner,
  Text,
  TextArea,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import SplitView from "./split-view";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  members: Member[];
  transaction: Transaction;
  billOwnerId: string;
}

const EditTransaction: React.FC<Props> = ({
  open,
  setOpen,
  members,
  transaction,
  billOwnerId,
}) => {
  /*********** States and Variables ***********/

  const [isAmountChanged, setIsAmountChanged] = useState(false);
  const [amount, setAmount] = useState("");
  const [localTxn, setLocalTxn] = useState<Transaction>({
    billid: 0,
    submittedbyid: "",
    payerid: null,
    amount: 0,
    name: "",
    notes: null,
    split: [],
    isdeleted: false,
  });
  const [activeMembers, setActiveMembers] = useState<Member[]>([]);

  const [isEven, setIsEven] = useState(true);
  const [sheetZIndex, setSheetZIndex] = useState(100000);
  const { width, height } = useWindowDimensions();

  const [transactionName, setTransactionName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(70);
  /*********** Helpers ***********/
  const getDisplayName = (userId: string) => {
    const user = activeMembers.find((member) => member.userid === userId);
    return user ? user.displayName : "";
  };

  /*********** Functions ***********/

  /**
   * On Success:
   * - close modal
   * - set transactions to the returned transactions
   *
   * need to adjust tables on split transactions and the functions...
   */

  const initializeSplits = () => {
    let amountNum = amount ? parseFloat(amount) : localTxn.amount;
    const splitEvenAmount = (_amount: number) => {
      return _amount / activeMembers.length;
    };
    const newSplits = activeMembers.map((member) => ({
      memberId: member.userid,
      amount: splitEvenAmount(amountNum),
      displayName: member.displayName,
      avatarUrl: member.avatar_url,
    }));

    setLocalTxn((prevTransaction) => ({
      ...prevTransaction,
      split: newSplits,
    }));
  };

  const handleOpenChange = () => {
    if (open) {
      setOpen(false);
      setIsAmountChanged(false);
    }
  };

  /*********** UseEffects ***********/
  //Only use active members
  useEffect(() => {
    const _activeMembers = members.filter(
      (member) => member.isMemberIncluded === true
    );
    setActiveMembers(_activeMembers);
  }, [members]);

  //only initialize splits whe amount is edited
  useEffect(() => {
    if (isAmountChanged) {
      initializeSplits();
    }
  }, [amount]);

  useEffect(() => {
    // Reset localTxn values when modal is opened
    if (open) {
      setSheetZIndex(100000);
      setLocalTxn(transaction);
    }
    setLocalTxn(transaction);
    setAmount(transaction.amount.toString());
    setTransactionName(transaction.name);
  }, [open, transaction]);

  useEffect(() => {
    if (localTxn.notes) {
      if (localTxn.notes.length > 0) {
        setSheetHeight(90);
      }
    } else {
      setSheetHeight(70);
    }
  }, [localTxn]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={handleOpenChange}
      snapPoints={[sheetHeight]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      zIndex={sheetZIndex}
      animation="medium"
    >
      <Sheet.Overlay
        animation="100ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding="$4"
        justifyContent="flex-start"
        alignItems="center"
        gap="$5"
      >
        {isLoading ? (
          <YStack justifyContent="center" flex={2}>
            <Spinner color="forestgreen" size="large" />
          </YStack>
        ) : (
          <YStack
            rowGap="$3"
            borderRadius="$6"
            padding="$3"
            justifyContent="center"
          >
            <XStack padding="$8" justifyContent="center">
              <SizableText size={"$10"}>${amount}</SizableText>
            </XStack>
            <XStack justifyContent="space-evenly" gap={"$2"}>
              <YStack gap={"$1"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$3"} fontWeight={800}>
                  Transaction name
                </Text>
                <XStack>
                  <Text
                    justifyContent="center"
                    paddingVertical="$2"
                    paddingHorizontal="$1"
                  >
                    {transactionName}
                  </Text>
                </XStack>
              </YStack>
              <YStack gap={"$1"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$3"} fontWeight={800}>
                  Paid by:
                </Text>
                <XStack>
                  <Text
                    justifyContent="center"
                    paddingVertical="$2"
                    paddingHorizontal="$1"
                  >
                    {getDisplayName(localTxn?.payerid?.toString() || "")}
                  </Text>
                </XStack>
              </YStack>
            </XStack>
            {localTxn.notes && (
              <YStack gap={"$2"}>
                <SizableText fontWeight={800} fontSize={"$3"}>
                  Memo
                </SizableText>
                <TextArea value={localTxn.notes || ""} disabled={true} />
              </YStack>
            )}

            <XStack
              justifyContent="space-around"
              paddingTop="$3"
              gap="$3"
              alignItems="center"
            >
              <Separator />
              <Text fontSize={"$2"}>Current Split</Text>
              <Separator />
            </XStack>
            <SplitView memberSplits={localTxn.split} isEven={isEven} />
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  );
};

export default EditTransaction;
