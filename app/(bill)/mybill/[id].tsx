import UnderlinedTabs from "@/components/my-bill/my-tab/underlined-tabs";
import HeaderInfo from "@/components/my-bill/summary/HeaderInfo";
import {
  getBillInfo,
  getBillSummaryInfo,
  getMembers,
  getMyTabInfo,
  getActiveTransactions,
} from "@/lib/api";
import { BillInfo, SummaryInfo, Transaction } from "@/types/global";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, View, XStack, YStack, useWindowDimensions } from "tamagui";
import { OuterContainer } from "@/components/containers/outer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";

const Page = () => {
  const { id, userId } = useLocalSearchParams();
  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo[]>([]);
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

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
        const transactionData: Transaction[] = await getActiveTransactions(
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
    console.log("window width and height", windowWidth, windowHeight);
  }, [userId, id]);
  return (
    <OuterContainer>
      <YStack padding="$2" gap="$2">
        <HeaderContainer height={windowHeight * 0.15}>
          <HeaderInfo
            members={members}
            summaryInfo={summaryInfo}
            billInfo={billInfo}
          />
        </HeaderContainer>
        <BodyContainer height={windowHeight * 0.62}>
          <UnderlinedTabs
            transactions={transactions}
            summaryInfo={summaryInfo}
            billId={Number(id)}
            userId={userId?.toString()}
            height={windowHeight * 0.62}
            width={windowWidth * 0.95}
            members={members}
          />
        </BodyContainer>
      </YStack>
      <FooterContainer height={windowHeight}>
        <XStack flex={1} />
        <Link
          href={{
            pathname: "/pages/create-transaction",
            params: {
              billId: id,
              userId: userId?.toString(),
            },
          }}
          asChild
        >
          <Button>Create Txn</Button>
        </Link>
      </FooterContainer>
    </OuterContainer>
  );
};
export default Page;
