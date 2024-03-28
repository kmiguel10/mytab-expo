import { supabase } from "@/lib/supabase";
import { Member } from "@/types/global";
import { useEffect, useState } from "react";
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

  const onAccept = async (memberId: string) => {
    const { data, error } = await supabase
      .from("members")
      .update({ isMemberIncluded: true, isRequestSent: false })
      .eq("memberid", memberId)
      .select();

    if (data) {
      console.log("data", data);
      // Remove the accepted member from localRequests
      setLocalRequests((prevRequests) =>
        prevRequests.filter((member) => member.memberid !== memberId)
      );
      fetchMembersData();
      //activate toast here
    } else {
      console.error("Error", error);
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
      // Remove the declined member from localRequests
      setLocalRequests((prevRequests) =>
        prevRequests.filter((member) => member.memberid !== memberId)
      );
      fetchMembersData();
      //activate toast here
    } else {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    setLocalRequests(requests);
    fetchMembersData();
  }, [requests]);

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
            key={member.memberid}
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
                  </XStack>
                }
              />
            </YGroup.Item>
          </YGroup>
        ))}
      </YStack>
      <Separator paddingVertical={"$2"} />
    </View>
  );
};

export default JoinRequests;
