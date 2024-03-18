import { Avatar, XStack, YStack } from "tamagui";

import CreateBill from "@/components/homepage/create-bill";
import { TabsAdvancedUnderline } from "@/components/homepage/homepage-tabs-underline";
import JoinBill from "@/components/homepage/join-bill";
import { getBillsForUserId } from "@/lib/api";
import { BillData } from "@/types/global";
import { Toast, ToastProvider, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Text, View } from "tamagui";

import React from "react";
import { OuterContainer } from "@/components/containers/outer-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { BodyContainer } from "@/components/containers/body-container";

const Home = () => {
  const { id, newBillId, joinedBillCode } = useLocalSearchParams();
  const [bills, setBills] = useState<BillData[]>([]);
  const [newBill, setNewBill] = useState<BillData | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchBills() {
      if (!id) return;

      const billsData = await getBillsForUserId(id.toString());
      setBills(billsData);

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
    }

    fetchBills();
  }, [id, newBillId, joinedBillCode]);

  return (
    <ToastProvider>
      {/* <ToastViewport
        width={"100%"}
        justifyContent="center"
        flexDirection="column-reverse"
        top={0}
        right={0}
      /> */}
      <OuterContainer>
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
            <Avatar circular size="$6">
              <Avatar.Image
                accessibilityLabel="Nate Wienert"
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
              />
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
            <Text>User id: {id.slice(0, 5)}</Text>
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
          {/* <Link
            href={{
              pathname: "/(modals)/create-bill",
              params: {
                id,
              },
            }}
            asChild
          >
            <Button>Create</Button>
          </Link> */}
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

          {/* {newBillId && (
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
                You joined " {newBill?.name} "
              </Toast.Title>
              <Toast.Description>
                Share Bill Code to your friends: {newBill?.billcode}
              </Toast.Description>
            </Toast>
          )} */}
        </FooterContainer>
      </OuterContainer>
    </ToastProvider>
  );
};

export default Home;
