import { supabase } from "@/lib/supabase";
import { Member } from "@/types/global";
import { useEffect, useState } from "react";
import {
  ListItem,
  SizableText,
  Text,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import Avatar from "../login/avatar";

interface Props {
  requests: Member[];
  fetchMembersData: () => void;
  isMaxMembersReached: boolean;
  isBillExpired: boolean;
}

const JoinRequests: React.FC<Props> = ({
  requests,
  fetchMembersData,
  isMaxMembersReached,
  isBillExpired,
}) => {
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
  }, [requests.length]);

  return (
    <View>
      <SizableText paddingBottom="$3">Requests ({requests.length})</SizableText>
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
                      create={!isMaxMembersReached && !isBillExpired}
                      size="$2.5"
                      onPress={() => onAccept(member.memberid)}
                      disabled={isMaxMembersReached || isBillExpired}
                    >
                      Accept
                    </StyledButton>
                    <StyledButton
                      disabled={isBillExpired}
                      decline={!isBillExpired}
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
