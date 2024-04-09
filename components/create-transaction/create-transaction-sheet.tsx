import { supabase } from "@/lib/supabase";
import { Member, SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { ChevronDown } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Fieldset,
  Form,
  H2,
  Paragraph,
  Separator,
  Sheet,
  SheetProps,
  Text,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { StyledInput } from "../input/input";
import CustomSplit from "./custom-split";
import MembersDropdown from "./members-dropdown";
import SplitView from "./split-view";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  setNewTransaction: (newTxns: Transaction[]) => void;
  members: Member[];
  billId: string;
}

const CreateTransaction: React.FC<Props> = ({ open, setOpen, members }) => {
  const [position, setPosition] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // ---- test -----
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

  const getDisplayName = (userId: string) => {
    const user = members.find((member) => member.userid === userId);

    return user ? user.displayName : "";
  };

  const handleNameChange = (txnName: string) => {
    //setName(txnName);
    // transaction.name = name;
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      name: txnName,
    }));
  };

  const handlePayerChange = (selectedPayer: string) => {
    // setPayer(selectedPayer);
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      payerid: selectedPayer, // Update the payer property of the transaction object with the new value
    }));
  };

  const handleAmountChange = (amount: string) => {
    // Remove any non-numeric characters except for periods
    const numericValue = parseFloat(amount.replace(/[^\d.]/g, ""));

    // Check if the numeric value is a valid number
    if (!isNaN(numericValue)) {
      // Update transaction state with the parsed numeric value
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        amount: numericValue,
      }));
    } else {
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        amount: 0,
      }));
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

    try {
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
    let amountNum = transaction.amount;
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

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      split: split,
    }));

    setIncludedMembers(split);
  };

  useEffect(() => {
    if (members.length > 0) {
      console.log("RESET MEMBERS");
      initializeSplits();
      initiateIncludedMembers();
    }
  }, [members, transaction.amount]);

  //reset transaction on open and close of modal
  useEffect(() => {
    // Reset transaction values when modal is opened
    if (open) {
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        amount: 0,
        name: "",
      }));
    }
  }, [open]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={setOpen}
      snapPoints={isExpanded ? [80, 50, 25] : [90, 50, 25]}
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
          onSubmit={onCreateTxn}
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
                create={!!(transaction.name && transaction.amount)}
                disabled={!!(transaction.name && transaction.amount)}
              >
                Create
              </StyledButton>
            </XStack>
          </Form.Trigger>
          <Fieldset gap="$4" horizontal justifyContent="center">
            <StyledInput
              id="amount-input"
              placeholder="0"
              defaultValue={"0"}
              keyboardType="numeric"
              value={transaction.amount.toString()}
              onChangeText={handleAmountChange}
              inputMode="decimal"
              size={"$12"}
              backgroundColor={"$backgroundTransparent"}
              borderWidth="0"
              autoFocus={true}
              clearTextOnFocus
            />
          </Fieldset>
          <XStack justifyContent="space-between" gap={"$2"}>
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
              <Text paddingLeft="$1.5" fontSize={"$1"}>
                Transaction name (*)
              </Text>
              <StyledInput
                id="transaction-name"
                placeholder="Enter name"
                defaultValue=""
                value={transaction.name}
                error={!transaction.name}
                onChangeText={handleNameChange}
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
              />
            </Fieldset>
          </XStack>
          <XStack justifyContent="flex-end" paddingTop="$4">
            <CustomSplit
              memberSplits={transaction.split}
              amount={transaction.amount}
              onSaveSplits={handleSaveSplits}
              setIsEven={setIsEven}
              includedMembers={includedMembers}
              isDisabled={!!(transaction.name && transaction.amount)}
            />
          </XStack>
          <XStack justifyContent="space-around" paddingTop="$3" gap="$3">
            <Separator />
            <Text fontSize={"$2"}>Current Split</Text>
            <Separator />
          </XStack>

          <SplitView
            memberSplits={transaction.split}
            amount={transaction.amount.toString()}
            isEven={isEven}
          />
        </Form>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CreateTransaction;
