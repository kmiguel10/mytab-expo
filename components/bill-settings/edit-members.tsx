import { getMembersAndRequests } from "@/lib/api";
import { useEffect, useState } from "react";
import { Button, ScrollView, Separator, View } from "tamagui";
import CurrentMembers from "./current-members";
import JoinRequests from "./join-requests";
import { Toast, ToastViewport } from "@tamagui/toast";
import React from "react";
import { Member } from "@/types/global";
import { RefreshControl } from "react-native";

interface Props {
  billId: number;
  ownerId: string;
  height: number;
  isOwner: boolean;
}

const EditMembers: React.FC<Props> = ({ billId, ownerId, height, isOwner }) => {
  /** ---------- States ---------- */
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /** ---------- Helper Functions ---------- */
  const filteredMembers = members.filter((member) => member.userid !== ownerId);
  const includedMembers = filteredMembers.filter(
    (member) =>
      member.isMemberIncluded === true && member.isRequestSent === false
  );
  const requests = filteredMembers.filter(
    (member) =>
      member.isMemberIncluded === false && member.isRequestSent === true
  );

  /** ---------- Functions---------- */
  const fetchMembersData = async () => {
    if (billId) {
      try {
        const membersData = await getMembersAndRequests(Number(billId));
        setMembers(membersData);
        if (membersData) setRefreshing(false);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }
  };

  const handleRefresh = async () => {
    console.log(" - - - Pull Down refresh Members - - - -");
    setRefreshing(true);
    fetchMembersData();
  };

  const timerRef = React.useRef(0);

  /** ---------- UseEffects---------- */
  //Get included members
  useEffect(() => {
    fetchMembersData();
  }, [billId]);

  return (
    <View height={height} padding="$3">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {requests.length > 0 && isOwner && (
          <JoinRequests
            requests={requests}
            fetchMembersData={fetchMembersData}
          />
        )}

        {requests.length > 0 && includedMembers.length > 0 && (
          <Separator paddingTop={"$2"} paddingBottom={"$2"} />
        )}

        {includedMembers.length > 0 && (
          <CurrentMembers
            includedMembers={includedMembers}
            fetchMembersData={fetchMembersData}
            isOwner={isOwner}
          />
        )}
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
      {/* <Button
        onPress={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 150);
        }}
      >
        Single Toast
      </Button> */}
    </View>
  );
};

export default EditMembers;
