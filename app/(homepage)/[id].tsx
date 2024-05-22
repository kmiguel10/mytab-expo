import { YStack } from "tamagui";

import CreateBill from "@/components/homepage/create-bill";
import { TabsAdvancedUnderline } from "@/components/homepage/homepage-tabs-underline";
import JoinBill from "@/components/homepage/join-bill";
import { getBillsForUserIdWithUrls, getProfileInfo } from "@/lib/api";
import { MemberData, ProfileInfo } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Text } from "tamagui";

import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { OuterContainer } from "@/components/containers/outer-container";
import Avatar from "@/components/login/avatar";
import React from "react";

// import "react-native-reanimated";
// import "react-native-gesture-handler";
import { Skeleton } from "moti/skeleton";
import CreateBillSheet from "@/components/homepage/create-bill-sheet";
import { StyledButton } from "@/components/button/button";

const Home = () => {
  const { id, newBillId, joinedBillCode, errorMessage, errorCreateMessage } =
    useLocalSearchParams();
  const [bills, setBills] = useState<MemberData[]>([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [newBill, setNewBill] = useState<MemberData | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const timerRef = React.useRef(0);
  const [error, setError] = useState("") || null;
  const [refreshing, setRefreshing] = useState(false);

  const [isCreateBillOpen, setIsCreateBillOpen] = useState(false);

  const onOpenCreateBillSheet = () => {
    setIsCreateBillOpen(true);
  };

  useEffect(() => {
    console.log("*** Homepage: Fetch bills for user", id);
    async function fetchBills() {
      if (!id) return;

      const billsData = await getBillsForUserIdWithUrls(id.toString());
      const filteredBillsData = billsData.filter(
        (member) =>
          member.isMemberIncluded === true || member.isRequestSent === true
      );
      setBills(filteredBillsData);
      setLoadingBills(false);
      setRefreshing(false);

      if (newBillId || joinedBillCode) {
        let newBill: MemberData = {
          memberid: "",
          userid: "",
          billid: 0,
          billcode: "",
          ownerid: "",
          name: "",
          amount: 0,
          isBillActive: false,
          isMemberIncluded: false,
          isLocked: false,
          isdeleted: false,
          isRequestSent: false,
          memberUrls: [],
        };

        if (newBillId) {
          newBill = billsData?.find(
            (bill) => bill?.billid === parseInt(newBillId.toString())
          ) ?? {
            memberid: "",
            userid: "",
            billid: 0,
            billcode: "",
            ownerid: "",
            name: "",
            amount: 0,
            isBillActive: false,
            isMemberIncluded: false,
            isLocked: false,
            isdeleted: false,
            isRequestSent: false,
            memberUrls: [],
          };
        } else {
          newBill = billsData?.find(
            (bill) => bill?.billid === parseInt(joinedBillCode.toString())
          ) ?? {
            memberid: "",
            userid: "",
            billid: 0,
            billcode: "",
            ownerid: "",
            name: "",
            amount: 0,
            isBillActive: false,
            isMemberIncluded: false,
            isLocked: false,
            isdeleted: false,
            isRequestSent: false,
            memberUrls: [],
          };
        }

        if (newBill) {
          setNewBill(newBill);
          setOpen(true);
        }
      }
      if (errorMessage) {
        setOpen(true);
      }
      if (errorCreateMessage) {
        setOpen(true);
      }
    }

    fetchBills();
    setError(errorMessage?.toString());
  }, [id, newBillId, joinedBillCode, errorMessage, refreshing]);

  useEffect(() => {
    const fetchprofileInfo = async () => {
      try {
        const profile: ProfileInfo | null = await getProfileInfo(id.toString());

        if (profile) {
          setProfileInfo(profile);
          setAvatarUrl(profile?.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setProfileInfo(null);
      }
    };
    fetchprofileInfo();
  }, [id]);

  return (
    <OuterContainer>
      <ToastViewport
        width={"100%"}
        justifyContent="center"
        flexDirection="column-reverse"
        top={0}
        right={0}
      />
      <YStack padding="$2" gap="$2">
        <HeaderContainer
          justifyContent="flex-start"
          gap="$3"
          height={windowHeight * 0.15}
          backgroundColor={"white"}
          paddingVertical="$4"
          paddingHorizontal="$4"
        >
          <Skeleton
            height={64}
            width={64}
            radius="round"
            show={!avatarUrl}
            colorMode="light"
          >
            <Avatar url={avatarUrl} size={"$6"} />
          </Skeleton>
          <Skeleton
            height={24}
            width={windowWidth * 0.8}
            radius="round"
            show={!profileInfo?.displayName}
            colorMode="light"
          >
            {!!profileInfo?.displayName ? (
              <Text>{profileInfo?.displayName}</Text>
            ) : (
              ""
            )}
          </Skeleton>
        </HeaderContainer>
        <BodyContainer height={windowHeight * 0.62}>
          <TabsAdvancedUnderline
            bills={bills}
            userId={id.toString()}
            height={windowHeight * 0.62}
            width={windowWidth * 0.95}
            setRefreshing={setRefreshing}
            refreshing={refreshing}
            loadingBills={loadingBills}
          />
        </BodyContainer>
      </YStack>

      <FooterContainer justifyContent="space-between" height={windowHeight}>
        <JoinBill
          avatarUrl={avatarUrl}
          displayName={profileInfo?.displayName ? profileInfo.displayName : ""}
          buttonWidth={windowWidth * 0.25}
          buttonSize={"$3.5"}
        />
        {/* <CreateBill buttonWidth={windowWidth * 0.25} buttonSize={"$3.5"} /> */}
        <StyledButton
          create={true}
          size={"$3.5"}
          width={windowWidth * 0.25}
          onPress={onOpenCreateBillSheet}
        >
          Create
        </StyledButton>
        <CreateBillSheet
          open={isCreateBillOpen}
          setOpen={setIsCreateBillOpen}
        />
      </FooterContainer>
      {newBillId && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$green8"}
          height={"500"}
          width={"85%"}
          justifyContent="center"
        >
          <Toast.Title alignItems="center">
            Successfully created {newBill?.name} Bill
          </Toast.Title>
          <Toast.Description>
            Share Bill Code to your friends: {newBill?.billcode}
          </Toast.Description>
        </Toast>
      )}
      {joinedBillCode && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$green8"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title alignItems="center">
            You sent a request to join " {newBill?.name} "
          </Toast.Title>
          {/* <Toast.Description>
              Share Bill Code to your friends: {newBill?.billcode}
            </Toast.Description> */}
        </Toast>
      )}
      {(errorMessage || errorCreateMessage) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={"$red8"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title alignContent="center">
            {errorMessage ? errorMessage : errorCreateMessage}
          </Toast.Title>
          {/* <Toast.Description>{error}</Toast.Description> */}
        </Toast>
      )}
    </OuterContainer>
  );
};

export default Home;
