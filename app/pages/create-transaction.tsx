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
import { useWindowDimensions } from "react-native";
import {
  Button,
  Fieldset,
  Form,
  Input,
  Separator,
  Text,
  XStack,
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

  const onCreateTxn = async () => {
    let _userId = userId.toString();
    transaction.submittedbyid = _userId;
    transaction.billid = Number(billId);
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
      .select();

    if (error) {
      router.replace({
        pathname: `/(bill)/mybill/${billId}`,
        params: { userId: _userId, errorCreateMsg: error.message }, //
      });
    } else {
      if (data) {
        const createdTxn: Transaction = data[0];
        router.replace({
          pathname: `/(bill)/mybill/${billId}`,
          params: { userId: _userId, txnName: createdTxn.name },
        });
      }
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
        <Form
          onSubmit={onCreateTxn}
          rowGap="$3"
          borderRadius="$6"
          padding="$3"
          justifyContent="center"
        >
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
                id="transaction-name"
                placeholder="Enter name"
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
                defaultPayer={userId.toString()}
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
