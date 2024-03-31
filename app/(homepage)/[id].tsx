import { Button, XStack, YStack } from "tamagui";

import CreateBill from "@/components/homepage/create-bill";
import { TabsAdvancedUnderline } from "@/components/homepage/homepage-tabs-underline";
import JoinBill from "@/components/homepage/join-bill";
import { getBillsForUserId, getProfileInfo } from "@/lib/api";
import { BillData, MemberData, ProfileInfo } from "@/types/global";
import { Toast, ToastProvider, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Text, View } from "tamagui";

import React from "react";
import { OuterContainer } from "@/components/containers/outer-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { BodyContainer } from "@/components/containers/body-container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/login/avatar";

const Home = () => {
  const { id, newBillId, joinedBillCode, errorMessage, errorCreateMessage } =
    useLocalSearchParams();
  const [bills, setBills] = useState<MemberData[]>([]);
  const [newBill, setNewBill] = useState<BillData | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { left, top, right } = useSafeAreaInsets();
  const timerRef = React.useRef(0);
  const [error, setError] = useState("") || null;

  useEffect(() => {
    async function fetchBills() {
      if (!id) return;

      const billsData = await getBillsForUserId(id.toString());
      const filteredBillsData = billsData.filter(
        (member) =>
          member.isMemberIncluded === true || member.isRequestSent === true
      );
      setBills(filteredBillsData);

      if (newBillId || joinedBillCode) {
        let newBill: BillData = {
          memberid: "",
          userid: "",
          billid: 0,
          billcode: "",
          ownerid: "",
          name: "",
          createdAt: new Date(),
          isDeleted: false,
          isSettled: false,
          amount: 0,
        };
        if (newBillId) {
          newBill = billsData?.find(
            (bill) => bill?.billid === parseInt(newBillId.toString())
          );
        } else {
          newBill = billsData?.find(
            (bill) => bill?.billid === parseInt(joinedBillCode.toString())
          );
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
  }, [id, newBillId, joinedBillCode, errorMessage]);

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
        <YStack
          justifyContent="flex-start"
          gap="$3"
          height={windowHeight * 0.15}
          backgroundColor={"white"}
          paddingVertical="$4"
          paddingHorizontal="$4"
          borderRadius="$6"
        >
          {/* <Avatar circular size="$6">
            <Avatar.Image
              accessibilityLabel={profileInfo?.displayName}
              src={profileInfo?.avatar_url}
            />
            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
          </Avatar> */}
          <Avatar size={200} url={avatarUrl} />
          <Text>{profileInfo?.displayName}</Text>
        </YStack>
        <BodyContainer height={windowHeight * 0.62}>
          <TabsAdvancedUnderline
            bills={bills}
            userId={id.toString()}
            height={windowHeight * 0.62}
            width={windowWidth * 0.95}
          />
        </BodyContainer>
      </YStack>

      <FooterContainer justifyContent="space-between" height={windowHeight}>
        <JoinBill />
        <CreateBill />
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
      </FooterContainer>
    </OuterContainer>
  );
};

export default Home;
