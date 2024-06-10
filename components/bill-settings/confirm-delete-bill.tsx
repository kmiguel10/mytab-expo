import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  billId: number;
  userId: string;
}

export const ConfirmDeleteBill: React.FC<Props> = ({ billId, userId }) => {
  const router = useRouter();
  //Set flags for bills
  const onDelete = async () => {
    const { data, error } = await supabase
      .from("bills")
      .update({ isdeleted: true, isActive: false })
      .eq("billid", billId)
      .select();

    if (data) {
      router.replace({
        pathname: `/(homepage)/[id]`,
        params: {
          id: userId.toString(),
          successDeletedBillMsg: "Successfully Deleted Bill",
        },
      });
    } else if (error) {
      router.replace({
        pathname: `/(homepage)/[id]`,
        params: { id: userId.toString(), errorMessage: "Error Deleting bill" },
      });
    }
  };
  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          delete={true}
          icon={<Trash size={"$1"} color={"$red10Light"} />}
          backgroundColor={"$red4Light"}
          size={"$4"}
          width={"25%"}
        />
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
            <AlertDialog.Title>Delete Bill</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete bill?
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton decline={true} onPress={onDelete}>
                  Delete
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmDeleteBill;
