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
  isFreeBill: boolean;
}

const EditMembers: React.FC<Props> = ({
  billId,
  ownerId,
  height,
  isOwner,
  isFreeBill,
}) => {
  /** ---------- States ---------- */
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [includedMembers, setIncludedMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
  useEffect(() => {
    fetchMembersData();
  }, [billId]);

  useEffect(() => {
    // Filter out the owner from members
    let filtered = members.filter((member) => member.userid !== ownerId);

    // Create included members and requests arrays
    let included = filtered.filter(
      (member) =>
        member.isMemberIncluded === true && member.isRequestSent === false
    );
    let reqs = filtered.filter(
      (member) =>
        member.isMemberIncluded === false && member.isRequestSent === true
    );

    // Add the owner to the filteredMembers
    const ownerMember = members.find((member) => member.userid === ownerId);
    if (ownerMember) {
      included = [...included, ownerMember];
    }

    // Set state with the updated arrays
    setFilteredMembers(filtered);
    setIncludedMembers(included);
    setRequests(reqs);
  }, [members, ownerId]);

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
            ownerId={ownerId}
            isFreeBill={isFreeBill}
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
