import { supabase } from "@/lib/supabase";
import { Redirect, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  H2,
  H4,
  Input,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { useRouter } from "expo-router";

const ModalScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );
  const [name, setName] = useState("");

  const CreateBill = async () => {
    console.log("User id: ", id);

    const { data, error } = await supabase
      .from("bills")
      .insert([{ ownerid: id, name: name }])
      .select();

    console.log("DATA", data);
    console.log("Error", error);
    if (data) {
      console.log("Navigate to homepage");
      router.replace(`/(homepage)/${id}`);
    } else {
      console.error("Error creating bill: ", error);
    }
  };

  const handleCloseModal = () => {
    router.back();
  };

  useEffect(() => {
    if (status === "submitting") {
      const timer = setTimeout(() => setStatus("off"));
      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);
  return (
    <Form
      alignItems="center"
      minWidth={300}
      gap="$2"
      onSubmit={CreateBill}
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
    >
      <YStack>
        <XStack>
          <H4>Create Bill</H4>
        </XStack>
        <XStack>
          <Text>Bill owner: {id}</Text>
        </XStack>
        <XStack alignItems="center" space="$2">
          <Input
            flex={1}
            size={3}
            placeholder="Name of Bill"
            value={name}
            onChangeText={setName}
          />
        </XStack>
        <XStack alignContent="space-between">
          <Form.Trigger asChild disabled={status !== "off"}>
            <Button
              icon={status === "submitting" ? () => <Spinner /> : undefined}
            >
              Submit
            </Button>
          </Form.Trigger>
          <Button onPress={handleCloseModal}>Cancel</Button>
        </XStack>
        <XStack></XStack>
      </YStack>
    </Form>
  );
};

export default ModalScreen;
