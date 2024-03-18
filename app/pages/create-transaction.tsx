import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import CustomSplit from "@/components/create-transaction/custom-split";
import MembersDropdown from "@/components/create-transaction/members-dropdown";
import SplitView from "@/components/create-transaction/split-view";
import { getMembers } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { SelectedMemberSplitAmount, Transaction } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, useWindowDimensions } from "react-native";
import {
  Button,
  Fieldset,
  Form,
  Input,
  Label,
  Paragraph,
  Separator,
  TooltipSimple,
  View,
  XStack,
  YStack,
} from "tamagui";
interface Member {
  userid: string;
  // Add other properties if necessary
}

interface CreateTransaction {
  billId: any;
  userId: any;
  members: Member[]; // Ensure correct type for members
}

export const CreateTransactionPage: React.FC<CreateTransaction> = () => {
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

  const { billId, userId } = useLocalSearchParams();
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
    let numericValue = parseFloat(amount.replace(/[^\d.]/g, ""));

    if (!numericValue) {
      numericValue = 0;
    }

    // Update transaction state
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      amount: numericValue, // Ensure amount is a number
    }));
  };

  const onCreateTxn = async () => {
    let _userId = userId.toString();
    transaction.submittedbyid = _userId;
    transaction.billid = Number(billId);
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select();

    if (error) {
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

  const fetchData = async () => {
    if (billId) {
      const membersData = await getMembers(Number(billId));
      setMembers(membersData);
      // initializeSplits();
    }
  };

  const initializeSplits = () => {
    let amountNum = transaction.amount;
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
    const fetchDataAndInitializeSplits = async () => {
      if (billId) {
        try {
          const membersData = await getMembers(Number(billId));
          setMembers(membersData);
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      }
    };

    fetchDataAndInitializeSplits();
  }, [billId]);

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
    if (members.length > 0) {
      console.log("RESET MEMBERS");
      initializeSplits();
      initiateIncludedMembers();
    }
  }, [members, transaction.amount]);

  useEffect(() => {
    console.log("Splits", JSON.stringify(transaction.split));
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
        <Form onSubmit={onCreateTxn} rowGap="$3" borderRadius="$6" padding="$3">
          <Fieldset gap="$4" horizontal>
            <Label
              width={160}
              justifyContent="flex-end"
              htmlFor="transactionName"
            >
              Name
            </Label>
            <Input
              flex={1}
              id="transactionInput"
              placeholder="Enter Name"
              defaultValue=""
              value={transaction.name}
              onChangeText={handleNameChange}
            />
          </Fieldset>
          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="amount">
              Amount
            </Label>
            <Input
              flex={1}
              id="amount-input"
              placeholder="Enter a number"
              defaultValue={"0"}
              keyboardType="numeric"
              value={transaction.amount.toString()}
              onChangeText={handleAmountChange}
              inputMode="numeric"
            />
          </Fieldset>
          {/* <Fieldset gap="$4" horizontal>
        <Label width={160} justifyContent="flex-end" htmlFor="amout">
          Split
        </Label>
        <XStack width={200} alignItems="center" gap="$4">
          <Label paddingRight="$0" minWidth={90} justifyContent="flex-end">
            Even
          </Label>
          <Separator minHeight={20} vertical />
          <Switch>
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>
      </Fieldset> */}
          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="payer">
              <TooltipSimple
                label="Pick your favorite"
                placement="bottom-start"
              >
                <Paragraph>Payer</Paragraph>
              </TooltipSimple>
            </Label>

            <MembersDropdown
              members={members}
              onPayerChange={handlePayerChange}
              defaultPayer={userId.toString()}
            />
          </Fieldset>

          <Fieldset gap="$4" horizontal>
            <Label width={160} justifyContent="flex-end" htmlFor="name">
              Submitted By
            </Label>

            <Input
              flex={1}
              id="submittedBy"
              defaultValue=""
              value={userId.toString()}
              disabled={true}
              borderColor={"$colorTransparent"}
              backgroundColor={"$backgroundTransparent"}
              borderBlockColor={"$backgroundTransparent"}
            />
          </Fieldset>
          <XStack justifyContent="flex-end">
            <CustomSplit
              memberSplits={transaction.split}
              amount={transaction.amount}
              onSaveSplits={handleSaveSplits}
              setIsEven={setIsEven}
              includedMembers={includedMembers}
            />
          </XStack>

          <Separator />
          <SplitView
            memberSplits={transaction.split}
            amount={transaction.amount.toString()}
            isEven={isEven}
          />
          <Separator />

          <Form.Trigger asChild>
            <Button>Create</Button>
          </Form.Trigger>
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

export default CreateTransactionPage;
