import UnderlinedTabs from "@/components/my-bill/my-tab/underlined-tabs";
import HeaderInfo from "@/components/my-bill/summary/HeaderInfo";
import BillTabs from "@/components/my-bill/transactions/bill-tabs";
import {
  getBillInfo,
  getBillSummaryInfo,
  getMembers,
  getMyTabInfo,
  getTransactions,
} from "@/lib/api";
import { BillInfo, SummaryInfo, Transaction } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Button, XStack, useWindowDimensions, View } from "tamagui";

const Page = () => {
  const { id, userId } = useLocalSearchParams();
  const { height } = useWindowDimensions();

  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo[]>([]);
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);
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

  //Fetch bill info
  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));
        setBillInfo(data);
      }
    }
    fetchBillInfo();
  }, [id]);

  useEffect(() => {
    async function fetchMyTabInfo() {
      if (userId) {
        const data = await getMyTabInfo(userId.toString(), Number(id));
        setMyTabInfo(data);
      }
    }
    fetchMyTabInfo();
  }, [userId, id]);

  return (
    <View backgroundColor={"white"}>
      <XStack height={windowHeight * 0.15} backgroundColor={"white"}>
        <HeaderInfo
          members={members}
          summaryInfo={summaryInfo}
          billInfo={billInfo}
        />
      </XStack>

      <XStack height={windowHeight * 0.62}>
        {/* <BillTabs
          transactions={transactions}
          summaryInfo={summaryInfo}
          billId={Number(id)}
          userId={userId?.toString()}
        /> */}
        <UnderlinedTabs
          transactions={transactions}
          summaryInfo={summaryInfo}
          billId={Number(id)}
          userId={userId?.toString()}
          height={800}
          width={400}
        />
      </XStack>

      <XStack alignContent="flex-end">
        <XStack flex={1} />
        <Link
          href={{
            pathname: "/pages/create-transaction",
            params: {
              billId: id,
              userId: userId?.toString(),
              members: members,
            },
          }}
          asChild
        >
          <Button>Create Txn</Button>
        </Link>
      </XStack>
    </View>
  );
};

export default Page;
