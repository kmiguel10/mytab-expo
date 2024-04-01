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
import { Toast, ToastViewport } from "@tamagui/toast";

const BillScreen = () => {
  const {
    id,
    userId,
    txnName,
    errorCreateMsg,
    errorEditMsg,
    editedTxnName,
    errorDeleteMsg,
    deletedTxnName,
  } = useLocalSearchParams();

  const [members, setMembers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo[]>([]);
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);

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

  //Need to be able to reflect current transaction upon creating a new txn
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
  }, [userId, txnName, deletedTxnName]);
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

  //Gets txnCreateData
  useEffect(() => {
    if (
      txnName ||
      errorCreateMsg ||
      editedTxnName ||
      errorEditMsg ||
      deletedTxnName ||
      errorDeleteMsg
    ) {
      setOpen(true);
    }
  }, [
    txnName,
    errorCreateMsg,
    editedTxnName,
    errorEditMsg,
    errorDeleteMsg,
    deletedTxnName,
  ]);

  useEffect(() => {
    console.log("id,userId", id, userId);
  }, [id, userId]);

  return (
    <OuterContainer>
      <ToastViewport
        width={"100%"}
        justifyContent="center"
        flexDirection="column-reverse"
        top={0}
        right={0}
      />
      <YStack padding="$2" gap="$2">
        <HeaderContainer height={windowHeight * 0.15}>
          <HeaderInfo
            members={members}
            summaryInfo={summaryInfo}
            billInfo={billInfo}
            height={windowHeight * 0.15}
            width={windowWidth}
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
          <Button disabled={billInfo[0]?.isLocked}>Add Transaction</Button>
        </Link>
      </FooterContainer>
      {(txnName || errorCreateMsg) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={txnName ? "$green8Light" : "$red8Light"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title textAlign="left">
            {txnName ? "Transaction created" : "Failed creating transaction"}
          </Toast.Title>
          <Toast.Description>
            {txnName ? `You entered: ${txnName}` : `Error: ${errorCreateMsg}`}
          </Toast.Description>
        </Toast>
      )}
      {(editedTxnName || errorEditMsg) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={editedTxnName ? "$green8Light" : "$red8Light"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title textAlign="left">
            {editedTxnName
              ? "Transaction edited"
              : "Failed editing transaction"}
          </Toast.Title>
          <Toast.Description>
            {editedTxnName
              ? `You edited: ${editedTxnName}`
              : `Error: ${errorEditMsg}`}
          </Toast.Description>
        </Toast>
      )}
      {(deletedTxnName || errorDeleteMsg) && (
        <Toast
          onOpenChange={setOpen}
          open={open}
          animation="100ms"
          enterStyle={{ x: -20, opacity: 0 }}
          exitStyle={{ x: -20, opacity: 0 }}
          opacity={1}
          x={0}
          backgroundColor={deletedTxnName ? "$green8Light" : "$red8Light"}
          height={"400"}
          width={"80%"}
          justifyContent="center"
        >
          <Toast.Title textAlign="left">
            {deletedTxnName
              ? "Transaction deleted"
              : "Failed deleting transaction"}
          </Toast.Title>
          <Toast.Description>
            {deletedTxnName
              ? `You deleted: ${deletedTxnName}`
              : `Error: ${errorDeleteMsg}`}
          </Toast.Description>
        </Toast>
      )}
    </OuterContainer>
  );
};
export default BillScreen;
