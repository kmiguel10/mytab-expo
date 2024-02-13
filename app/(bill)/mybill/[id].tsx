import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  Paragraph,
  PortalProvider,
  Separator,
  XStack,
  YStack,
} from "tamagui";
import { useRoute } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";
import { CreateTransaction } from "@/components/create-transaction/create-transaction";

const Page = () => {
  const { id, userId } = useLocalSearchParams();
  // const route = useRoute();
  // const { id } = route.params as { id: string };

  const [members, setMembers] = useState<any[]>([]);

  /**Fetch members of the bill */
  const getMembers = async () => {
    let { data, error } = await supabase
      .from("members")
      .select("userid")
      .eq("billid", Number(id));

    if (data) {
      setMembers(data);
      console.log("Data MyBill: ", data);
    } else {
      console.log("Members Error MyBill: ", error);
      setMembers([]);
    }
  };
  useEffect(() => {
    if (id) getMembers();
    console.log("Members MyBill: ", members);
  }, [id]);

  return (
    <YStack>
      <YStack>
        <Text>Viewing Bill: {id}</Text>
        <Text>User: {userId}</Text>
        <Text>List of Members: {JSON.stringify(members)}</Text>
      </YStack>
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
        {/* <Link
          // href={`/(modals)/create-transaction?id=${id}`}
          href={{
            pathname: `/(modals)/create-transaction`,
            params: { billId: id, userId: userId },
          }}
          asChild
        >
          <Button>Create Txn</Button>
        </Link> */}
        <CreateTransaction billId={id} userId={userId} members={members} />
      </XStack>
    </YStack>
  );
};

export default Page;
