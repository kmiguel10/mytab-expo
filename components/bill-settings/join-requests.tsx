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
  H6,
} from "tamagui";
import Avatar from "../login/avatar";
import { StyledButton } from "../button/button";

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
    console.log(" ### UseEffect in join requests");
  }, []);

  return (
    <View>
      <Text paddingBottom="$3">Requests</Text>
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
                key={index}
                icon={<Avatar url={member.avatar_url} size="$4" />}
                title={<Text>{member.displayName}</Text>}
                iconAfter={
                  <XStack gap="$2">
                    <StyledButton
                      create={true}
                      size="$2.5"
                      onPress={() => onAccept(member.memberid)}
                    >
                      Accept
                    </StyledButton>
                    <StyledButton
                      decline={true}
                      size="$2.5"
                      onPress={() => onDecline(member.memberid)}
                    >
                      Decline
                    </StyledButton>
                  </XStack>
                }
              />
            </YGroup.Item>
          </YGroup>
        ))}
      </YStack>
    </View>
  );
};

export default JoinRequests;
