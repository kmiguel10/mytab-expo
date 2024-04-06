import { View, Text, YStack, YGroup, ListItem, XStack } from "tamagui";
import ConfirmationDialog from "./confirmation-dialog";
import { Member } from "@/types/global";
import { Toast } from "@tamagui/toast";
import { SetStateAction, useState } from "react";

interface Props {
  includedMembers: Member[];
  fetchMembersData: () => void;
}

const CurrentMembers: React.FC<Props> = ({
  includedMembers,
  fetchMembersData,
}) => {
  const [open, setOpen] = useState(false);
  const [deletedMember, setDeletedMember] = useState("");
  const [processError, setProcessError] = useState(false);

  return (
    <View>
      <Text>Members</Text>
      <YStack gap="$1.5">
        {includedMembers.map((member, index) => (
          <YGroup
            alignSelf="center"
            bordered
            width={"100%"}
            size="$5"
            padding={"$1"}
          >
            <YGroup.Item>
              <ListItem
                title={member.userid}
                iconAfter={
                  <XStack gap="$2">
                    <ConfirmationDialog
                      user={member}
                      fetchMembersData={fetchMembersData}
                      setOpen={setOpen}
                      setProcessError={setProcessError}
                      setDeletedMember={setDeletedMember}
                    />
                  </XStack>
                }
              />
            </YGroup.Item>
          </YGroup>
        ))}
      </YStack>
      <DeletedMemberToast
        setOpen={setOpen}
        open={open}
        deletedMember={deletedMember}
        processError={processError}
      />
    </View>
  );
};

export default CurrentMembers;

interface DeleteMembersToastProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  deletedMember: string;
  processError: boolean;
}

const DeletedMemberToast: React.FC<DeleteMembersToastProps> = ({
  setOpen,
  open,
  processError,
  deletedMember,
}) => {
  const deletedMemberMsg = `${deletedMember} successfuly deleted!`;
  const errorMsg = `Error deleting member`;
  return (
    <Toast
      onOpenChange={setOpen}
      open={open}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={processError ? "$red8Light" : "$green8Light"}
      width={"80%"}
      justifyContent="center"
    >
      <Toast.Title textAlign="left">
        {processError ? errorMsg : deletedMemberMsg}
      </Toast.Title>
    </Toast>
  );
};
