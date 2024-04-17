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
import CustomSplit from "./custom-split";
import MembersDropdown from "./members-dropdown";
import SplitView from "./split-view";
import { Trash2 } from "@tamagui/lucide-icons";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  members: Member[];
  transaction: Transaction;
  setCurrentTxnToEdit: (txn: Transaction) => void;
}

const EditTransaction: React.FC<Props> = ({
  open,
  setOpen,
  members,
  transaction,
  setCurrentTxnToEdit,
}) => {
  const [position, setPosition] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAmountChanged, setIsAmountChanged] = useState(false);

  // ---- test -----
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

  const handleAmountChange = (amount: string) => {
    // Remove any non-numeric characters except for periods
    const numericValue = parseFloat(amount.replace(/[^\d.]/g, ""));

    // Check if the numeric value is a valid number
    if (!isNaN(numericValue)) {
      // Update localTxn state with the parsed numeric value
      setLocalTxn((prevTransaction) => ({
        ...prevTransaction,
        amount: numericValue,
      }));

      setIsAmountChanged(true);
    } else {
      setLocalTxn((prevTransaction) => ({
        ...prevTransaction,
        amount: 0,
      }));
    }
  };

  /**  - - - - - FUNCTIONS - - - - -*/

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

    try {
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
    } catch (error: any) {
      router.navigate({
        pathname: `/(bill)/${id}`,
        params: { userId: _userId, errorCreateMsg: error.message }, //
      });
    } finally {
      setOpen(false);
    }
  };

  /** Soft Delete */
  const onDeleteTxn = async () => {
    let _userId = userId.toString();
    localTxn.submittedbyid = _userId;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .update({ isdeleted: true })
        .eq("id", localTxn.id)
        .select();

      if (error) {
        router.navigate({
          pathname: `/(bill)/${localTxn.billid}`,
          params: { userId: _userId, errorDeleteMsg: error.message }, //
        });
      }

      if (data) {
        const _deletedTxn: Transaction = data[0];
        console.log("Deleted txn", _deletedTxn);
        router.navigate({
          pathname: `/(bill)/${localTxn.billid}`,
          params: { userId: _userId, deletedTxnName: _deletedTxn.name },
        });
      }
    } catch (error: any) {
      router.navigate({
        pathname: `/(bill)/${localTxn.billid}`,
        params: { userId: _userId, errorDeleteMsg: error.message }, //
      });
    } finally {
      setOpen(false);
    }
  };

  const initializeSplits = () => {
    let amountNum = localTxn.amount;
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

  /**  - - - - - Use Effect - - - - -*/

  useEffect(() => {
    if (members.length > 0) {
      console.log("RESET MEMBERS");

      initiateIncludedMembers();
    }
  }, [members]);

  //only initialize splits whe amount is edited
  useEffect(() => {
    if (isAmountChanged) {
      initializeSplits();
    }
  }, [localTxn.amount]);

  //   useEffect(() => {
  //     console.log("Txn to Edit", localTxn);
  //     setCurrentTxnToEdit(localTxn);
  //   }, [localTxn, open]);

  //reset localTxn on open and close of modal
  useEffect(() => {
    // Reset localTxn values when modal is opened
    if (open) {
      setLocalTxn(transaction);
      console.log("Edit page transaction: ", transaction);
      console.log("Edit page open: ", open);
    }
  }, [open, transaction]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => setOpen(!open)}
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
          onSubmit={onSubmitTxn}
          rowGap="$3"
          borderRadius="$6"
          padding="$3"
          justifyContent="center"
        >
          <XStack justifyContent="space-between">
            <StyledButton
              color={"$red10Light"}
              onPress={onDeleteTxn}
              delete={true}
              icon={<Trash2 size={"$1"} color={"$red9"} />}
              width={width * 0.25}
            />
            <Form.Trigger asChild>
              <StyledButton
                width={width * 0.25}
                size={"$3.5"}
                active={!!(localTxn.name && localTxn.amount)}
                disabled={!(localTxn.name && localTxn.amount)}
              >
                Submit
              </StyledButton>
            </Form.Trigger>
            {/* <Text>
              Active {!!(localTxn.name && localTxn.amount)}
            </Text> */}
            {/* <Text>
              disabled {!(localTxn.name && localTxn.amount)}
            </Text> */}
          </XStack>
          <Fieldset gap="$4" horizontal justifyContent="center">
            <StyledInput
              id="edit-amount-input"
              placeholder="0"
              keyboardType="numeric"
              value={localTxn.amount.toString()}
              onChangeText={handleAmountChange}
              inputMode="decimal"
              size={"$12"}
              backgroundColor={"$backgroundTransparent"}
              borderWidth="0"
              autoFocus={true}
              clearTextOnFocus={false}
            />
          </Fieldset>
          <XStack justifyContent="space-between" gap={"$2"}>
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
              <Text paddingLeft="$1.5" fontSize={"$1"}>
                Transaction name (*)
              </Text>
              <StyledInput
                id="localTxn-name"
                placeholder="Enter name"
                defaultValue=""
                value={localTxn.name}
                error={!localTxn.name}
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
              memberSplits={localTxn.split}
              amount={localTxn.amount}
              onSaveSplits={handleSaveSplits}
              setIsEven={setIsEven}
              includedMembers={includedMembers}
              isDisabled={!!(localTxn.name && localTxn.amount)}
            />
          </XStack>
          <XStack justifyContent="space-around" paddingTop="$3" gap="$3">
            <Separator />
            <Text fontSize={"$2"}>Current Split</Text>
            <Separator />
          </XStack>
          <SplitView
            memberSplits={localTxn.split}
            amount={localTxn.amount.toString()}
            isEven={isEven}
          />
        </Form>
      </Sheet.Frame>
    </Sheet>
  );
};

export default EditTransaction;
