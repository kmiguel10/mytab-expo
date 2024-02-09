import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Paragraph } from "tamagui";
import { useRoute } from "@react-navigation/native";

const Page = () => {
  const { id } = useLocalSearchParams();
  // const route = useRoute();
  // const { id } = route.params as { id: string };
  return (
    <View>
      <Text>Viewing Bill: {id}</Text>
      <Paragraph>
        Will receive an id from Homepage and use it to create a GET() request to
        receive lists of transactions and members for that BillId
      </Paragraph>
      <Paragraph>Fetch created transactions</Paragraph>
      <Link href={"/(modals)/create-transaction"} asChild>
        <Button>Create Txn</Button>
      </Link>
    </View>
  );
};

export default Page;
