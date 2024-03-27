import { getMembersAndRequests } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  ListItem,
  ScrollView,
  Text,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import ConfirmationDialog from "./confirmation-dialog";
import JoinRequests from "./join-requests";
import CurrentMembers from "./current-members";

interface Props {
  billId: number;
  ownerId: string;
  height: number;
}

interface Member {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
  isRequestSent: boolean;
}

const EditMembers: React.FC<Props> = ({ billId, ownerId, height }) => {
  const [members, setMembers] = useState<Member[]>([]);

  // Don't display owner id
  const filteredMembers = members.filter((member) => member.userid !== ownerId);

  const includedMembers = filteredMembers.filter(
    (member) =>
      member.isMemberIncluded === true && member.isRequestSent === false
  );

  const requests = filteredMembers.filter(
    (member) =>
      member.isMemberIncluded === false && member.isRequestSent === true
  );

  const fetchMembersData = async () => {
    if (billId) {
      try {
        const membersData = await getMembersAndRequests(Number(billId));
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }
  };
  //Get included members
  useEffect(() => {
    fetchMembersData();
  }, [billId]);
  return (
    <View height={height} padding="$3">
      <ScrollView>
        {requests.length > 0 && (
          <JoinRequests
            requests={requests}
            fetchMembersData={fetchMembersData}
          />
        )}

        <CurrentMembers
          includedMembers={includedMembers}
          fetchMembersData={fetchMembersData}
        />
      </ScrollView>
      {/* <Text>{JSON.stringify(members)}</Text> */}
    </View>
  );
};

export default EditMembers;
