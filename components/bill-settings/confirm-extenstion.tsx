import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  AlertDialog,
  Button,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";

const ConfirmExtension = () => {
  /************ States and Variables ************/
  const { width, height } = useWindowDimensions();
  const confirmSaveMessage = `Are you sure you want to save changes to bill: ""`;

  const confirmPurchaseMessage =
    "Are you sure you want to extend your bill for 1 week?";

  const title = "Purchase extension";

  /************ Functions ************/
  const onSubmit = async () => {
    // if (name) {
    //   const { data, error } = await supabase
    //     .from("bills")
    //     .update({ name: name, start_date: date, end_date: endDate })
    //     .eq("billid", billId)
    //     .select();
    //   if (data) {
    //     console.log("submitted bill: ", data);
    //     setOpen(true);
    //     setSaveNameError(false);
    //     // router.replace({
    //     //   pathname: `/(bill)/mybill/${billId}`,
    //     //   params: { userId: userId.toString() },
    //     // });
    //   } else if (error) {
    //     console.log("ERROR", error);
    //     setSaveNameError(true);
    //   }
    // }
  };
  const purchaseExtension = () => {
    console.log("Purchase extension");
  };

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          active={true}
          width={width * 0.25}
          size={"$3.5"}
          disabled={false}
        >
          Extend
        </StyledButton>
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
          <YStack gap="$4">
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>
              {confirmPurchaseMessage}
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton active={true} onPress={purchaseExtension}>
                  Purchase
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmExtension;
