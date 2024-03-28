import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
}
interface Props {
  name: string;
  billId: number;
  userId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSaveNameError: React.Dispatch<React.SetStateAction<boolean>>;
}
//pass: name, billId, userId

export const ConfirmSaveName: React.FC<Props> = ({
  name,
  billId,
  userId,
  setOpen,
  setSaveNameError,
}) => {
  const onSubmit = async () => {
    if (name) {
      const { data, error } = await supabase
        .from("bills")
        .update({ name: name })
        .eq("billid", billId)
        .select();

      if (data) {
        console.log("submitted bill: ", data);
        setOpen(true);
        setSaveNameError(false);
        // router.replace({
        //   pathname: `/(bill)/mybill/${billId}`,
        //   params: { userId: userId.toString() },
        // });
      } else if (error) {
        console.log("ERROR", error);
        setSaveNameError(true);
      }
    }
  };
  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <Button>Save</Button>
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
              Are you sure you want to change bill name to: "{name}"
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={onSubmit}>
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

export default ConfirmSaveName;
