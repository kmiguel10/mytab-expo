import { supabase } from "@/lib/supabase";
import { useToastController } from "@tamagui/toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Form,
  H4,
  Input,
  Spinner,
  View,
  XStack,
  YStack,
} from "tamagui";

const ModalScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );
  const [name, setName] = useState("");
  const [billCreatedSuccess, setBillCreatedSuccess] = useState("false");

  const onCreateBill = async () => {
    console.log("User id: ", id);

    if (!name) {
      console.error("Error: Name cannot be null");
      return; // Exit the function if name is null
    }

    const { data, error } = await supabase
      .from("bills")
      .insert([{ ownerid: id, name: name }])
      .select();

    console.log("DATA", data);
    console.log("Error", error);

    if (data) {
      console.log("Navigate to homepage");
      setBillCreatedSuccess("true");
      console.log("BOOL", billCreatedSuccess);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { billCreatedSuccess: "true" }, // Add userId to params
      });
    } else {
      console.error("Error creating bill: ", error);
    }
  };

  const handleCloseModal = () => {
    router.back();
  };

  return (
    <View>
      <Form
        alignItems="center"
        minWidth={300}
        gap="$2"
        onSubmit={onCreateBill}
        backgroundColor="$background"
        borderColor="$borderColor"
        padding="$8"
        height="100%"
      >
        <YStack>
          <XStack>
            <H4>Create Bill</H4>
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
          <XStack justifyContent="space-between">
            <Form.Trigger asChild disabled={status !== "off"}>
              <Button
                icon={status === "submitting" ? () => <Spinner /> : undefined}
              >
                Submit
              </Button>
            </Form.Trigger>
            <Button onPress={handleCloseModal}>Cancel</Button>
          </XStack>
        </YStack>
      </Form>
    </View>
  );
};

export default ModalScreen;
