import { Avatar, Button, XStack, YStack } from "tamagui";

import { TabsAdvancedUnderline } from "@/components/homepage/homepage-tabs-underline";
import JoinBill from "@/components/my-bill/transactions/join-bill";
import { getBillsForUserId } from "@/lib/api";
import { BillData } from "@/types/global";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastController,
  useToastState,
} from "@tamagui/toast";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Text, View } from "tamagui";

import { useRoute } from "@react-navigation/native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const { id, billCreatedSuccess } = useLocalSearchParams();
  const [bills, setBills] = useState<BillData[]>([]);

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const toast = useToastController();
  const { left, top, right } = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const timerRef = React.useRef(0);
  const currentToast = useToastState();
  const route = useRoute();
  const { params } = useRoute();

  useEffect(() => {
    async function fetchBills() {
      if (id) {
        const billsData = await getBillsForUserId(id.toString());
        setBills(billsData);
      }
    }
    fetchBills();
    if (billCreatedSuccess === "true") {
      setOpen(true);
    }
    console.log("PARAM", billCreatedSuccess, id, params);
  }, [id]);

  return (
    <ToastProvider>
      <ToastViewport
        width={"100%"}
        justifyContent="center"
        flexDirection="column-reverse"
        top={0}
        right={0}
      />
      <View backgroundColor={"white"}>
        <YStack
          justifyContent="flex-start"
          gap="$3"
          borderRadius="$2"
          height={windowHeight * 0.15}
          backgroundColor={"white"}
          paddingVertical="$4"
          paddingHorizontal="$4"
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
        <XStack height={windowHeight * 0.63} backgroundColor={"purple"}>
          {/* <HomepageTabs bills={bills} userId={id.toString()} /> */}
          <TabsAdvancedUnderline
            bills={bills}
            userId={id.toString()}
            height={windowHeight * 0.63}
            width={windowWidth}
          />
        </XStack>

        <XStack
          justifyContent="space-between"
          backgroundColor={"$gray2Light"}
          height={"20%"}
          paddingLeft="$4"
          paddingRight="$4"
          paddingTop="$3"
          opacity={4}
        >
          <JoinBill />
          <Link
            href={{
              pathname: "/(modals)/create-bill",
              params: {
                id,
              },
            }}
            asChild
          >
            <Button>Create</Button>
          </Link>
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

          {billCreatedSuccess && (
            <XStack width={"400"}>
              <Toast
                onOpenChange={setOpen}
                open={open}
                animation="100ms"
                enterStyle={{ x: -20, opacity: 0 }}
                exitStyle={{ x: -20, opacity: 0 }}
                opacity={1}
                x={0}
                backgroundColor={"$green10"}
              >
                <Toast.Title>Bill Successfully Created</Toast.Title>
                {/* <Toast.Description>
              We'll be in touch. {billCreatedSuccess}
            </Toast.Description> */}
              </Toast>
            </XStack>
          )}
        </XStack>
      </View>
    </ToastProvider>
  );
};

export default Home;
