import { View, Text } from "react-native";
import React, { useState } from "react";
import { AlertDialog, Button, Input, XStack, YStack } from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const JoinBill = () => {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const router = useRouter();

  const joinAsMember = async () => {
    let { data, error } = await supabase
      .from("members")
      .insert([{ userid: id, billcode: code }])
      .eq("billcode", code)
      .select();

    console.log("Data: ", data);
    console.log("Error: ", error);
    router.replace(`/(homepage)/${id}`);
  };
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button color="$blue10Light">Join Bill</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
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
          y={0}
        >
          <YStack space>
            <AlertDialog.Title>Join Bill</AlertDialog.Title>
            <AlertDialog.Description>Enter bill code:</AlertDialog.Description>
            <Input placeholder="Enter Bill Code" onChangeText={setCode} />

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={joinAsMember}>
                  Accept
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
  // return (
  //   <YStack>
  //     <XStack>
  //       <YStack>
  //         <Text>JoinBill</Text>
  //       </YStack>
  //     </XStack>
  //     <XStack alignContent="space-between">
  //       <Input placeholder="Enter Bill Code" onChangeText={setCode} />
  //       <Button onPress={joinAsMember}>Join</Button>
  //     </XStack>
  //   </YStack>
  // );
};

export default JoinBill;
