import { getMembersAndRequests } from "@/lib/api";
import { Member } from "@/types/global";
import { Toast } from "@tamagui/toast";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, Separator, Spinner, View } from "tamagui";
import CurrentMembers from "./current-members";
import JoinRequests from "./join-requests";

interface Props {
  billId: number;
  ownerId: string;
  height: number;
  isOwner: boolean;
  isFreeBill: boolean;
  isBillExpired: boolean;
  isLoading: boolean;
}

const EditMembers: React.FC<Props> = ({
  billId,
  ownerId,
  height,
  isOwner,
  isFreeBill,
  isBillExpired,
  isLoading,
}) => {
  /** ---------- States ---------- */
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [includedMembers, setIncludedMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMaxMembersReached, setIsMaxMembersReached] = useState(false);

  const freeBillMaxMembers = 2;
  const paidBillMaxMembers = 12;

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
    setRefreshing(true);
    fetchMembersData();
  };

  const timerRef = React.useRef(0);

  /** ---------- UseEffects---------- */
  useEffect(() => {
    fetchMembersData();
  }, [billId, refreshing]);

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

    //determine if max members are reach
    if (isFreeBill) {
      setIsMaxMembersReached(freeBillMaxMembers <= included.length);
    } else {
      setIsMaxMembersReached(paidBillMaxMembers <= included.length);
    }
  }, [members, ownerId, refreshing]);

  return (
    <View height={height} padding="$3">
      {isLoading ? (
        <View alignItems="center" justifyContent="center" flex={1}>
          <Spinner size="large" color="$green10" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {requests.length > 0 && isOwner && (
            <JoinRequests
              requests={requests}
              fetchMembersData={fetchMembersData}
              isMaxMembersReached={isMaxMembersReached}
              isBillExpired={isBillExpired}
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
              isBillExpired={isBillExpired}
            />
          )}
        </ScrollView>
      )}

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
