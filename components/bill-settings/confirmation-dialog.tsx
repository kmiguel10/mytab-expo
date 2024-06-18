import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";
import { Member } from "@/types/global";

interface Props {
  user: Member;
  fetchMembersData: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessError: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedMember: React.Dispatch<React.SetStateAction<string>>;
  isBillExpired: boolean;
}

export const ConfirmationDialog: React.FC<Props> = ({
  user,
  fetchMembersData,
  setOpen,
  setProcessError,
  setDeletedMember,
  isBillExpired,
}) => {
  const onDeleteUser = async () => {
    const { data, error } = await supabase
      .from("members")
      .update({ isMemberIncluded: false })
      .eq("memberid", user.memberid)
      .select();

    /** owner must not be deleted */
    if (data) {
      fetchMembersData();
      setOpen(true);
      setDeletedMember(data[0].displayName);
    } else if (error) {
      setProcessError(true);
    }
  };
  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton
          size={"$2.5"}
          decline={!isBillExpired}
          disabled={isBillExpired}
        >
          Delete
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
          <YStack gap>
            <AlertDialog.Title paddingBottom="$2">
              Delete user
            </AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to remove {user.displayName} from the bill?
            </AlertDialog.Description>
            <XStack gap="$4" justifyContent="flex-end" paddingTop="$4">
              <AlertDialog.Cancel asChild>
                <StyledButton>Cancel</StyledButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton active={true} onPress={onDeleteUser}>
                  Accept
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
