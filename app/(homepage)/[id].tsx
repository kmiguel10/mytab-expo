import { Avatar, Button, ListItem, ScrollView, XStack, YStack } from "tamagui";

import BillCard from "@/components/homepage/bill-card";
import JoinBill from "@/components/my-bill/transactions/join-bill";
import { getBillsForUserId } from "@/lib/api";
import { BillData } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Separator, View, Text } from "tamagui";
import { Dimensions } from "react-native";
import HomepageTabs from "@/components/homepage/homepage-tabs";

export default function Home() {
  const [bills, setBills] = useState<BillData[]>([]);
  const { id } = useLocalSearchParams();
  const windowHeight = Dimensions.get("window").height;

  const onPressCreate = () => {};

  useEffect(() => {
    async function fetchBills() {
      if (id) {
        const billsData = await getBillsForUserId(id.toString());
        setBills(billsData);
      }
    }
    fetchBills();
  }, [id]);

  return (
    <View backgroundColor={"red"}>
      <YStack
        justifyContent="flex-start"
        gap="$3"
        borderRadius="$2"
        height={windowHeight * 0.15}
        backgroundColor={"yellow"}
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
      <XStack height={windowHeight * 0.63}>
        <HomepageTabs bills={bills} userId={id.toString()} />
      </XStack>

      <XStack
        justifyContent="space-between"
        backgroundColor={"blue"}
        height={"20%"}
        paddingLeft="$4"
        paddingRight="$4"
        paddingTop="$3"
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
      </XStack>
    </View>
  );
}
