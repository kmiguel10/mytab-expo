import { View, Text, Dimensions } from "react-native";
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
import { getBillSummaryInfo, getMembers, getTransactions } from "@/lib/api";
import { Transaction } from "@/types/global";
import MembersView from "@/components/my-bill/members-view";
import TransactionInfoCard from "@/components/my-bill/transaction-info-card";
import HeaderInfo from "@/components/my-bill/summary/HeaderInfo";
import Summary from "@/components/my-bill/summary/summary";

const Page = () => {
  const { id, userId } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  // const route = useRoute();
  // const { id } = route.params as { id: string };

  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<any[]>([]);
  const windowHeight = Dimensions.get("window").height;

  /** fetch summary info */
  useEffect(() => {
    async function fetchSummaryInfo() {
      if (id) {
        const data = await getBillSummaryInfo(Number(id));
        setSummaryInfo(data);
      }
    }
    fetchSummaryInfo();
    console.log("Summary Info: ", JSON.stringify(summaryInfo));
  }, [id]);

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
    <View>
      <HeaderInfo totalPaid={100} txnCount={10} height={windowHeight * 0.2} />
      <XStack>
        <Link
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
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        width={400}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
        height={windowHeight * 0.8}
      >
        <Tabs.List
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText fontFamily="$body">Transactions</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="tab2">
            <SizableText fontFamily="$body">Summary</SizableText>
          </Tabs.Tab>

          <Tabs.Tab flex={1} value="tab3">
            <SizableText fontFamily="$body">MyTab</SizableText>
          </Tabs.Tab>
          <XStack flex={2} />
        </Tabs.List>
        <Separator />
        <Tabs.Content value="tab1">
          <ScrollView>
            <YStack>
              <YStack>
                <Text>Viewing Bill: {id}</Text>
                <Text>User: {userId}</Text>
              </YStack>
              <Separator />
              <XStack>
                <TransactionInfoCard transactions={transactions} />
              </XStack>
            </YStack>
          </ScrollView>
          <ScrollView horizontal height="25%">
            <MembersView members={members} />
          </ScrollView>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <Summary summaryInfo={summaryInfo} />
        </Tabs.Content>
      </Tabs>
    </View>
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
