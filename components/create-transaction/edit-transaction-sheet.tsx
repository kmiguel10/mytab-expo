import { supabase } from "@/lib/supabase";
import { Member, SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Fieldset,
  Form,
  Separator,
  Sheet,
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
  const [position, setPosition] = useState(0);
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
  const { width, height } = useWindowDimensions();

  /*********** Helpers ***********/
  const getDisplayName = (userId: string) => {
    const user = members.find((member) => member.userid === userId);

    return user ? user.displayName : "";
  };

  const handleNameChange = (txnName: string): void => {
    setLocalTxn((prevTransaction) => ({
      ...prevTransaction,
      name: txnName,
    }));
  };

  const handlePayerChange = (selectedPayer: string) => {
    // setPayer(selectedPayer);
    setLocalTxn((prevTransaction) => ({
      ...prevTransaction,
      payerid: selectedPayer, // Update the payer property of the localTxn object with the new value
    }));
  };

  const handleAmountChange = (_amount: string) => {
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
            console.log("Edited Transaction: ", editedTxn);
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

    console.log("***** Splits initialized");
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

    console.log("Parent Selected members: ", JSON.stringify(newSelectedSplits));
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
      setLocalTxn(transaction);
      console.log("Edit page transaction: ", transaction);
      console.log("Edit page open: ", open);
    }
    setLocalTxn(transaction);
    setAmount(transaction.amount.toString());
  }, [open, transaction]);

  //component is visible to user if user is the bill owner or transaction payer
  useEffect(() => {
    console.log("userId", userId);
    console.log("billOwnerId", billOwnerId);
    console.log("localTxn.payerid", localTxn.payerid);
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
              />
              <Form.Trigger asChild>
                <StyledButton
                  width={width * 0.25}
                  size={"$3.5"}
                  active={!!(localTxn.name && amount) && amount !== "0"}
                  disabled={!!(localTxn.name && amount) && amount === "0"}
                >
                  Submit
                </StyledButton>
              </Form.Trigger>
            </XStack>
          )}

          <Fieldset gap="$4" horizontal justifyContent="center">
            <StyledInput
              id={`edit-amount-input - ${localTxn.name}`}
              placeholder="0"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={handleAmountChange}
              onBlur={handleBlur}
              inputMode="decimal"
              size={"$12"}
              backgroundColor={"$backgroundTransparent"}
              borderWidth="0"
              autoFocus={true}
              clearTextOnFocus={false}
              disabled={!isVisibleForUser}
            />
          </Fieldset>
          <XStack justifyContent="space-between" gap={"$2"}>
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
              <Text paddingLeft="$1.5" fontSize={"$1"}>
                Transaction name (*)
              </Text>
              <StyledInput
                id={`local-txn-name - ${localTxn.billid}`}
                placeholder="Enter name"
                defaultValue=""
                value={localTxn.name}
                error={!localTxn.name}
                onChangeText={handleNameChange}
                disabled={!isVisibleForUser}
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
                isVisibleToUser={isVisibleForUser}
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
                isDisabled={!!(localTxn.name && amount) && amount !== "0"}
              />
            </XStack>
          )}

          <XStack justifyContent="space-around" paddingTop="$3" gap="$3">
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
