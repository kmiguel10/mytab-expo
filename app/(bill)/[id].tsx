import { StyledButton } from "@/components/button/button";
import { BodyContainer } from "@/components/containers/body-container";
import { FooterContainer } from "@/components/containers/footer-container";
import { HeaderContainer } from "@/components/containers/header-container";
import { OuterContainer } from "@/components/containers/outer-container";
import CreateTransaction from "@/components/create-transaction/create-transaction-sheet";
import UnderlinedTabs from "@/components/my-bill/my-tab/underlined-tabs";
import HeaderInfo from "@/components/my-bill/summary/HeaderInfo";
import BillHeaderSkeleton from "@/components/skeletons/bill-header-skeleton";
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

// Define the possible product types
type ProductType = "free.plan" | "com.mytab.1week" | "com.mytab.2weeks";

const BillScreen = () => {
  /** ---------- States  and variables---------- */
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
  const [loadingTransactions, setloadingTransactions] = useState(true);
  const [summaryInfo, setSummaryInfo] = useState<SummaryInfo[]>([]);
  const [loadingSummaryInfo, setLoadingSummaryInfo] = useState(true);
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  //const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const [openCreateTxn, setOpenCreateTxn] = useState(false);
  const [isMaxTxnsReached, setIsMaxTxnsReached] = useState(false);
  const [maxTransactions, setMaxTransactions] = useState(0);

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

  // Type guard to check if a value is a valid ProductType
  const isProductType = (value: string): value is ProductType => {
    return ["free.plan", "com.mytab.1week", "com.mytab.2weeks"].includes(value);
  };

  /** ---------- UseEffects ---------- */

  /** fetch summary info */
  useEffect(() => {
    async function fetchSummaryInfo() {
      if (id) {
        const data = await getBillSummaryInfo(Number(id));
        setSummaryInfo(data);

        if (data) setLoadingSummaryInfo(false);
      }
    }
    fetchSummaryInfo();
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
        if (transactionData) setloadingTransactions(false);
      }
    }
    fetchTransactions();
  }, [userId, txnName, deletedTxnName, editedTxnName]);

  //Fetch bill info
  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));

        if (data) {
          setBillInfo(data);
        }
      }
    }
    fetchBillInfo();
  }, [id]);

  useEffect(() => {
    if (billInfo.length === 0) {
      // Handle the case where billInfo is empty
      setIsMaxTxnsReached(false);
      return;
    }

    const transactionNumber = transactions.length;
    const productType = billInfo[0]?.productId;

    // Mapping product types to their respective max transactions
    const planMaxTransactions: Record<ProductType, number> = {
      "free.plan": 20,
      "com.mytab.1week": 100,
      "com.mytab.2weeks": 200,
    };

    // Determine if the max transaction number is reached based on the plan
    if (productType && isProductType(productType)) {
      const _maxTransactions = planMaxTransactions[productType];
      setIsMaxTxnsReached(transactionNumber >= _maxTransactions);
      setMaxTransactions(_maxTransactions);
      console.log("setIsMaxTxnsReached", transactionNumber >= _maxTransactions);
      console.log("transactionNumber", transactionNumber);
      console.log("productType", productType);
    } else {
      // Handle unexpected product types if necessary
      //setIsMaxTxnsReached(false);
      console.error("Error not a valid productType: ", productType);
    }
  }, [billInfo, transactions]);

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
        maxTransaction={maxTransactions}
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
          {!loadingSummaryInfo ? (
            <HeaderInfo
              summaryInfo={summaryInfo}
              billName={billInfo[0]?.name}
              height={windowHeight * 0.15}
              width={windowWidth}
              isMaxTransactionsReached={isMaxTxnsReached}
              maxTransactions={maxTransactions}
            />
          ) : (
            <BillHeaderSkeleton
              height={windowHeight * 0.15}
              width={windowWidth}
              show={true}
              colorMode={"light"}
            />
          )}
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
            loadingTransactions={loadingTransactions}
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
          disabled={billInfo[0]?.isLocked || isMaxTxnsReached}
          create={!billInfo[0]?.isLocked && !isMaxTxnsReached}
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
