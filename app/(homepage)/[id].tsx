// import { Text, View } from "@/components/Themed";
import { ListItem, ScrollView, YStack } from "tamagui";

import { User } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import { Button, H1, Paragraph, Separator, Text, View } from "tamagui";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// const testUser: User = {
//   userId: 0,
//   name: "Bob",
//   bills: [
//     {
//       billId: 1,
//       members: [
//         { memberId: 1, memberName: "Alice" },
//         { memberId: 2, memberName: "Eli" },
//       ],
//     },
//     {
//       billId: 2,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 3,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 4,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 5,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 6,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 7,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 8,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//     {
//       billId: 9,
//       members: [
//         { memberId: 3, memberName: "Jason" },
//         { memberId: 4, memberName: "Travis" },
//         { memberId: 5, memberName: "Kylie" },
//       ],
//     },
//   ],
// };

export default function Home() {
  const [bills, setBills] = useState<any[]>([]);
  // const route = useRoute();
  // const { id } = route.params as { id: string };
  const { id } = useLocalSearchParams();

  const getBills = async () => {
    let { data: billsData, error } = await supabase.from("bills").select("*");

    if (billsData) {
      setBills(billsData); // Set the bills state with the retrieved data
      console.log("Bills: ", billsData);
    } else {
      // Handle the case where billsData is null
      // For example, you can set an empty array as the default value
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

      <ScrollView>
        <YStack>
          {bills.map((item, index) => (
            <ListItem key={index}>
              <Link href={`/(bill)/mybill/${item.billid}`} asChild>
                <Button>
                  <Text>{item.name}</Text>
                </Button>
              </Link>
            </ListItem>
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
}
