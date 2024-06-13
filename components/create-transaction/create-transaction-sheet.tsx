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
import CustomSplit from "./custom-split";
import MembersDropdown from "./members-dropdown";
import SplitView from "./split-view";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  members: Member[];
  billId: string;
  maxTransaction: number;
}

const CreateTransaction: React.FC<Props> = ({
  open,
  setOpen,
  members,
  maxTransaction,
}) => {
  /********** States and variables ***********/
  const [position, setPosition] = useState(0);
  const [amount, setAmount] = useState("");
  const [isAmountError, setIsAmountError] = useState(false);
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
  const router = useRouter();
  const { id, userId } = useLocalSearchParams();
  const [includedMembers, setIncludedMembers] = useState<
    SelectedMemberSplitAmount[]
  >([]);
  const [isEven, setIsEven] = useState(true);
  const { width, height } = useWindowDimensions();

  const [transactionName, setTransactionName] = useState("");
  const [isTransactionNameError, setIsTransactionNameError] = useState(false);

  /********** Functions ***********/
  const getDisplayName = (userId: string) => {
    const user = members.find((member) => member.userid === userId);

    return user ? user.displayName : "";
  };

  const handleNameChange = (txnName: string) => {
    const trimmedTxnName = txnName.trim();
    // setTransaction((prevTransaction) => ({
    //   ...prevTransaction,
    //   name: txnName,
    // }));

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
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      payerid: selectedPayer, // Update the payer property of the transaction object with the new value
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

  /**
   * On Success:
   * - close modal
   * - set transactions to the returned transactions
   *
   * need to adjust tables on split transactions and the functions...
   */
  const onCreateTxn = async () => {
    let _userId = userId.toString();
    transaction.submittedbyid = _userId;
    transaction.billid = Number(id);
    transaction.amount = parseFloat(amount);
    transaction.name = transactionName;

    try {
      const { data, error: billError } = await supabase
        .from("bills")
        .select("isLocked,activeTxnCount,isActive")
        .eq("billid", transaction.billid);

      if (data) {
        //Scenario if the bill is expired:
        if (!data[0].isActive) {
          router.navigate({
            pathname: `/(bill)/${id}`,
            params: {
              userId: _userId,
              errorCreateMsg: "Failed to add transaction: Bill is expired",
            }, //
          });
          setOpen(false);
          return;
        }

        //Scenario if the maxTransaction is reached
        if (data[0].activeTxnCount >= maxTransaction) {
          router.navigate({
            pathname: `/(bill)/${id}`,
            params: {
              userId: _userId,
              errorCreateMsg: `Reached maximum ${maxTransaction} transactions`,
            }, //
          });
          setOpen(false);
          return;
        }
        if (data[0].isLocked) {
          //Scenario: if the Bill is locked
          router.replace({
            pathname: `/(bill)/${transaction.billid}`,
            params: {
              userId: _userId,
              errorEditMsg: "Bill is locked. It cannot be edited.",
            },
          });
        } else {
          //Scenario: able to add transaction
          const { data, error } = await supabase
            .from("transactions")
            .insert([transaction])
            .select();

          if (error) {
            throw new Error(error.message); // Throw the error to be caught in the catch block
          }

          if (data) {
            const createdTxn: Transaction = data[0];
            router.navigate({
              pathname: `/(bill)/${createdTxn.billid}`,
              params: { userId: _userId, txnName: createdTxn.name },
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
    let amountNum = parseFloat(amount);
    const splitEvenAmount = (_amount: number) => {
      return _amount / members.length;
    };
    const newSplits = members.map((member) => ({
      memberId: member.userid,
      amount: splitEvenAmount(amountNum),
      displayName: member.displayName,
      avatarUrl: member.avatar_url,
    }));

    setTransaction((prevTransaction) => ({
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

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      split: split,
    }));

    setIncludedMembers(split);
  };

  const handleOpenChange = () => {
    if (open) {
      setOpen(false);
      setAmount("");
      setTransactionName("");
    }
  };

  /********** UseEffects ***********/
  useEffect(() => {
    if (members.length > 0) {
      initializeSplits();
      initiateIncludedMembers();
    }
  }, [members, amount]);

  //reset transaction on open and close of modal
  useEffect(() => {
    // Reset transaction values when modal is opened
    if (open) {
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        amount: 0,
        name: "",
      }));
      setOpen(true);
    }
    setTransactionName("");
    setAmount("");
  }, [open]);

  return (
    <Sheet
      forceRemoveScrollEnabled={true}
      modal={true}
      open={open}
      onOpenChange={handleOpenChange}
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
          onSubmit={() => console.log("")}
          rowGap="$3"
          borderRadius="$6"
          padding="$3"
          justifyContent="center"
        >
          <Form.Trigger asChild>
            <XStack justifyContent="flex-end">
              <StyledButton
                width={width * 0.25}
                size={"$3.5"}
                create={
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
                onPress={onCreateTxn}
              >
                Create
              </StyledButton>
            </XStack>
          </Form.Trigger>
          <Fieldset horizontal justifyContent="center">
            <SizableText size={"$9"}>$</SizableText>
            <StyledInput
              placeholder="0"
              defaultValue={""}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={handleAmountChange}
              onBlur={handleBlur}
              inputMode="decimal"
              size={"$11"}
              backgroundColor={"$backgroundTransparent"}
              borderWidth="0"
              autoFocus={true}
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
                members={members}
                onPayerChange={handlePayerChange}
                defaultPayer={getDisplayName(userId.toString())}
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
              memberSplits={transaction.split}
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
          <XStack justifyContent="space-around" paddingTop="$3" gap="$3">
            <Separator />
            <Text fontSize={"$2"}>Current Split</Text>
            <Separator />
          </XStack>
          <SplitView memberSplits={transaction.split} isEven={isEven} />
        </Form>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CreateTransaction;
