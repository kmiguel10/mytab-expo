// import { Text, View } from "@/components/Themed";
import { ListItem, ScrollView, XStack, YStack } from "tamagui";

import { User } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import { Button, H1, Paragraph, Separator, Text, View } from "tamagui";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import JoinBill from "@/components/my-bill/join-bill";

export default function Home() {
  const [bills, setBills] = useState<any[]>([]);

  const { id } = useLocalSearchParams();

  const getBills = async () => {
    let { data: billsData, error } = await supabase
      .from("members")
      .select("*")
      .eq("userid", id);

    if (billsData) {
      setBills(billsData); // Set the bills state with the retrieved data
      console.log("Bills: ", billsData);
    } else {
      // Handle the case where billsData is null
      // For example, you can set an empty array as the default value
      console.log("Error", error);
      setBills([]);
    }
  };

  useEffect(() => {
    if (id) getBills();
  }, [id]);

  //get bills based on id
  return (
    <View>
      <H1>HOME</H1>
      <Paragraph>Welcome: {id}</Paragraph>
      <Text>User:{id}</Text>
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

                <Link href={`/(bill)/mybill/${item.billid}`} asChild>
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
