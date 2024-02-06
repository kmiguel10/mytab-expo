import { StyleSheet } from "react-native";

// import { Text, View } from "@/components/Themed";
import { ScrollView, YStack, ListItem } from "tamagui";

import { View, Text, Separator, H1, Paragraph, Button } from "tamagui";
import { Link } from "expo-router";
import { User } from "@/types/global";

const testUser: User = {
  userId: 0,
  name: "Bob",
  bills: [
    {
      billId: 1,
      members: [
        { memberId: 1, memberName: "Alice" },
        { memberId: 2, memberName: "Eli" },
      ],
    },
    {
      billId: 2,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 3,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 4,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 5,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 6,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 7,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 8,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
    {
      billId: 9,
      members: [
        { memberId: 3, memberName: "Jason" },
        { memberId: 4, memberName: "Travis" },
        { memberId: 5, memberName: "Kylie" },
      ],
    },
  ],
};

interface Props {
  userTest: any;
}

export default function Home() {
  return (
    <View>
      <H1>HOME</H1>
      <Paragraph>Welcome: {testUser.name}</Paragraph>
      <Text>{testUser.bills[1].members.length}</Text>
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
          {testUser.bills.map((item, index) => (
            <ListItem key={index}>
              <Link href={`/(bill)/mybill/${item.billId}`} asChild>
                <Button>
                  <Text>{item.billId}</Text>
                </Button>
              </Link>
            </ListItem>
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
