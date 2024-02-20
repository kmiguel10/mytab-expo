import { ListItem, ScrollView, XStack, YStack } from "tamagui";

import JoinBill from "@/components/my-bill/join-bill";
import { getBills } from "@/lib/api";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, H1, Paragraph, Separator, Text, View } from "tamagui";
import BillCard from "@/components/homepage/bill-card";
import { BillData } from "@/types/global";

export default function Home() {
  const [bills, setBills] = useState<BillData[]>([]);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    async function fetchBills() {
      if (id) {
        const billsData = await getBills(id.toString());
        setBills(billsData);
      }
    }

    fetchBills();
  }, [id]);

  return (
    <View>
      <H1>User Avatar</H1>
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
      <JoinBill />

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
