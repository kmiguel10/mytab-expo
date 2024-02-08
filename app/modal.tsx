import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Form, H4, Input, Spinner, XStack, YStack } from "tamagui";

const testBill = {};

const ModalScreen = () => {
  const { id } = useLocalSearchParams();
  const [status, setStatus] = useState<"off" | "submitting" | "submitted">(
    "off"
  );
  const [name, setName] = useState("");

  const CreateBill = async () => {
    console.log("User id: ", id);
    setStatus("submitting");

    const { data, error } = await supabase
      .from("bills")
      .insert([{ ownerid: id, name: name }])
      .select();

    console.log("DATA", data);
    console.log("Error", error);
  };

  useEffect(() => {
    if (status === "submitting") {
      const timer = setTimeout(() => setStatus("off"), 2000);
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
      <H4>{status[0].toUpperCase() + status.slice(1)}</H4>

      <Form.Trigger asChild disabled={status !== "off"}>
        <YStack
          width={200}
          minHeight={250}
          overflow="hidden"
          space="$2"
          margin="$3"
          padding="$2"
        >
          <XStack alignItems="center" space="$2">
            <Input
              flex={1}
              size={3}
              placeholder="Name of Bill"
              value={name}
              onChangeText={setName}
            />
            <Button
              icon={status === "submitting" ? () => <Spinner /> : undefined}
            >
              Submit
            </Button>
          </XStack>
        </YStack>
      </Form.Trigger>
    </Form>
  );
};

export default ModalScreen;
