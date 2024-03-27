import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AlertDialog, Button, Input, XStack, YStack } from "tamagui";

const JoinBill = () => {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const router = useRouter();

  //TODO: send joined bill to homepage and display on toast
  const joinAsMember = async () => {
    if (!code) {
      console.error("Error: Billcode cannot be null");
      return;
    }
    let { data, error } = await supabase
      .from("members")
      .insert([{ userid: id, billcode: code }])
      .eq("billcode", code)
      .select();

    if (data && data.length > 0) {
      console.log("Data: ", data);
      console.log("Error: ", error);
      const joinedBillData: BillData = data[0] as BillData;
      // router.replace(`/(homepage)/${id}`);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { joinedBillCode: joinedBillData?.billid ?? null }, // Add userId to params
      });
    } else {
      //console.error("Error joining bill: ", error);
      //display error here , or just create a , there is an error toast

      //Send error message
      if (error) {
        console.error("error", error);
        router.replace({
          pathname: `/(homepage)/${id}`,
          params: { errorMessage: "Error joining bill" },
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
        <Button>Join</Button>
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
            <AlertDialog.Title>Join Bill</AlertDialog.Title>
            <AlertDialog.Description size={"$5"}>
              Enter Bill code:
            </AlertDialog.Description>
            <Input placeholder="Example: 12GH89" onChangeText={setCode} />

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button onPress={() => router.back}>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={joinAsMember}>
                  Join
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default JoinBill;
