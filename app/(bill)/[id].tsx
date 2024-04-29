import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { OuterContainer } from "@/components/containers/outer-container";
import CreateTransaction from "@/components/create-transaction/create-transaction-sheet";
import UnderlinedTabs from "@/components/my-bill/my-tab/underlined-tabs";
import HeaderInfo from "@/components/my-bill/summary/HeaderInfo";
import {
  getActiveTransactions,
  getBillInfo,
  getBillSummaryInfo,
  getMembers,
} from "@/lib/api";
import { BillInfo, Member, SummaryInfo, Transaction } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { YStack, useWindowDimensions } from "tamagui";

const BillScreen = () => {
  /** ---------- States ---------- */
  const {
    id,
    userId,
    txnName: initialTxnName,
    errorCreateMsg: initialErrorCreateMsg,
    errorEditMsg: initialErrorEditMsg,
    editedTxnName: initialEditedTxnName,
    errorDeleteMsg: initialErrorDeleteMsg,
    deletedTxnName: initialDeletedTxnName,
  } = useLocalSearchParams();

  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo[]>([]);
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  //const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [openCreateTxn, setOpenCreateTxn] = useState(false);

  // Create states for toast messages
  const [txnName, setTxnName] = useState(initialTxnName || "");
  const [errorCreateMsg, setErrorCreateMsg] = useState(
    initialErrorCreateMsg || ""
  );
  const [editedTxnName, setEditedTxnName] = useState(
    initialEditedTxnName || ""
  );
  const [errorEditMsg, setErrorEditMsg] = useState(initialErrorEditMsg || "");
  const [errorDeleteMsg, setErrorDeleteMsg] = useState(
    initialErrorDeleteMsg || ""
  );
  const [deletedTxnName, setDeletedTxnName] = useState(
    initialDeletedTxnName || ""
  );

  /** ---------- Functions ---------- */

  const onOpenCreateTxn = () => {
    setOpenCreateTxn(true);
    console.log("Open create txn sheet", openCreateTxn);
  };

  // Resets toast messages
  const resetToastMessageStates = () => {
    // Log states before resetting
    console.log("States before reset:", {
      txnName,
      errorCreateMsg,
      editedTxnName,
      errorEditMsg,
      errorDeleteMsg,
      deletedTxnName,
    });

    // Reset states
    setTxnName("");
    setErrorCreateMsg("");
    setEditedTxnName("");
    setErrorEditMsg("");
    setErrorDeleteMsg("");
    setDeletedTxnName("");

    // Log states after reset
    console.log("States after reset:", {
      txnName: "",
      errorCreateMsg: "",
      editedTxnName: "",
      errorEditMsg: "",
      errorDeleteMsg: "",
      deletedTxnName: "",
    });
  };

  /** ---------- UseEffects ---------- */

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
  }, [id, transactions]);

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
  }, [userId, txnName, deletedTxnName, editedTxnName]);

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

  // Update toast message states whenever search params change
  useEffect(() => {
    if (
      initialTxnName ||
      initialErrorCreateMsg ||
      initialEditedTxnName ||
      initialErrorEditMsg ||
      initialDeletedTxnName ||
      initialErrorDeleteMsg
    ) {
      console.log(" *** Toasts are initialized");
      setOpen(true);
      setTxnName(initialTxnName);
      setErrorCreateMsg(initialErrorCreateMsg);
      setEditedTxnName(initialEditedTxnName);
      setErrorEditMsg(initialErrorEditMsg);
      setDeletedTxnName(initialDeletedTxnName);
      setErrorDeleteMsg(initialErrorDeleteMsg);
    }
  }, [
    initialTxnName,
    initialErrorCreateMsg,
    initialEditedTxnName,
    initialErrorEditMsg,
    initialDeletedTxnName,
    initialErrorDeleteMsg,
  ]);

  return (
    <OuterContainer>
      <CreateTransaction
        billId={id.toString()}
        members={members}
        open={openCreateTxn}
        setOpen={setOpenCreateTxn}
      />
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
            summaryInfo={summaryInfo}
            billName={billInfo[0]?.name}
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
            members={members}
            resetToastMessageStates={resetToastMessageStates}
            setTransactions={setTransactions}
            isLocked={billInfo[0]?.isLocked}
            billOwnerId={billInfo[0]?.ownerid}
          />
        </BodyContainer>
      </YStack>

      <FooterContainer
        height={windowHeight}
        justifyContent="flex-end"
        alignContent="center"
      >
        {/* <MembersView members={members} height={windowHeight} /> */}

        <StyledButton
          disabled={billInfo[0]?.isLocked}
          create={!billInfo[0]?.isLocked}
          width={windowWidth * 0.38}
          size={"$3.5"}
          onPress={onOpenCreateTxn}
        >
          Add Transaction
        </StyledButton>
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
