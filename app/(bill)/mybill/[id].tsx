import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Paragraph, Separator, XStack, YStack } from "tamagui";
import { useRoute } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";

const Page = () => {
  const { id } = useLocalSearchParams();
  // const route = useRoute();
  // const { id } = route.params as { id: string };

  const [members, setMembers] = useState<any[]>([]);

  /**Fetch members of the bill */
  const getMembers = async () => {
    let { data, error } = await supabase
      .from("members")
      .select("userid")
      .eq("billid", id);

    if (data) {
      setMembers(data);
      console.log("Data: ", data);
    } else {
      console.log("Members Error: ", error);
      setMembers([]);
    }
  };
  useEffect(() => {
    if (id) getMembers();
    console.log("Members: ", members);
  }, [id]);

  return (
    <YStack>
      <XStack>
        <Text>Viewing Bill: {id}</Text>
      </XStack>
      <XStack>
        <Paragraph>
          Will receive an id from Homepage and use it to create a GET() request
          to receive lists of transactions and members for that BillId
        </Paragraph>
      </XStack>
      <Separator />
      <XStack>
        <Paragraph>Display List of Members</Paragraph>
      </XStack>
      <XStack>
        <Paragraph>Fetch created transactions</Paragraph>
      </XStack>
      <XStack>
        <Link href={"/(modals)/create-transaction"} asChild>
          <Button>Create Txn</Button>
        </Link>
      </XStack>
    </YStack>
  );
};

export default Page;
