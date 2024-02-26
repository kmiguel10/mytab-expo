import { View, Text } from "react-native";
import React from "react";
import {
  ScrollView,
  Separator,
  SizableText,
  Tabs,
  TabsContentProps,
  XStack,
  YStack,
} from "tamagui";
import TransactionInfoCard from "./transaction-info-card";
import Summary from "../summary/summary";
import { SummaryInfo, Transaction } from "@/types/global";
import MyTab from "../my-tab/MyTab";

interface Props {
  transactions: Transaction[];
  summaryInfo: SummaryInfo[];
  billId: number;
  userId: string;
}

const BillTabs: React.FC<Props> = ({
  transactions,
  summaryInfo,
  billId,
  userId,
}) => {
  return (
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
            <XStack>
              <TransactionInfoCard transactions={transactions} />
            </XStack>
          </YStack>
        </ScrollView>
        {/* <ScrollView horizontal height="25%">
            <MembersView members={members} />
          </ScrollView> */}
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Summary summaryInfo={summaryInfo} />
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <MyTab userId={userId} billId={billId} />
      </Tabs.Content>
    </Tabs>
  );
};

export default BillTabs;

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
