import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Separator,
  XStack,
  YStack,
  ZStack,
} from "tamagui";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import PayerDropdown from "@/components/create-transaction/payer-dropdown";

const CreateTransaction = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const { billId, userId } = useLocalSearchParams();

  const handleAmountChange = (newValue: string) => {
    setAmount(newValue.toString());
  };

  /**Fetch members of the bill */
  const getMembers = async () => {
    let { data, error } = await supabase
      .from("members")
      .select("userid")
      .eq("billid", billId);

    if (data) {
      setMembers(data);
    } else {
      console.log("Members Error: ", error);
      setMembers([]);
    }
  };
  useEffect(() => {
    if (billId) getMembers();
    console.log("Members: ", members);
  }, [billId]);
  return (
    <YStack>
      <Form onSubmit={() => console.log("Submit transaction")}>
        <XStack alignItems="center">
          <Input
            flex={2}
            size={3}
            placeholder="Name of Transaction"
            value={name}
            onChangeText={setName}
          />
        </XStack>
        <XStack>
          <Input
            flex={2}
            size={3}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount.toString()}
            onChangeText={handleAmountChange}
          />
        </XStack>
        <XStack>
          <PayerDropdown dropdownValues={members} />
        </XStack>
        <XStack>
          <Form.Trigger asChild>
            <Button>Submit</Button>
          </Form.Trigger>
        </XStack>
        <Separator borderBlockColor={"black"} />
        <XStack>
          <Text>
            Dropdown for payer default is userId (the one submitting){" "}
          </Text>
        </XStack>
        <XStack>
          <Text>Split component</Text>
        </XStack>
        <XStack>
          <Text>Submit Cancel Buttons</Text>
        </XStack>
        <YStack>
          <Text>DATA: {name}</Text>
          <Text>Amount: {amount}</Text>
          <Text>Payer: {payer}</Text>
          <Text>BillId: {billId}</Text>
          <Text>UserId: {userId}</Text>
          <Text>Members: {JSON.stringify(members)}</Text>
        </YStack>
      </Form>
    </YStack>
  );
};

export default CreateTransaction;
