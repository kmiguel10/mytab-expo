import { View, Text } from "react-native";
import React, { useState } from "react";
import { AlertDialog, Button, Input, XStack, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";

const CreateBill = () => {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  //TODO: send joined bill to homepage and display on toast
  const [name, setName] = useState("");

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
      console.log("BOOL", newBillData);
      console.log("Bill Created: ", data);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { newBillId: newBillData?.billid ?? null }, // Add userId to params
      });
    } else {
      //console.error("Error creating bill: ", error);
      //display error here , or just create a , there is an error toast
      if (error) {
        router.replace({
          pathname: `/(homepage)/${id}`,
          params: { errorCreateMessage: "Error creating bill" },
          // params: { errorMessage: error.message },
          // Add userId to params
        });
      }
    }
  };
  /**
   * TODO
   * Is there a better way to position this dynamically?
   *
   */
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button>Create</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.9}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={-230}
          width={"90%"}
        >
          <YStack space>
            <AlertDialog.Title>Create Bill</AlertDialog.Title>
            <AlertDialog.Description size={"$5"}>
              Enter Bill Name:
            </AlertDialog.Description>
            <XStack alignItems="center" space="$2">
              <Input
                flex={1}
                size={3}
                placeholder="Ex: Cancun Trip !!!"
                value={name}
                onChangeText={setName}
              />
            </XStack>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button onPress={() => router.back}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={onCreateBill}>
                  Create
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default CreateBill;
