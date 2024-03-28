import { supabase } from "@/lib/supabase";
import { Member } from "@/types/global";
import { Toast } from "@tamagui/toast";
import { SetStateAction, useEffect, useState } from "react";
import {
  View,
  Text,
  YStack,
  YGroup,
  ListItem,
  Button,
  XStack,
  Separator,
} from "tamagui";

interface Props {
  requests: Member[];
  fetchMembersData: () => void;
}

const JoinRequests: React.FC<Props> = ({ requests, fetchMembersData }) => {
  const [localRequests, setLocalRequests] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [acceptedMember, setAcceptedMember] = useState("");
  const [declinedMember, setDeclinedMember] = useState("");
  const [processError, setProcessError] = useState(false);

  const onAccept = async (memberId: string) => {
    const { data, error } = await supabase
      .from("members")
      .update({ isMemberIncluded: true, isRequestSent: false })
      .eq("memberid", memberId)
      .select();

    if (data) {
      console.log("data", data);
      fetchMembersData();
      setAcceptedMember(data[0].memberId);
      //activate toast here
      setOpen(true);
    } else {
      console.error("Error", error);
      setProcessError(true);
    }
  };

  const onDecline = async (memberId: string) => {
    const { data, error } = await supabase
      .from("members")
      .update({ isMemberIncluded: false, isRequestSent: false })
      .eq("memberid", memberId)
      .select();

    if (data) {
      console.log("data", data);
      fetchMembersData();
      setDeclinedMember(data[0].memberId);
      //activate toast here
      setOpen(true);
    } else {
      console.error("Error", error);
      setProcessError(true);
    }
  };

  useEffect(() => {
    setLocalRequests(requests);
  }, [localRequests]);

  return (
    <View>
      <Text>Requests</Text>
      <YStack gap="$1.5">
        {localRequests.map((member, index) => (
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
                    <Button size="$2" onPress={() => onAccept(member.memberid)}>
                      Accept
                    </Button>
                    <Button
                      size="$2"
                      onPress={() => onDecline(member.memberid)}
                    >
                      Decline
                    </Button>
                    {/* <ConfirmationDialog user={member} /> */}
                  </XStack>
                }
              />
            </YGroup.Item>
          </YGroup>
        ))}
      </YStack>
      <Separator paddingVertical={"$2"} />
      <SaveNameToast
        setOpen={setOpen}
        open={open}
        acceptedMember={acceptedMember}
        declinedMember={declinedMember}
        processError={processError}
      />
    </View>
  );
};

export default JoinRequests;

interface SaveNameToastProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  acceptedMember: string;
  declinedMember: string;
  processError: boolean;
}

const SaveNameToast: React.FC<SaveNameToastProps> = ({
  setOpen,
  open,
  acceptedMember,
  processError,
  declinedMember,
}) => {
  const acceptMemberMsg = `${acceptedMember} successfuly joined!`;
  const declineMemberMsg = `Declined ${declinedMember} from joining.`;
  const errorMsg = "Error processing request";
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
      {errorMsg ? (
        <Toast.Title textAlign="left">
          {processError ? errorMsg : acceptMemberMsg}
        </Toast.Title>
      ) : (
        <Toast.Title textAlign="left">
          {acceptedMember ? acceptMemberMsg : declineMemberMsg}
        </Toast.Title>
      )}
    </Toast>
  );
};
