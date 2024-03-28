import { getMembersAndRequests } from "@/lib/api";
import { useEffect, useState } from "react";
import { Button, ScrollView, View } from "tamagui";
import CurrentMembers from "./current-members";
import JoinRequests from "./join-requests";
import { Toast, ToastViewport } from "@tamagui/toast";
import React from "react";

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

  const [open, setOpen] = useState(false);
  const timerRef = React.useRef(0);
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
      <Toast
        onOpenChange={setOpen}
        open={open}
        animation="100ms"
        enterStyle={{ x: -20, opacity: 0 }}
        exitStyle={{ x: -20, opacity: 0 }}
        opacity={1}
        x={0}
        backgroundColor={"$green8Light"}
        height={"400"}
        width={"80%"}
        justifyContent="center"
      >
        <Toast.Title textAlign="left">{"Transaction created"}</Toast.Title>
        <Toast.Description>{`You entered:`}</Toast.Description>
      </Toast>
      <Button
        onPress={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 150);
        }}
      >
        Single Toast
      </Button>
    </View>
  );
};

export default EditMembers;
