import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AlertDialog, Button, Switch, XStack, YStack } from "tamagui";

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
}
interface Props {
  billId: number;
  userId: string;
  lock: boolean;
  size: string;
  setLock: (lock: boolean) => void; // Function to update lock state in parent
}

export const ConfirmToggleLock: React.FC<Props> = ({
  billId,
  userId,
  lock,
  size,
  setLock, // Receive setLock function from parent
}) => {
  const router = useRouter();

  const onToggleLock = async () => {
    const { data, error } = await supabase
      .from("bills")
      .update({ isLocked: !lock })
      .eq("billid", billId)
      .select();

    if (data) {
      setLock(data[0].isLocked); // Update lock state in parent
    } else if (error) {
      console.error("Error toggling lock:", error);
    }
  };

  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <Switch size={size}>
          <Switch.Thumb
            animation={[
              "bouncy",
              {
                transform: {
                  overshootClamping: true,
                },
              },
            ]}
          />
        </Switch>
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
              Members won't be able to add, edit, and delete transactions while
              bill is locked. You can always unlock it. Do you want to continue?
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={onToggleLock}>
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

export default ConfirmToggleLock;
