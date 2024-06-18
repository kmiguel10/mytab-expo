import { Member } from "@/types/global";
import { Toast } from "@tamagui/toast";
import { useState } from "react";
import { ListItem, SizableText, View, XStack, YGroup, YStack } from "tamagui";
import Avatar from "../login/avatar";
import ConfirmationDialog from "./confirmation-dialog";

interface Props {
  includedMembers: Member[];
  fetchMembersData: () => void;
  isOwner: boolean;
  ownerId: string;
  isFreeBill: boolean;
  isBillExpired: boolean;
}

const CurrentMembers: React.FC<Props> = ({
  includedMembers,
  fetchMembersData,
  isOwner,
  ownerId,
  isFreeBill,
  isBillExpired,
}) => {
  const [open, setOpen] = useState(false);
  const [deletedMember, setDeletedMember] = useState("");
  const [processError, setProcessError] = useState(false);

  return (
    <View>
      <XStack alignItems="center" gap="$2">
        <SizableText paddingBottom="$3" paddingTop={"$3"}>
          Members ({includedMembers.length > 0 ? includedMembers.length : 0})
        </SizableText>
        {isFreeBill && (
          <View
            backgroundColor={"$blue4Light"}
            paddingHorizontal={"$2"}
            paddingVertical={"$1"}
            alignItems="center"
            borderRadius={"$12"}
          >
            <SizableText fontSize={"$2"}>{"Free Plan Max: 2"}</SizableText>
          </View>
        )}
      </XStack>
      <YStack gap="$1.5">
        {includedMembers.map((member, index) => (
          <YGroup
            alignSelf="center"
            bordered
            width={"100%"}
            size="$5"
            padding={"$1"}
            key={index}
          >
            <YGroup.Item>
              <ListItem
                key={index}
                icon={<Avatar url={member.avatar_url} size="$4" />}
                title={member.displayName}
                subTitle={member.userid === ownerId ? "Owner" : "Member"}
                iconAfter={
                  !isOwner ? (
                    <View />
                  ) : member.userid === ownerId ? (
                    <View />
                  ) : (
                    <XStack gap="$2">
                      <ConfirmationDialog
                        user={member}
                        fetchMembersData={fetchMembersData}
                        setOpen={setOpen}
                        setProcessError={setProcessError}
                        setDeletedMember={setDeletedMember}
                        isBillExpired={isBillExpired}
                      />
                    </XStack>
                  )
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
