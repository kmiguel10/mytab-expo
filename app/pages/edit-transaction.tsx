import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import CustomSplit from "@/components/create-transaction/custom-split";
import MembersDropdown from "@/components/create-transaction/members-dropdown";
import SplitView from "@/components/create-transaction/split-view";
import { getCurrentTransaction, getMembers } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Fieldset,
  Form,
  Input,
  Label,
  Paragraph,
  Separator,
  TooltipSimple,
  XStack,
  useWindowDimensions,
  Text,
} from "tamagui";
interface Member {
  userid: string;
  members: Member[];
  // Add other properties if necessary
}

interface CreateTransaction {
  billId: any;
  currentUser: string;
  members: Member[]; // Ensure correct type for members
}

export const EditTransactionPage: React.FC<CreateTransaction> = () => {
  const [transaction, setTransaction] = useState<Transaction>({
    billid: 0,
    id: null,
    submittedbyid: "",
    payerid: "",
    amount: 0,
    name: "",
    notes: "",
    split: [],
    isdeleted: false,
  });
  const router = useRouter();
  const { txnId, currentUser, billId } = useLocalSearchParams();
  const [members, setMembers] = useState<any[]>([]);
  const [includedMembers, setIncludedMembers] = useState<
    SelectedMemberSplitAmount[]
  >([]);
  const [isEven, setIsEven] = useState(true);
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
    // Convert amount to a number
    //const numericValue = parseFloat(amount.replace(/[^\d.]/g, ""));
    let _amount = parseInt(amount.toString());

    if (!_amount) {
      _amount = 0;
    }

    // Update transaction state
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      amount: _amount, // Ensure amount is a number
    }));
    initializeSplits(_amount);
  };

  const onEditTxn = async () => {
    let _userId = currentUser.toString();
    transaction.submittedbyid = _userId;
    transaction.billid = parseInt(billId.toString());

    const { data, error } = await supabase
      .from("transactions")
      .update([transaction])
      .eq("id", txnId)
      .select();

    if (error) {
      console.log("TxnId: ", txnId);
      console.log("Transaction: ", transaction, txnId);
      console.error("Error inserting data:", error.message, error.details);
    } else {
      console.log("Data inserted successfully:", data);
      // router.replace(`/(bill)/mybill/${billId}`);
      router.replace({
        pathname: `/(bill)/mybill/${billId}`,
        params: { userId: _userId }, // Add userId to params
      });
    }
  };

  /** Soft Delete */
  const onDeleteTxn = async () => {
    let _txnId = parseInt(txnId.toString());
    let _userId = currentUser.toString();
    transaction.submittedbyid = _userId;
    transaction.billid = parseInt(billId.toString());

    const { data, error } = await supabase
      .from("transactions")
      .update({ isdeleted: true })
      .eq("id", _txnId.toString())
      .select();

    if (error) {
      console.log("Txn id", _txnId);
      console.log("Transaction: ", transaction);
      console.error("Error inserting data:", error.message, error.details);
    } else {
      console.log("Data inserted successfully:", data);
      // router.replace(`/(bill)/mybill/${billId}`);
      router.replace({
        pathname: `/(bill)/mybill/${billId}`,
        params: { userId: _userId }, // Add userId to params
      });
    }
  };

  const initializeSplits = (amountNum: number) => {
    //let amountNum = transaction.amount;
    const splitEvenAmount = (_amount: number) => {
      return _amount / members.length;
    };
    console.log("Initializing Splits");
    //should have logic here that if even then displayed even splits if custom then display transaction.split
    // let _userId = userId.toString();
    // transaction.submittedbyid = _userId;
    const newSplits = members.map((member) => ({
      memberId: member.userid,
      amount: splitEvenAmount(amountNum),
    }));

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      split: newSplits,
    }));
    console.log("New Splits", JSON.stringify(newSplits));
    console.log("Splits", JSON.stringify(transaction.split));
  };

  const initiateIncludedMembers = () => {
    const newSelectedSplits: SelectedMemberSplitAmount[] = members.map(
      (member) => ({
        isIncluded: true,
        memberId: member.userid,
        amount: 0,
      })
    );

    setIncludedMembers(newSelectedSplits);

    console.log("Parent Selected members: ", JSON.stringify(newSelectedSplits));
  };

  useEffect(() => {
    console.log("txn id", txnId);
    async function fetchCurrentTransaction() {
      if (txnId) {
        const data = await getCurrentTransaction(txnId.toString());
        console.log("current transaction", data);
        if (data) {
          setTransaction(data);
        }
      }
    }
    fetchCurrentTransaction();
  }, [txnId]);

  const handleSaveSplits = (selectedMembers: SelectedMemberSplitAmount[]) => {
    // Filter out selectedMembers with isIncluded as true
    const includedMembers = selectedMembers.filter(
      (member) => member.isIncluded
    );

    // Create an array containing memberId and amount for each included member
    // const split = includedMembers.map((member) => ({
    //   memberId: member.memberId,
    //   amount: member.amount,
    // }));
    const split = selectedMembers.map((member) => ({
      isIncluded: member.isIncluded,
      memberId: member.memberId,
      amount: member.amount,
    }));

    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      split: split,
    }));

    setIncludedMembers(split);
  };

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function fetchMembers() {
      if (billId) {
        const membersData = await getMembers(Number(billId));
        setMembers(membersData);
      }
    }
    fetchMembers();
  }, [billId]);

  useEffect(() => {
    if (members.length > 0) {
      console.log("RESET MEMBERS");
      //initializeSplits();
      initiateIncludedMembers();
    }
  }, [members]);

  useEffect(() => {
    console.log("Splits", JSON.stringify(transaction.split));
    console.log("Current user", currentUser);
  }, [transaction.split]);

  return (
    // <ScrollView>
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
        <Form onSubmit={onEditTxn} rowGap="$3" borderRadius="$4" padding="$3">
          <Fieldset gap="$4" horizontal justifyContent="center">
            <Input
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
                Transaction name:
              </Text>
              <Input
                flex={1}
                id="transaction-name"
                placeholder="Enter Name"
                defaultValue=""
                value={transaction.name}
                onChangeText={handleNameChange}
                backgroundColor={"$backgroundTransparent"}
              />
            </Fieldset>
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
              <Text paddingLeft="$1.5" fontSize={"$1"}>
                Paid by:
              </Text>
              <MembersDropdown
                members={members}
                onPayerChange={handlePayerChange}
                defaultPayer={transaction.payerid || ""}
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
          <Separator />
          <XStack gap="$3" justifyContent="space-between">
            <Button color={"$red10Light"} onPress={onDeleteTxn}>
              Delete
            </Button>
            <Form.Trigger asChild>
              <Button>Submit</Button>
            </Form.Trigger>
          </XStack>
        </Form>
      </BodyContainer>
    </OuterContainer>

    //   <YStack>
    //     <Text>IsEven: {isEven.toString()}</Text>
    //     <Text>Txn name: {transaction.name}</Text>
    //     <Text>Amount: {transaction.amount}</Text>
    //     <Text>Payer: {transaction.payerid}</Text>
    //     <Text>SubmittedBy: {transaction.submittedbyid}</Text>
    //     <Text>Split: {JSON.stringify(transaction.split)}</Text>
    //     <Text>Submitted By: {transaction.submittedbyid}</Text>
    //     <Text>Members: {JSON.stringify(members)}</Text>
    //     <Text>Included Members: {JSON.stringify(includedMembers)}</Text>
    //   </YStack>
    // </ScrollView>
  );
};

export default EditTransactionPage;
