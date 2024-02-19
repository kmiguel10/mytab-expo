import { ListItem, ScrollView, XStack, YStack } from "tamagui";

import JoinBill from "@/components/my-bill/join-bill";
import { getBills } from "@/lib/api";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, H1, Paragraph, Separator, Text, View } from "tamagui";

export default function Home() {
  const [bills, setBills] = useState<any[]>([]);
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
      <H1>HOME</H1>
      <Paragraph>Welcome: {id}</Paragraph>

      <Paragraph>
        Based on the user id, will do a GET() request to get all Bills
        associated with the userId
      </Paragraph>
      <View />
      <Separator marginVertical={15} />
      <Paragraph>
        This will show a table with: Username, List of Bills, create bill button
        (separate component)
      </Paragraph>
      <JoinBill />

      <ScrollView>
        <YStack>
          {bills.map((item, index) => (
            <ListItem key={index}>
              <XStack>
                {item.ownerid === id ? <Text>owner</Text> : <Text>Member</Text>}

                <Link
                  href={{
                    pathname: `/(bill)/mybill/${item.billid}`,
                    params: { id: item.billId, userId: id },
                  }}
                  asChild
                >
                  <Button>
                    <Text>{item.name}</Text>
                  </Button>
                </Link>
              </XStack>
            </ListItem>
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
}
