import { Avatar, Button, ListItem, ScrollView, XStack, YStack } from "tamagui";

import BillCard from "@/components/homepage/bill-card";
import JoinBill from "@/components/my-bill/transactions/join-bill";
import { getBillsForUserId } from "@/lib/api";
import { BillData } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Separator, View, Text } from "tamagui";
import { Dimensions } from "react-native";

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
    <View backgroundColor={"white"}>
      <XStack
        justifyContent="space-between"
        borderRadius="$2"
        height={windowHeight * 0.15}
        backgroundColor={"white"}
      >
        <Avatar circular size="$6">
          <Avatar.Image
            accessibilityLabel="Nate Wienert"
            src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
          />
          <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
        </Avatar>
        <Text>User id: {id.slice(0, 5)}</Text>
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
          <Button>Create Txn</Button>
        </Link>
      </XStack>
      <ScrollView backgroundColor={"white"} height={windowHeight * 0.65}>
        {bills.map((item, index) => (
          <XStack key={index} backgroundColor="white" justifyContent="center">
            <Link
              href={{
                pathname: `/(bill)/mybill/${item.billid}`,
                params: { userId: id },
              }}
              asChild
            >
              <BillCard
                animation="bouncy"
                size="$4"
                width={360}
                height={110}
                scale={0.9}
                hoverStyle={{ scale: 0.925 }}
                pressStyle={{ scale: 0.875 }}
                bill={item}
                membership={item.ownerid === id ? "Owner" : "Member"}
              />
            </Link>
          </XStack>
        ))}
      </ScrollView>
    </View>
  );
}
