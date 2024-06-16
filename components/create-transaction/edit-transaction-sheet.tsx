import { supabase } from "@/lib/supabase";
import { Member, SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Fieldset,
  Form,
  Separator,
  Sheet,
  SizableText,
  Text,
  useWindowDimensions,
  XStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { StyledInput } from "../input/input";
import ConfirmDeleteTransaction from "./confirm-delete-transaction";
import CustomSplit from "./custom-split";
import MembersDropdown from "./members-dropdown";
import SplitView from "./split-view";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  members: Member[];
  transaction: Transaction;
  setCurrentTxnToEdit: (txn: Transaction) => void;
  billOwnerId: string;
}

const EditTransaction: React.FC<Props> = ({
  open,
  setOpen,
  members,
  transaction,
  setCurrentTxnToEdit,
  billOwnerId,
}) => {
  /*********** States and Variables ***********/

  const [isAmountChanged, setIsAmountChanged] = useState(false);
  const [isVisibleForUser, setIsVisibleForUser] = useState(false);
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
  const router = useRouter();
  const { id, userId } = useLocalSearchParams();
  const [includedMembers, setIncludedMembers] = useState<
    SelectedMemberSplitAmount[]
  >([]);
  const [isEven, setIsEven] = useState(true);
  const [sheetZIndex, setSheetZIndex] = useState(100000);
  const { width, height } = useWindowDimensions();

  const [transactionName, setTransactionName] = useState("");
  const [isAmountError, setIsAmountError] = useState(false);
  const [isTransactionNameError, setIsTransactionNameError] = useState(false);

  /*********** Helpers ***********/
  const getDisplayName = (userId: string) => {
    const user = members.find((member) => member.userid === userId);

    return user ? user.displayName : "";
  };

  const handleNameChange = (txnName: string): void => {
    const trimmedTxnName = txnName.trim();
    if (trimmedTxnName.length === 0) {
      setIsTransactionNameError(true);
      setTransactionName(txnName);
    } else if (trimmedTxnName.length <= 20) {
      setTransactionName(txnName);
      setIsTransactionNameError(false);
    } else {
      setIsTransactionNameError(true);
    }
  };

  const handlePayerChange = (selectedPayer: string) => {
    // setPayer(selectedPayer);
    setLocalTxn((prevTransaction) => ({
      ...prevTransaction,
      payerid: selectedPayer, // Update the payer property of the localTxn object with the new value
    }));
  };

  const handleAmountChange = (_amount: string) => {
    //set error state
    if (_amount.length === 0) {
      setIsAmountError(true);
    } else if (parseFloat(_amount) === 0) {
      setIsAmountError(true);
    } else if (_amount.length <= 5 && parseFloat(_amount) > 0) {
      setIsAmountError(false);
    } else {
      setIsAmountError(true);
    }

    // Allow only digits optionally followed by a dot and then more digits
    const regex = /^\d*\.?\d*$/;

    if (regex.test(_amount)) {
      // Remove leading zeros unless the value is "0" or it starts with "0."
      if (
        _amount.startsWith("0") &&
        _amount.length > 1 &&
        !_amount.startsWith("0.")
      ) {
        _amount = _amount.replace(/^0+/, "");
      }

      if (_amount) {
        setAmount(_amount);
        setIsAmountChanged(true);
      } else {
        setAmount("0");
      }
    }
  };

  const handleBlur = () => {
    // Default to 0 if the input is empty or just a dot
    if (amount === "" || amount === ".") {
      setAmount("0");
      setIsAmountError(true);
    } else if (amount.endsWith(".")) {
      // Remove trailing dot if present
      setAmount(amount.slice(0, -1));
    }
  };

  /*********** Functions ***********/

  /**
   * On Success:
   * - close modal
   * - set transactions to the returned transactions
   *
   * need to adjust tables on split transactions and the functions...
   */
  const onSubmitTxn = async () => {
    let _userId = userId.toString();
    localTxn.submittedbyid = _userId;
    localTxn.billid = Number(id);
    localTxn.amount = parseFloat(amount);
    localTxn.name = transactionName;

    //first check if bill is locked...
    //yes, then route to homepage
    //no, then continue updating transaction
    try {
      const { data: isBillLocked, error: billError } = await supabase
        .from("bills")
        .select("isLocked")
        .eq("billid", localTxn.billid);

      if (isBillLocked) {
        //checks if bill is locked
        if (isBillLocked[0].isLocked) {
          // router.replace({
          //   pathname: `/(bill)/${localTxn.billid}`,
          //   params: {
          //     userId: _userId,
          //     errorEditMsg: "Bill is locked. It cannot be edited.",
          //   }, //
          // });
          if (_userId) {
            router.replace({
              pathname: "/(homepage)/[id]",
              params: { id: _userId },
            });
          }
        } else {
          const { data, error } = await supabase
            .from("transactions")
            .update([localTxn])
            .eq("id", localTxn.id)
            .select();

          if (error) {
            router.replace({
              pathname: `/(bill)/${localTxn.billid}`,
              params: { userId: _userId, errorEditMsg: error.message }, //
            });
          }

          if (data) {
            const editedTxn: Transaction = data[0];
            setCurrentTxnToEdit(editedTxn);
            setLocalTxn(editedTxn);
            router.replace({
              pathname: `/(bill)/${editedTxn.billid}`,
              params: { userId: _userId, editedTxnName: editedTxn.name },
            });
          }
        }
      }
    } catch (error: any) {
      router.navigate({
        pathname: `/(bill)/${id}`,
        params: { userId: _userId, errorCreateMsg: error.message }, //
      });
    } finally {
      setOpen(false);
    }
  };

  const initializeSplits = () => {
    let amountNum = amount ? parseFloat(amount) : localTxn.amount;
    const splitEvenAmount = (_amount: number) => {
      return _amount / members.length;
    };
    const newSplits = members.map((member) => ({
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

  const initiateIncludedMembers = () => {
    const newSelectedSplits: SelectedMemberSplitAmount[] = members.map(
      (member) => ({
        isIncluded: true,
        memberId: member.userid,
        amount: 0,
        displayName: member.displayName,
        avatarUrl: member.avatar_url,
      })
    );

    setIncludedMembers(newSelectedSplits);
  };

  const handleSaveSplits = (selectedMembers: SelectedMemberSplitAmount[]) => {
    // Filter out selectedMembers with isIncluded as true
    const includedMembers = selectedMembers.filter(
      (member) => member.isIncluded
    );
    const split = selectedMembers.map((member) => ({
      isIncluded: member.isIncluded,
      memberId: member.memberId,
      amount: member.amount,
      displayName: member.displayName,
      avatarUrl: member.avatarUrl,
    }));

    setLocalTxn((prevTransaction) => ({
      ...prevTransaction,
      split: split,
    }));

    setIncludedMembers(split);
  };

  /*********** UseEffects ***********/
  //Gets members
  useEffect(() => {
    if (members.length > 0) {
      initiateIncludedMembers();
    }
  }, [members]);

  //only initialize splits whe amount is edited
  useEffect(() => {
    if (isAmountChanged) {
      initializeSplits();
    }
  }, [amount]);

  //reset localTxn on open and close of modal
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

  //component is visible to user if user is the bill owner or transaction payer
  useEffect(() => {
    if (userId === billOwnerId || userId === localTxn.payerid) {
      setIsVisibleForUser(true);
    } else {
      setIsVisibleForUser(false);
    }
  }, [localTxn, userId, billOwnerId]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setIsAmountChanged(false);
      }}
      snapPoints={[90]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      zIndex={sheetZIndex}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
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
        <Form
          onSubmit={onSubmitTxn}
          rowGap="$3"
          borderRadius="$6"
          padding="$3"
          justifyContent="center"
        >
          {isVisibleForUser && (
            <XStack justifyContent="space-between">
              <ConfirmDeleteTransaction
                userId={userId.toString()}
                transaction={localTxn}
                setOpen={setOpen}
                setSheetZIndex={setSheetZIndex}
              />
              <Form.Trigger asChild>
                <StyledButton
                  width={width * 0.25}
                  size={"$3.5"}
                  active={
                    !!transactionName &&
                    !isTransactionNameError &&
                    !!amount &&
                    !isAmountError
                  }
                  disabled={
                    !transactionName ||
                    isTransactionNameError ||
                    !amount ||
                    isAmountError
                  }
                >
                  Submit
                </StyledButton>
              </Form.Trigger>
            </XStack>
          )}

          <Fieldset gap="$4" horizontal justifyContent="center">
            <SizableText size={"$9"}>$</SizableText>
            <StyledInput
              placeholder="0"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={handleAmountChange}
              onBlur={handleBlur}
              inputMode="decimal"
              size={"$11"}
              backgroundColor={"$backgroundTransparent"}
              borderWidth="0"
              autoFocus={false}
              clearTextOnFocus={false}
              disabled={!isVisibleForUser}
              maxLength={5}
            />
          </Fieldset>
          <XStack justifyContent="space-between" gap={"$2"}>
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
              <Text paddingLeft="$1.5" fontSize={"$1"}>
                Transaction name (*)
              </Text>
              <StyledInput
                placeholder="Enter name"
                defaultValue=""
                value={transactionName}
                error={isTransactionNameError}
                onChangeText={handleNameChange}
                disabled={!isVisibleForUser}
                maxLength={20}
              />
            </Fieldset>
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
              <Text paddingLeft="$1.5" fontSize={"$1"}>
                Paid by:
              </Text>
              <MembersDropdown
                members={members}
                onPayerChange={handlePayerChange}
                defaultPayer={getDisplayName(userId.toString())}
                isVisibleToUser={
                  !isVisibleForUser ||
                  !transactionName ||
                  isTransactionNameError ||
                  !amount ||
                  isAmountError
                }
              />
            </Fieldset>
          </XStack>
          {isVisibleForUser && (
            <XStack justifyContent="flex-end" paddingTop="$4">
              <CustomSplit
                memberSplits={localTxn.split}
                amount={parseFloat(amount)}
                onSaveSplits={handleSaveSplits}
                setIsEven={setIsEven}
                includedMembers={includedMembers}
                isDisabled={
                  !transactionName ||
                  isTransactionNameError ||
                  !amount ||
                  isAmountError
                }
              />
            </XStack>
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
        </Form>
      </Sheet.Frame>
    </Sheet>
  );
};

export default EditTransaction;
