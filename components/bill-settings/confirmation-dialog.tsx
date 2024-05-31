import { supabase } from "@/lib/supabase";
import { Trash } from "@tamagui/lucide-icons";
import React from "react";
import { AlertDialog, Button, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
}
interface Props {
  user: Member;
  fetchMembersData: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessError: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedMember: React.Dispatch<React.SetStateAction<string>>;
}

export const ConfirmationDialog: React.FC<Props> = ({
  user,
  fetchMembersData,
  setOpen,
  setProcessError,
  setDeletedMember,
}) => {
  const onDeleteUser = async () => {
    console.log("Delete user");
    const { data, error } = await supabase
      .from("members")
      .update({ isMemberIncluded: false })
      .eq("memberid", user.memberid)
      .select();

    /** owner must not be deleted */
    if (data) {
      fetchMembersData();
      setOpen(true);
      setDeletedMember(data[0].memberid);
    } else if (error) {
      setProcessError(true);
    }
  };
  return (
    <AlertDialog native={false}>
      <AlertDialog.Trigger asChild>
        <StyledButton size={"$2.5"} decline={true}>
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
            <AlertDialog.Title>Accept</AlertDialog.Title>
            <AlertDialog.Description>
              Are you sure you want to remove {user.userid} from the bill
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button theme="active" onPress={onDeleteUser}>
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

export default ConfirmationDialog;
