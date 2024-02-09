import { View, Text } from "react-native";
import React, { useState } from "react";
import { Button, Input, XStack, YStack } from "tamagui";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";

const JoinBill = () => {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState("");

  const joinAsMember = async () => {
    let { data, error } = await supabase
      .from("members")
      .insert([{ userid: id, billcode: code }])
      .eq("billcode", code)
      .select();

    console.log("Data: ", data);
    console.log("Error: ", error);
  };
  return (
    <YStack>
      <XStack>
        <YStack>
          <Text>JoinBill</Text>
          <Text>Current user: {id}</Text>
        </YStack>
      </XStack>
      <XStack alignContent="space-between">
        <Input placeholder="Enter Bill Code" onChangeText={setCode} />
        <Button onPress={joinAsMember}>Join</Button>
      </XStack>
    </YStack>
  );
};

export default JoinBill;
