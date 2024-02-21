import { Avatar, ListItem, ScrollView, XStack, YStack } from "tamagui";

import BillCard from "@/components/homepage/bill-card";
import JoinBill from "@/components/my-bill/join-bill";
import { getBillsForUserId } from "@/lib/api";
import { BillData } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Separator, View } from "tamagui";

export default function Home() {
  const [bills, setBills] = useState<BillData[]>([]);
  const { id } = useLocalSearchParams();

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
    <View>
      {/* <ToastViewport /> */}
      {/* <ToastDemo /> */}
      <XStack alignItems="center" flexWrap="wrap" alignContent="space-between">
        <Avatar circular size="$6">
          <Avatar.Image
            accessibilityLabel="Nate Wienert"
            src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
          />
          <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
        </Avatar>
        <JoinBill />
      </XStack>

      {/* <Paragraph>Welcome: {id}</Paragraph>
      <Paragraph>
        Based on the user id, will do a GET() request to get all Bills
        associated with the userId
      </Paragraph> */}

      <Separator marginVertical={15} />
      {/* <Paragraph>
        This will show a table with: Username, List of Bills, create bill button
        (separate component)
      </Paragraph> */}

      <ScrollView>
        {bills.map((item, index) => (
          <ListItem key={index}>
            <YStack>
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
                {/* <Button>
                  <Text>{item.name}</Text>
                </Button> */}
              </Link>
            </YStack>
          </ListItem>
        ))}
      </ScrollView>
    </View>
  );
}
