import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import ConfirmDeleteTransaction from "@/components/create-transaction/confirm-delete-transaction";
import CustomSplit from "@/components/create-transaction/custom-split";
import MembersDropdown from "@/components/create-transaction/members-dropdown";
import SplitView from "@/components/create-transaction/split-view";
import { StyledInput } from "@/components/input/input";
import { supabase } from "@/lib/supabase";
import { Member, SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Fieldset,
  Form,
  Separator,
  SizableText,
  Spinner,
  Text,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";

const EditTransaction = () => {
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
  const router = useRouter();
  const [includedMembers, setIncludedMembers] = useState<
    SelectedMemberSplitAmount[]
  >([]);
  const [activeMembers, setActiveMembers] = useState<Member[]>([]);

  const [isEven, setIsEven] = useState(true);
  const { width, height } = useWindowDimensions();

  const [transactionName, setTransactionName] = useState("");
  const [isAmountError, setIsAmountError] = useState(false);
  const [isTransactionNameError, setIsTransactionNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [billId, setBillId] = useState(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [billOwnerId, setBillOwnerId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState<Transaction>({
    billid: 0,
    submittedbyid: "",
    payerid: null,
    amount: 0,
    name: "",
    notes: null,
    split: [],
    isdeleted: false,
  });
  const { editTxnObject } = useLocalSearchParams();

  /*********** Helpers ***********/
  const getDisplayName = (userId: string) => {
    const user = activeMembers.find((member) => member.userid === userId);
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

  //set error state
  const handleAmountChange = (_amount: string) => {
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
    console.log("local txn", localTxn);
    console.log("billId", billId);
    let _userId = userId?.toString() || "";
    localTxn.submittedbyid = _userId;
    localTxn.amount = parseFloat(amount);
    localTxn.name = transactionName;

    //first check if bill is locked...
    //yes, then route to homepage
    //no, then continue updating transaction
    try {
      setIsLoading(true); // Start spinner before the async operations
      //setIsLoadingBillPage(true);
      // Check if the bill is locked
      const { data: isBillLocked, error: billError } = await supabase
        .from("bills")
        .select("isLocked")
        .eq("billid", localTxn.billid);

      if (billError) {
        console.log("billError", billError.message);
        setIsLoading(false); // Stop spinner before routing
        router.push({
          pathname: `/(bill)/${localTxn.billid}`,
          params: { userId: _userId, errorEditMsg: billError.message },
        });
        return;
      }
      if (isBillLocked) {
        if (isBillLocked[0].isLocked) {
          // If bill is locked, route to homepage
          if (_userId) {
            setIsLoading(false); // Stop spinner before routing
            router.replace({
              pathname: "/(homepage)/[id]",
              params: { id: _userId },
            });
          }
        } else {
          // Update transaction
          const { data, error } = await supabase
            .from("transactions")
            .update([localTxn])
            .eq("id", localTxn.id)
            .select();

          if (error) {
            setIsLoading(false); // Stop spinner before routing
            router.push({
              pathname: `/(bill)/${localTxn.billid}`,
              params: { userId: _userId, errorEditMsg: error.message },
            });
          }

          if (data) {
            const editedTxn: Transaction = data[0];
            //setCurrentTxnToEdit(editedTxn);
            setLocalTxn(editedTxn);
            //setOpen(true); // Close the sheet
            setIsLoading(true); // Stop spinner before routing
            router.push({
              pathname: `/(bill)/${editedTxn.billid}`,
              params: { userId: _userId, editedTxnName: editedTxn.name },
            });
          }
        }
      }
    } catch (error: any) {
      setIsLoading(false); // Stop spinner before routing
      router.replace({
        pathname: `/(bill)/${billId}`,
        params: { userId: _userId, errorCreateMsg: error.message },
      });
    }
  };

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

  const initiateIncludedMembers = () => {
    const newSelectedSplits: SelectedMemberSplitAmount[] = activeMembers.map(
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
  //get params
  useEffect(() => {
    console.log("editTxnObject", editTxnObject);
    if (editTxnObject) {
      const parsedObject = JSON.parse(
        decodeURIComponent(editTxnObject.toString())
      );
      console.log("editTxnObject", parsedObject);
      const { members, transaction, billOwnerId, currentUser, transactionId } =
        parsedObject;
      console.log("parsed", parsedObject);
      setBillOwnerId(billOwnerId);
      setMembers(members);
      setUserId(currentUser);
      setTransaction(transaction);
      setLocalTxn(transaction);
      setTransactionId(transactionId);
      setBillId(transaction.billId);
      setAmount(transaction.amount.toString());
      setTransactionName(transaction.name);
    }
  }, [editTxnObject]);

  //Only use active members
  useEffect(() => {
    const _activeMembers = members.filter(
      (member) => member.isMemberIncluded === true
    );
    console.log("Get active members", JSON.stringify(_activeMembers));
    setActiveMembers(_activeMembers);
  }, [members]);

  //Gets members
  useEffect(() => {
    if (activeMembers.length > 0) {
      initiateIncludedMembers();
    }
  }, [activeMembers]);

  //only initialize splits whe amount is edited
  useEffect(() => {
    if (isAmountChanged) {
      initializeSplits();
    }
  }, [amount]);

  return (
    <OuterContainer
      padding="$2"
      gap="$2"
      backgroundColor={"whitesmoke"}
      height={height}
    >
      <BodyContainer
        height={height * 0.86}
        borderBottomRightRadius={"$11"}
        borderBottomLeftRadius={"$11"}
      >
        {isLoading ? (
          <YStack justifyContent="center" flex={2}>
            <Spinner color="forestgreen" size="large" />
          </YStack>
        ) : (
          <Form
            onSubmit={onSubmitTxn}
            rowGap="$3"
            borderRadius="$6"
            padding="$3"
            justifyContent="center"
          >
            <XStack justifyContent="space-between">
              <ConfirmDeleteTransaction
                userId={userId?.toString() || ""}
                transaction={localTxn}
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
                borderWidth={0}
                autoFocus={false}
                clearTextOnFocus={false}
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
                  backgroundColor={"white"}
                  onChangeText={handleNameChange}
                  maxLength={20}
                />
              </Fieldset>
              <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                <Text paddingLeft="$1.5" fontSize={"$1"}>
                  Paid by:
                </Text>
                <MembersDropdown
                  members={activeMembers}
                  onPayerChange={handlePayerChange}
                  defaultPayer={getDisplayName(
                    localTxn?.payerid?.toString() || ""
                  )}
                  isVisibleToUser={
                    !transactionName ||
                    isTransactionNameError ||
                    !amount ||
                    isAmountError
                  }
                />
              </Fieldset>
            </XStack>

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
        )}
      </BodyContainer>
    </OuterContainer>
  );
};

export default EditTransaction;
