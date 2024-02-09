import { View, Text } from "react-native";
import React, { useState } from "react";
import { Button, Form, Input, XStack, YStack } from "tamagui";

const CreateTransaction = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  return (
    <YStack>
      <Form onSubmit={() => console.log("Submit transaction")}>
        <XStack alignItems="center" space="$2">
          <Input
            flex={2}
            size={3}
            placeholder="Name of Transaction"
            value={name}
            onChangeText={setName}
          />
        </XStack>
        <XStack>
          <Input />
        </XStack>
        <XStack>
          <Text>DATA: {name}</Text>
        </XStack>
        <XStack>
          <Form.Trigger asChild>
            <Button>Submit</Button>
          </Form.Trigger>
        </XStack>
      </Form>
    </YStack>
  );
};

export default CreateTransaction;
