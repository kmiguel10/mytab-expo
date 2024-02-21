import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  H5,
  Paragraph,
  PortalProvider,
  ScrollView,
  Separator,
  SizableText,
  Tabs,
  TabsContentProps,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";
import { useRoute } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";
import { CreateTransaction } from "@/components/create-transaction/create-transaction";
import { getMembers, getTransactions } from "@/lib/api";
import { Transaction } from "@/types/global";
import MembersView from "@/components/my-bill/members-view";
import TransactionInfoCard from "@/components/my-bill/transaction-info-card";

const Page = () => {
  const { id, userId } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  // const route = useRoute();
  // const { id } = route.params as { id: string };

  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /**Fetch members of the bill */
  useEffect(() => {
    async function fetchMembers() {
      if (id) {
        const membersData = await getMembers(Number(id));
        setMembers(membersData);
      }
    }
    fetchMembers();
  }, [id]);

  useEffect(() => {
    async function fetchTransactions() {
      if (userId) {
        const transactionData: Transaction[] = await getTransactions(
          id.toString()
        );
        setTransactions(transactionData);
      }
    }
    fetchTransactions();
  }, [userId]);

  return (
    <YStack>
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width={400}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
      >
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText fontFamily="$body">Info</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText fontFamily="$body">Summary</SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
        {/* <TabsContent value="tab1">
          <H5>Info</H5>
        </TabsContent>

        <TabsContent value="tab2">
          <H5>Summary</H5>
        </TabsContent> */}
        <Tabs.Content value="tab1">
          <ScrollView height="75%">
            <YStack>
              <YStack>
                <Text>Viewing Bill: {id}</Text>
                <Text>User: {userId}</Text>
              </YStack>
              <Separator />
              <XStack>
                <TransactionInfoCard transactions={transactions} />
              </XStack>
              {/* <XStack>
                <CreateTransaction
                  billId={id}
                  userId={userId}
                  members={members}
                />
              </XStack> */}
              <XStack>
                <Link
                  // href="/pages/create-transaction"
                  href={{
                    pathname: "/pages/create-transaction",
                    params: {
                      billId: id,
                      userId: userId.toString(),
                      members: members,
                    },
                  }}
                  asChild
                >
                  <Button>Create Txn</Button>
                </Link>
              </XStack>
            </YStack>
          </ScrollView>
          <ScrollView horizontal height="25%">
            {/* <XStack>
              <Paragraph>Place member avatars here:</Paragraph>
              {members?.map((member, index) => (
                <Text key={index}>{member.userid}</Text>
              ))}
            </XStack> */}
            <MembersView members={members} />
          </ScrollView>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <Text>Summary Info</Text>
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
};

export default Page;

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  );
};
