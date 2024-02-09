import { View, Text } from "react-native";
import React, { useState } from "react";
import { Button, Input, XStack, YStack } from "tamagui";
import { useLocalSearchParams } from "expo-router";

const JoinBill = () => {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const joinBill = () => {};
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
        <Button>Join</Button>
      </XStack>
    </YStack>
  );
};

export default JoinBill;
