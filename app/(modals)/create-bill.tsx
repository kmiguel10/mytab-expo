import { supabase } from "@/lib/supabase";
import { useToastController } from "@tamagui/toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { BillData } from "@/types/global";
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
  const [newBill, setNewBill] = useState<BillData | null>(null);

  const onCreateBill = async () => {
    if (!name) {
      console.error("Error: Name cannot be null");
      return; // Exit the function if name is null
      //change variant of input component here to error
    }

    const { data, error } = await supabase
      .from("bills")
      .insert([{ ownerid: id, name: name }])
      .select();

    console.log("DATA", data);
    console.log("Error", error);

    if (data && data.length > 0) {
      console.log("Navigate to homepage");
      const newBillData: BillData = data[0] as BillData;
      setNewBill(newBillData);
      console.log("BOOL", newBill);
      console.log("Bill Created: ", data);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { newBillId: newBill?.billid ?? "" }, // Add userId to params
      });
    } else {
      console.error("Error creating bill: ", error);
      //display error here , or just create a , there is an error toast
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
