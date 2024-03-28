import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
}
interface Props {
  billId: number;
  userId: string;
}
//pass: name, billId, userId

export const ConfirmDeleteBill: React.FC<Props> = ({ billId, userId }) => {
  const router = useRouter();
  const onDelete = async () => {
    console.log("delete bill", billId);

    const { data, error } = await supabase
      .from("bills")
      .update({ isdeleted: true })
      .eq("billid", billId)
      .select();

    if (data) {
      console.log("Deleted bill: ", data);
      router.replace({
        pathname: "/(homepage)/[id]",
        params: { id: userId.toString() },
      });
    } else if (error) {
    }
  };
  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <Button>Delete</Button>
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
          <YStack gap>
            <AlertDialog.Title>Accept</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to delete bill?
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={onDelete}>
                  Accept
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmDeleteBill;
